import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { getAllVisits, getFamily, getRegion } from '@/lib/data';
import type { Visit, Family, Region } from '@/lib/types';

type VisitWithInfo = Visit & { family?: Family | null; region?: Region | null };

export default function VisitLog() {
  const [visits, setVisits] = useState<VisitWithInfo[]>([]);

  useEffect(() => {
    async function load() {
      const allVisits = await getAllVisits();
      const enriched = await Promise.all(allVisits.map(async v => {
        const family = await getFamily(v.family_id);
        const region = family?.region_id ? await getRegion(family.region_id) : null;
        return { ...v, family, region };
      }));
      setVisits(enriched);
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold">Visit Log</h2>
        <p className="text-muted-foreground">All recorded family visits</p>
      </div>

      <div className="space-y-3">
        {visits.map((visit, i) => (
          <Link key={visit.visit_id} to={`/families/${visit.family_id}`}>
            <Card className="hover:border-primary/50 transition-colors cursor-pointer animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
              <CardContent className="flex items-start justify-between py-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mt-1">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{visit.family?.gotra} — {visit.region?.village || visit.visit_place}</p>
                    <p className="text-sm text-muted-foreground mt-1">{visit.purpose}{visit.notes ? `: ${visit.notes}` : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    {visit.visit_year || new Date(visit.created_at).getFullYear()}
                  </span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        {visits.length === 0 && (
          <Card><CardContent className="py-12 text-center text-muted-foreground">No visits recorded yet.</CardContent></Card>
        )}
      </div>
    </div>
  );
}
