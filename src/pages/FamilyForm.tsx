import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createFamily } from '@/lib/data';

export default function FamilyForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ gotra: '', village: '', district: '', kuldevta: '', root_ancestor_name: '', surname: '', current_location: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const family = await createFamily(form);
    navigate(`/families/${family.family_id}`);
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <Card>
        <CardHeader>
          <CardTitle className="font-display">Add New Family (Vanshavali)</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Gotra (गोत्र)</Label>
              <Input value={form.gotra} onChange={e => setForm(f => ({ ...f, gotra: e.target.value }))} placeholder="e.g. Kashyap, Bharadwaj" required />
            </div>
            <div>
              <Label>Surname (कुलनाम)</Label>
              <Input value={form.surname} onChange={e => setForm(f => ({ ...f, surname: e.target.value }))} placeholder="e.g. Sharma, Tripathi" />
            </div>
            <div>
              <Label>Root Ancestor (मूल पूर्वज)</Label>
              <Input value={form.root_ancestor_name} onChange={e => setForm(f => ({ ...f, root_ancestor_name: e.target.value }))} placeholder="Name of the oldest known ancestor" />
            </div>
            <div>
              <Label>Kuldevta (कुलदेवता)</Label>
              <Input value={form.kuldevta} onChange={e => setForm(f => ({ ...f, kuldevta: e.target.value }))} placeholder="Family deity" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Village (गाँव)</Label>
                <Input value={form.village} onChange={e => setForm(f => ({ ...f, village: e.target.value }))} placeholder="Ancestral village" required />
              </div>
              <div>
                <Label>District (जिला)</Label>
                <Input value={form.district} onChange={e => setForm(f => ({ ...f, district: e.target.value }))} placeholder="District" required />
              </div>
            </div>
            <div>
              <Label>Current Location (वर्तमान स्थान)</Label>
              <Input value={form.current_location} onChange={e => setForm(f => ({ ...f, current_location: e.target.value }))} placeholder="e.g. Mumbai, Delhi" />
            </div>
            <button type="submit" className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">
              Create Family Record
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
