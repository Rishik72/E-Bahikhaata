import jsPDF from 'jspdf';
import type { Person, Family, Region } from './types';

interface TreeNode {
  person: Person;
  spouse?: Person;
  children: TreeNode[];
}

function buildTree(persons: Person[]): TreeNode[] {
  const roots = persons.filter(p => !p.father_id && !p.mother_id && p.gender === 'MALE');
  const actualRoots = roots.length > 0 ? roots : persons.filter(p => !p.father_id);

  function buildNode(person: Person): TreeNode {
    const spouse = persons.find(p => p.spouse_name === person.name && p.person_id !== person.person_id)
      || persons.find(p => person.spouse_name === p.name && p.person_id !== person.person_id);

    const childPersons = persons.filter(p =>
      p.father_id === person.person_id || p.mother_id === person.person_id ||
      (spouse && (p.father_id === spouse.person_id || p.mother_id === spouse.person_id))
    );
    const seen = new Set<string>();
    const uniqueChildren = childPersons.filter(c => { if (seen.has(c.person_id)) return false; seen.add(c.person_id); return true; });

    return {
      person, spouse,
      children: uniqueChildren.sort((a, b) => (a.birth_year || 0) - (b.birth_year || 0)).map(c => buildNode(c)),
    };
  }

  const rootIds = new Set<string>();
  return actualRoots.filter(r => { if (rootIds.has(r.person_id)) return false; rootIds.add(r.person_id); return true; }).map(r => buildNode(r));
}

function measureNode(node: TreeNode): number {
  if (node.children.length === 0) return 1;
  return node.children.reduce((sum, c) => sum + measureNode(c), 0);
}

export function generateFamilyPdf(family: Family, persons: Person[], region?: Region | null) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // Title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Vanshavali / Family Tree', pageW / 2, 15, { align: 'center' });

  // Family info header
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const info = [
    `Gotra: ${family.gotra || '-'}`,
    `Kuldevta: ${family.kuldevta || '-'}`,
    region ? `Village: ${region.village}, ${region.district}` : '',
    `Root Ancestor: ${family.root_ancestor_name || '-'}`,
    (family as any).current_location ? `Location: ${(family as any).current_location}` : '',
  ].filter(Boolean).join('   |   ');
  doc.text(info, pageW / 2, 22, { align: 'center' });

  doc.setDrawColor(200, 150, 80);
  doc.setLineWidth(0.5);
  doc.line(20, 26, pageW - 20, 26);

  // Draw tree
  const tree = buildTree(persons);
  const nodeW = 52;
  const nodeH = 26;
  const levelGap = 34;
  const startY = 34;

  function drawNode(node: TreeNode, cx: number, cy: number) {
    drawPersonBox(doc, node.person, cx - nodeW / 2, cy, nodeW, nodeH);

    if (node.spouse) {
      const sx = cx + nodeW / 2 + 4;
      doc.setDrawColor(180, 120, 60);
      doc.setLineWidth(0.3);
      doc.line(cx + nodeW / 2, cy + nodeH / 2, sx, cy + nodeH / 2);
      drawPersonBox(doc, node.spouse, sx, cy, nodeW, nodeH);
    }

    if (node.children.length === 0) return;

    const totalWidth = node.children.reduce((s, c) => s + measureNode(c) * (nodeW + 12), 0);
    let childX = cx - totalWidth / 2;
    const childY = cy + levelGap;

    const coupleCenter = node.spouse ? cx + nodeW / 2 + 2 : cx;
    doc.setDrawColor(160, 140, 120);
    doc.setLineWidth(0.3);
    doc.line(coupleCenter, cy + nodeH, coupleCenter, cy + nodeH + 6);

    const childCenters: number[] = [];
    node.children.forEach(child => {
      const w = measureNode(child) * (nodeW + 12);
      const childCx = childX + w / 2;
      childCenters.push(childCx);
      drawNode(child, childCx, childY);
      childX += w;
    });

    if (childCenters.length > 1) {
      const hLineY = cy + nodeH + 6;
      doc.line(childCenters[0], hLineY, childCenters[childCenters.length - 1], hLineY);
    }

    childCenters.forEach(ccx => {
      doc.line(ccx, cy + nodeH + 6, ccx, childY);
    });
  }

  if (tree.length > 0) {
    drawNode(tree[0], pageW / 2, startY);
  }

  // --- PAGE 2: Detailed member list ---
  doc.addPage();
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(40, 30, 20);
  doc.text('Family Members — Detailed Records', pageW / 2, 15, { align: 'center' });
  doc.setDrawColor(200, 150, 80);
  doc.setLineWidth(0.5);
  doc.line(20, 19, pageW - 20, 19);

  let yPos = 26;
  const lineH = 5;
  const marginL = 20;

  persons.forEach((person, idx) => {
    if (yPos > pageH - 25) {
      doc.addPage();
      yPos = 15;
    }

    // Name header
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40, 30, 20);
    const genderSymbol = person.gender === 'MALE' ? '♂' : person.gender === 'FEMALE' ? '♀' : '⚥';
    doc.text(`${idx + 1}. ${person.name} ${genderSymbol}`, marginL, yPos);
    if (person.name_devanagari) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`  (${person.name_devanagari})`, marginL + doc.getTextWidth(`${idx + 1}. ${person.name} ${genderSymbol}`), yPos);
    }
    yPos += lineH;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 70, 60);

    const details: string[] = [];
    const years = `${person.birth_year || '?'}${person.death_year ? ' – ' + person.death_year : ''}`;
    details.push(`Born: ${years}`);
    if ((person as any).profession) details.push(`Profession: ${(person as any).profession}`);
    if ((person as any).current_location) details.push(`Location: ${(person as any).current_location}`);
    if (person.spouse_name) details.push(`Spouse: ${person.spouse_name}`);
    if ((person as any).father_name) details.push(`Father: ${(person as any).father_name}`);
    if ((person as any).mother_name) details.push(`Mother: ${(person as any).mother_name}`);
    if ((person as any).num_sons != null) details.push(`Sons: ${(person as any).num_sons}`);
    if ((person as any).num_daughters != null) details.push(`Daughters: ${(person as any).num_daughters}`);
    if ((person as any).husband_surname) details.push(`Husband's Surname: ${(person as any).husband_surname}`);
    if ((person as any).extra_info) details.push(`Notes: ${(person as any).extra_info}`);

    // Print 2 details per line
    for (let i = 0; i < details.length; i += 3) {
      const line = details.slice(i, i + 3).join('   |   ');
      doc.text(line, marginL + 4, yPos);
      yPos += lineH - 1;
    }

    yPos += 3;
  });

  // Footer on all pages
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(150);
    doc.text(`Generated on ${new Date().toLocaleDateString('en-IN')}  |  Digital Vanshavali System  |  Page ${i}/${totalPages}`, pageW / 2, pageH - 5, { align: 'center' });
  }

  doc.save(`${family.gotra || 'family'}_vanshavali.pdf`);
}

function drawPersonBox(doc: jsPDF, person: Person, x: number, y: number, w: number, h: number) {
  const isMale = person.gender === 'MALE';
  const deceased = !!person.death_year;

  if (deceased) {
    doc.setFillColor(230, 225, 220);
  } else if (isMale) {
    doc.setFillColor(255, 245, 230);
  } else {
    doc.setFillColor(255, 235, 240);
  }
  doc.setDrawColor(180, 150, 120);
  doc.setLineWidth(0.3);
  doc.roundedRect(x, y, w, h, 2, 2, 'FD');

  // Name
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(40, 30, 20);
  const name = person.name.length > 22 ? person.name.slice(0, 20) + '...' : person.name;
  doc.text(name, x + w / 2, y + 5, { align: 'center' });

  // Years
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100);
  const years = `${person.birth_year || '?'}${deceased ? ' – ' + person.death_year : ''}`;
  doc.text(years, x + w / 2, y + 9.5, { align: 'center' });

  // Profession
  if ((person as any).profession) {
    doc.setFontSize(5.5);
    doc.setTextColor(120);
    const prof = (person as any).profession.length > 18 ? (person as any).profession.slice(0, 16) + '..' : (person as any).profession;
    doc.text(prof, x + w / 2, y + 13, { align: 'center' });
  }

  // Location
  if ((person as any).current_location) {
    doc.setFontSize(5);
    doc.setTextColor(130);
    const loc = (person as any).current_location.length > 20 ? (person as any).current_location.slice(0, 18) + '..' : (person as any).current_location;
    doc.text(`📍 ${loc}`, x + w / 2, y + 16, { align: 'center' });
  }

  // Gender icon
  doc.setFontSize(5.5);
  doc.setTextColor(160);
  doc.text(person.gender === 'MALE' ? '♂' : '♀', x + w / 2, y + h - 2, { align: 'center' });

  // Sons/daughters badge
  const ns = (person as any).num_sons;
  const nd = (person as any).num_daughters;
  if (ns != null || nd != null) {
    doc.setFontSize(5);
    doc.setTextColor(100);
    const childInfo = [ns != null ? `${ns}S` : '', nd != null ? `${nd}D` : ''].filter(Boolean).join('/');
    doc.text(childInfo, x + w - 2, y + h - 2, { align: 'right' });
  }
}
