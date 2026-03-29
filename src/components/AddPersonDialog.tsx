import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createPerson, updatePerson, autoLinkParents } from '@/lib/data';
import type { Person } from '@/lib/types';

interface Props {
  familyId: string;
  persons: Person[];
  editPerson?: Person | null;
  onClose: () => void;
}

export default function AddPersonDialog({ familyId, persons, editPerson, onClose }: Props) {
  const [form, setForm] = useState({
    name: '',
    name_devanagari: '',
    gender: 'MALE',
    birth_year: '',
    death_year: '',
    father_id: '',
    mother_id: '',
    father_name: '',
    mother_name: '',
    spouse_name: '',
    spouse_id: '',
    profession: '',
    is_root_ancestor: false,
    extra_info: '',
    num_sons: '',
    num_daughters: '',
    husband_surname: '',
    current_location: '',
  });

  useEffect(() => {
    if (editPerson) {
      setForm({
        name: editPerson.name || '',
        name_devanagari: editPerson.name_devanagari || '',
        gender: editPerson.gender || 'MALE',
        birth_year: editPerson.birth_year?.toString() || '',
        death_year: editPerson.death_year?.toString() || '',
        father_id: editPerson.father_id || '',
        mother_id: editPerson.mother_id || '',
        father_name: (editPerson as any).father_name || '',
        mother_name: (editPerson as any).mother_name || '',
        spouse_name: editPerson.spouse_name || '',
        spouse_id: '',
        profession: (editPerson as any).profession || '',
        is_root_ancestor: editPerson.is_root_ancestor || false,
        extra_info: (editPerson as any).extra_info || '',
        num_sons: (editPerson as any).num_sons?.toString() || '',
        num_daughters: (editPerson as any).num_daughters?.toString() || '',
        husband_surname: (editPerson as any).husband_surname || '',
        current_location: (editPerson as any).current_location || '',
      });
    }
  }, [editPerson]);

  const isMarried = !!form.spouse_name || !!form.spouse_id;
  const isFemale = form.gender === 'FEMALE';

  const handleSpouseSelect = (personId: string) => {
    const sp = persons.find(p => p.person_id === personId);
    setForm(f => ({
      ...f,
      spouse_id: personId,
      spouse_name: sp?.name || f.spouse_name,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = {
      family_id: familyId,
      name: form.name,
      name_devanagari: form.name_devanagari || undefined,
      gender: form.gender,
      birth_year: form.birth_year ? parseInt(form.birth_year) : undefined,
      death_year: form.death_year ? parseInt(form.death_year) : undefined,
      father_id: form.father_id || undefined,
      mother_id: form.mother_id || undefined,
      father_name: form.father_name || undefined,
      mother_name: form.mother_name || undefined,
      spouse_name: form.spouse_name || undefined,
      profession: form.profession || undefined,
      is_root_ancestor: form.is_root_ancestor,
      extra_info: form.extra_info || undefined,
      num_sons: form.num_sons ? parseInt(form.num_sons) : undefined,
      num_daughters: form.num_daughters ? parseInt(form.num_daughters) : undefined,
      husband_surname: form.husband_surname || undefined,
      current_location: form.current_location || undefined,
    };

    if (editPerson) {
      const updated = await updatePerson(editPerson.person_id, payload);
      await autoLinkParents(updated, familyId);
    } else {
      const created = await createPerson(payload);
      await autoLinkParents(created, familyId);
    }
    onClose();
  };

  const males = persons.filter(p => p.gender === 'MALE');
  const females = persons.filter(p => p.gender === 'FEMALE');
  const potentialSpouses = form.gender === 'MALE' ? females : males;

  return (
    <div className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-display font-semibold">
            {editPerson ? 'Edit Family Member' : 'Add Family Member'}
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Full Name (English) *</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div>
              <Label>Name (देवनागरी)</Label>
              <Input value={form.name_devanagari} onChange={e => setForm(f => ({ ...f, name_devanagari: e.target.value }))} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Father's Name *</Label>
              <Input value={form.father_name} onChange={e => setForm(f => ({ ...f, father_name: e.target.value }))} placeholder="Father's full name" required />
            </div>
            <div>
              <Label>Mother's Name *</Label>
              <Input value={form.mother_name} onChange={e => setForm(f => ({ ...f, mother_name: e.target.value }))} placeholder="Mother's full name" required />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Gender</Label>
              <Select value={form.gender} onValueChange={v => setForm(f => ({ ...f, gender: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Birth Year</Label>
              <Input type="number" value={form.birth_year} onChange={e => setForm(f => ({ ...f, birth_year: e.target.value }))} placeholder="e.g. 1965" />
            </div>
            <div>
              <Label>Death Year</Label>
              <Input type="number" value={form.death_year} onChange={e => setForm(f => ({ ...f, death_year: e.target.value }))} placeholder="If deceased" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Profession</Label>
              <Input value={form.profession} onChange={e => setForm(f => ({ ...f, profession: e.target.value }))} placeholder="e.g. Farmer, Teacher" />
            </div>
            <div>
              <Label>Current Location</Label>
              <Input value={form.current_location} onChange={e => setForm(f => ({ ...f, current_location: e.target.value }))} placeholder="e.g. Mumbai, Delhi" />
            </div>
          </div>

          {persons.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Link Father (from existing)</Label>
                <Select value={form.father_id} onValueChange={v => setForm(f => ({ ...f, father_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select father" /></SelectTrigger>
                  <SelectContent>
                    {males.map(p => (
                      <SelectItem key={p.person_id} value={p.person_id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Link Mother (from existing)</Label>
                <Select value={form.mother_id} onValueChange={v => setForm(f => ({ ...f, mother_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select mother" /></SelectTrigger>
                  <SelectContent>
                    {females.map(p => (
                      <SelectItem key={p.person_id} value={p.person_id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Spouse section with search */}
          <div className="space-y-2">
            <Label className="font-semibold text-primary">Spouse Details</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Spouse Name</Label>
                <Input value={form.spouse_name} onChange={e => setForm(f => ({ ...f, spouse_name: e.target.value }))} placeholder="Name of spouse" />
              </div>
              {persons.length > 0 && (
                <div>
                  <Label>Link Spouse (from existing)</Label>
                  <Select value={form.spouse_id} onValueChange={handleSpouseSelect}>
                    <SelectTrigger><SelectValue placeholder="Search spouse" /></SelectTrigger>
                    <SelectContent>
                      {potentialSpouses.map(p => (
                        <SelectItem key={p.person_id} value={p.person_id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          {/* Married person fields */}
          {isMarried && (
            <div className="grid grid-cols-2 gap-4 p-3 rounded-lg bg-secondary/50 border border-border">
              <div>
                <Label>Number of Sons</Label>
                <Input type="number" min="0" value={form.num_sons} onChange={e => setForm(f => ({ ...f, num_sons: e.target.value }))} placeholder="0" />
              </div>
              <div>
                <Label>Number of Daughters</Label>
                <Input type="number" min="0" value={form.num_daughters} onChange={e => setForm(f => ({ ...f, num_daughters: e.target.value }))} placeholder="0" />
              </div>
            </div>
          )}

          {/* Female married - husband's surname */}
          {isFemale && isMarried && (
            <div>
              <Label>Husband's Surname (after marriage)</Label>
              <Input value={form.husband_surname} onChange={e => setForm(f => ({ ...f, husband_surname: e.target.value }))} placeholder="e.g. Sharma, Pandey" />
            </div>
          )}

          <div>
            <Label>Extra Info / Notes</Label>
            <Input value={form.extra_info} onChange={e => setForm(f => ({ ...f, extra_info: e.target.value }))} placeholder="Any additional details about this person" />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:opacity-90">
              {editPerson ? 'Update Member' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
