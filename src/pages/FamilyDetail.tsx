import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Calendar, Download, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getFamily, getPersonsByFamily, getVisitsByFamily, getRegion, deletePerson } from '@/lib/data';
import type { Family, Person, Visit, Region } from '@/lib/types';
import FamilyTreeView from '@/components/FamilyTreeView';
import AddPersonDialog from '@/components/AddPersonDialog';
import AddVisitDialog from '@/components/AddVisitDialog';
import { generateFamilyPdf } from '@/lib/generateFamilyPdf';

export default function FamilyDetail() {
  const { id } = useParams<{ id: string }>();
  const [family, setFamily] = useState<Family | null>(null);
  const [region, setRegion] = useState<Region | null>(null);
  const [persons, setPersons] = useState<Person[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [showAddPerson, setShowAddPerson] = useState(false);
  const [showAddVisit, setShowAddVisit] = useState(false);
  const [editPerson, setEditPerson] = useState<Person | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const reload = async () => {
    if (!id) return;
    const f = await getFamily(id);
    setFamily(f);
    if (f?.region_id) {
      const r = await getRegion(f.region_id);
      setRegion(r);
    }
    setPersons(await getPersonsByFamily(id));
    setVisits(await getVisitsByFamily(id));
  };

  useEffect(() => { reload(); }, [id]);

  const handleDelete = async (personId: string) => {
    try {
      await deletePerson(personId);
      setDeleteConfirm(null);
      reload();
    } catch (err: any) {
      alert('Cannot delete: ' + (err.message || 'Unknown error'));
    }
  };

  if (!family) return <div className="text-center py-12 text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6">
      <Link to="/families" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to families
      </Link>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold">{family.gotra}</h2>
          <p className="text-muted-foreground">
            {region ? `${region.village}, ${region.district}` : ''}
            {family.kuldevta ? ` • Kuldevta: ${family.kuldevta}` : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => generateFamilyPdf(family, persons, region)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80"
          >
            <Download className="w-4 h-4" /> Download PDF
          </button>
          <button
            onClick={() => { setEditPerson(null); setShowAddPerson(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
          >
            <Plus className="w-4 h-4" /> Add Member
          </button>
          <button
            onClick={() => setShowAddVisit(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80"
          >
            <Calendar className="w-4 h-4" /> Log Visit
          </button>
        </div>
      </div>

      {persons.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-display">Family Tree</CardTitle>
          </CardHeader>
          <CardContent>
            <FamilyTreeView persons={persons} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="font-display">Members ({persons.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {persons.map(person => (
              <div key={person.person_id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                  person.gender === 'MALE' ? 'bg-primary/20 text-primary' : 'bg-accent/20 text-accent'
                }`}>
                  {person.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{person.name}</p>
                  {person.name_devanagari && <p className="text-sm text-muted-foreground">{person.name_devanagari}</p>}
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">{person.gender}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {person.birth_year || '?'}{person.death_year ? ` – ${person.death_year}` : ''}
                    </span>
                    {person.death_year && <Badge variant="outline" className="text-xs">Deceased</Badge>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => { setEditPerson(person); setShowAddPerson(true); }}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(person.person_id)}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {persons.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No members yet. Add the first family member above.</p>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-lg font-display font-semibold mb-2">Delete Member?</h3>
            <p className="text-sm text-muted-foreground mb-6">This action cannot be undone. The person will be permanently removed.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="px-4 py-2 rounded-lg text-sm font-medium bg-destructive text-destructive-foreground hover:opacity-90">Delete</button>
            </div>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="font-display">Visit History ({visits.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {visits.map(visit => (
            <div key={visit.visit_id} className="p-4 rounded-lg bg-secondary/50">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{visit.purpose}{visit.notes ? ` — ${visit.notes}` : ''}</p>
                  <p className="text-sm text-muted-foreground mt-1">Place: {visit.visit_place || '-'}</p>
                </div>
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {visit.visit_year || new Date(visit.created_at).getFullYear()}
                </span>
              </div>
            </div>
          ))}
          {visits.length === 0 && <p className="text-center text-muted-foreground py-8">No visits recorded yet.</p>}
        </CardContent>
      </Card>

      {showAddPerson && (
        <AddPersonDialog
          familyId={family.family_id}
          persons={persons}
          editPerson={editPerson}
          onClose={() => { setShowAddPerson(false); setEditPerson(null); reload(); }}
        />
      )}
      {showAddVisit && (
        <AddVisitDialog
          familyId={family.family_id}
          onClose={() => { setShowAddVisit(false); reload(); }}
        />
      )}
    </div>
  );
}
