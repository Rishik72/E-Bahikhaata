import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, ArrowRight, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { getFamilies, getPersonsByFamily, getRegion } from '@/lib/data';
import type { Family, Region } from '@/lib/types';

type FamilyWithInfo = Family & { memberCount: number; region?: Region | null };

export default function FamilyList() {
  const [families, setFamilies] = useState<FamilyWithInfo[]>([]);

  useEffect(() => {
    async function load() {
      const fams = await getFamilies();
      const enriched = await Promise.all(fams.map(async f => {
        const members = await getPersonsByFamily(f.family_id);
        const region = f.region_id ? await getRegion(f.region_id) : null;
        return { ...f, memberCount: members.length, region };
      }));
      setFamilies(enriched);
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold">All Families</h2>
          <p className="text-muted-foreground">{families.length} family records</p>
        </div>
        <Link
          to="/families/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> Add Family
        </Link>
      </div>

      <div className="grid gap-4">
        {families.map((family, i) => (
          <Link key={family.family_id} to={`/families/${family.family_id}`}>
            <Card className="hover:border-primary/50 transition-colors cursor-pointer animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
              <CardContent className="flex items-center justify-between py-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                    <span className="font-display font-bold text-lg text-primary">{family.gotra?.[0] || '?'}</span>
                  </div>
                  <div>
                    <p className="font-display font-semibold text-lg">{family.gotra}</p>
                    <p className="text-sm text-muted-foreground">
                      {family.region?.village || ''}{family.region?.district ? `, ${family.region.district}` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium">{family.memberCount} members</p>
                    <p className="text-xs text-muted-foreground">Since {new Date(family.created_at).getFullYear()}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
