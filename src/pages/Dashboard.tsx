import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Users, TreePine, CalendarDays, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { searchFamilies, getFamilies, getAllVisits, getPersonsByFamily, seedDemoData, getRegion } from '@/lib/data';
import type { Family, Visit, Region } from '@/lib/types';

type FamilyWithRegion = Family & { region?: Region | null; regions?: any; surnames?: any };

export default function Dashboard() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FamilyWithRegion[]>([]);
  const [recentVisits, setRecentVisits] = useState<(Visit & { family?: Family | null; region?: Region | null })[]>([]);
  const [stats, setStats] = useState({ families: 0, persons: 0, visits: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      await seedDemoData();
      const families = await getFamilies();
      const visits = await getAllVisits();
      let totalPersons = 0;
      for (const f of families) {
        const p = await getPersonsByFamily(f.family_id);
        totalPersons += p.length;
      }
      setStats({ families: families.length, persons: totalPersons, visits: visits.length });

      const enriched = await Promise.all(visits.slice(0, 5).map(async v => {
        const family = families.find(f => f.family_id === v.family_id);
        const region = family?.region_id ? await getRegion(family.region_id) : null;
        return { ...v, family, region };
      }));
      setRecentVisits(enriched);
      setLoading(false);
    }
    init();
  }, []);

  useEffect(() => {
    if (query.trim()) {
      searchFamilies(query).then(setResults);
    } else {
      setResults([]);
    }
  }, [query]);

  return (
    <div className="space-y-8">
      {/* Search */}
      <div className="relative max-w-2xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by gotra, village, surname, or ancestor name..."
          className="pl-12 h-14 text-lg rounded-xl bg-card border-2 focus-visible:ring-primary"
        />
      </div>

      {/* Search Results */}
      {query.trim() && (
        <div className="max-w-2xl mx-auto space-y-3">
          <p className="text-sm text-muted-foreground">{results.length} result(s) found</p>
          {results.map(family => (
            <Link key={family.family_id} to={`/families/${family.family_id}`}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-display font-semibold text-lg">{family.gotra}</p>
                    <p className="text-sm text-muted-foreground">
                      {(family.regions as any)?.village || ''}, {(family.regions as any)?.district || ''}
                      {(family.surnames as any)?.surname ? ` — ${(family.surnames as any).surname}` : ''}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          ))}
          {results.length === 0 && (
            <Card><CardContent className="py-8 text-center text-muted-foreground">No families found matching "{query}"</CardContent></Card>
          )}
        </div>
      )}

      {/* Stats & Recent Visits */}
      {!query.trim() && !loading && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Families', value: stats.families, icon: Users, color: 'text-primary' },
              { label: 'Individuals', value: stats.persons, icon: TreePine, color: 'text-accent' },
              { label: 'Visits Logged', value: stats.visits, icon: CalendarDays, color: 'text-gold' },
            ].map(stat => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className="animate-fade-in">
                  <CardContent className="flex items-center gap-4 py-6">
                    <div className={`w-12 h-12 rounded-xl bg-secondary flex items-center justify-center ${stat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-3xl font-display font-bold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-display font-semibold">Recent Visits</h3>
              <Link to="/visits" className="text-sm text-primary hover:underline">View all →</Link>
            </div>
            <div className="space-y-3">
              {recentVisits.map(visit => (
                <Card key={visit.visit_id} className="animate-fade-in">
                  <CardContent className="flex items-start justify-between py-4">
                    <div>
                      <p className="font-semibold">{visit.family?.gotra} — {visit.region?.village || visit.visit_place}</p>
                      <p className="text-sm text-muted-foreground mt-1">{visit.purpose}{visit.notes ? `: ${visit.notes}` : ''}</p>
                    </div>
                    <span className="text-sm text-muted-foreground whitespace-nowrap ml-4">
                      {visit.visit_year || new Date(visit.created_at).getFullYear()}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
