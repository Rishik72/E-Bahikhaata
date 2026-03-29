import { useState } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createVisit } from '@/lib/data';

interface Props {
  familyId: string;
  onClose: () => void;
}

export default function AddVisitDialog({ familyId, onClose }: Props) {
  const [form, setForm] = useState({
    visit_year: new Date().getFullYear().toString(),
    visit_place: '',
    purpose: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createVisit({
      family_id: familyId,
      visit_year: parseInt(form.visit_year),
      visit_place: form.visit_place,
      purpose: form.purpose,
      notes: form.notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-display font-semibold">Log New Visit</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Visit Year</Label>
              <Input type="number" value={form.visit_year} onChange={e => setForm(f => ({ ...f, visit_year: e.target.value }))} required />
            </div>
            <div>
              <Label>Visit Place</Label>
              <Input value={form.visit_place} onChange={e => setForm(f => ({ ...f, visit_place: e.target.value }))} placeholder="e.g. Dashashwamedh Ghat" />
            </div>
          </div>
          <div>
            <Label>Purpose</Label>
            <Input value={form.purpose} onChange={e => setForm(f => ({ ...f, purpose: e.target.value }))} placeholder="e.g. Kartik Purnima, Annual Visit" required />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Additional notes..." rows={3} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:opacity-90">Log Visit</button>
          </div>
        </form>
      </div>
    </div>
  );
}
