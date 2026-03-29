import type { Person } from '@/lib/types';

interface Props {
  persons: Person[];
}

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
    const uniqueChildren = childPersons.filter(c => {
      if (seen.has(c.person_id)) return false;
      seen.add(c.person_id);
      return true;
    });

    return {
      person, spouse,
      children: uniqueChildren.sort((a, b) => (a.birth_year || 0) - (b.birth_year || 0)).map(c => buildNode(c)),
    };
  }

  const rootIds = new Set<string>();
  return actualRoots
    .filter(r => { if (rootIds.has(r.person_id)) return false; rootIds.add(r.person_id); return true; })
    .map(r => buildNode(r));
}

export default function FamilyTreeView({ persons }: Props) {
  if (persons.length === 0) return null;
  const tree = buildTree(persons);

  return (
    <div className="overflow-x-auto pb-4">
      <div className="min-w-[500px]">
        {tree.map(node => (
          <TreeNodeView key={node.person.person_id} node={node} level={0} />
        ))}
      </div>
    </div>
  );
}

function TreeNodeView({ node, level }: { node: TreeNode; level: number }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-2">
        <PersonNode person={node.person} />
        {node.spouse && (
          <>
            <div className="w-6 h-0.5 bg-primary/40" />
            <PersonNode person={node.spouse} />
          </>
        )}
      </div>

      {node.children.length > 0 && (
        <div className="flex flex-col items-center mt-2">
          <div className="w-0.5 h-4 bg-border" />
          {node.children.length > 1 && (
            <div className="h-0.5 bg-border" style={{ width: `${Math.max(node.children.length - 1, 1) * 160}px` }} />
          )}
          <div className="flex items-start gap-6 mt-0">
            {node.children.map(child => (
              <div key={child.person.person_id} className="flex flex-col items-center">
                <div className="w-0.5 h-4 bg-border" />
                <TreeNodeView node={child} level={level + 1} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PersonNode({ person }: { person: Person }) {
  const isMale = person.gender === 'MALE';
  const deceased = !!person.death_year;

  return (
    <div className={`flex flex-col items-center p-3 rounded-xl border-2 min-w-[120px] transition-colors ${
      deceased ? 'border-muted bg-muted/50 opacity-70' : isMale ? 'border-primary/30 bg-primary/5' : 'border-accent/30 bg-accent/5'
    }`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mb-1 ${
        isMale ? 'bg-primary/20 text-primary' : 'bg-accent/20 text-accent'
      }`}>
        {person.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
      </div>
      <p className="text-sm font-semibold text-center leading-tight">{person.name}</p>
      {person.name_devanagari && <p className="text-xs text-muted-foreground">{person.name_devanagari}</p>}
      <p className="text-xs text-muted-foreground">
        {person.birth_year || '?'}{deceased ? ` – ${person.death_year}` : ''}
      </p>
    </div>
  );
}
