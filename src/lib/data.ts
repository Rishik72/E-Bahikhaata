import { supabase } from '@/integrations/supabase/client';
import type { Family, FamilyInsert, Person, PersonInsert, Visit, VisitInsert, Region, RegionInsert } from './types';

// Families
export async function getFamilies(): Promise<Family[]> {
  const { data } = await supabase.from('families').select('*').order('created_at', { ascending: false });
  return data || [];
}

export async function getFamily(id: string): Promise<Family | null> {
  const { data } = await supabase.from('families').select('*').eq('family_id', id).single();
  return data;
}

export async function searchFamilies(query: string): Promise<(Family & { region?: Region | null; surname_name?: string })[]> {
  const q = query.toLowerCase();
  const { data: families } = await supabase.from('families').select('*, regions(*), surnames(*)');
  if (!families) return [];
  return families.filter(f =>
    f.gotra?.toLowerCase().includes(q) ||
    f.root_ancestor_name?.toLowerCase().includes(q) ||
    (f.regions as any)?.village?.toLowerCase().includes(q) ||
    (f.regions as any)?.district?.toLowerCase().includes(q) ||
    (f.surnames as any)?.surname?.toLowerCase().includes(q)
  );
}

export async function createFamily(data: { gotra: string; kuldevta?: string; root_ancestor_name?: string; village: string; district: string; state?: string; surname?: string; current_location?: string }): Promise<Family> {
  const { data: region } = await supabase.from('regions').insert({
    village: data.village,
    district: data.district,
    state: data.state || '',
    country: 'India',
  }).select().single();

  let surname_id: string | undefined;
  if (data.surname) {
    const { data: surname } = await supabase.from('surnames').insert({ surname: data.surname }).select().single();
    surname_id = surname?.surname_id;
  }

  const { data: family, error } = await supabase.from('families').insert({
    gotra: data.gotra,
    kuldevta: data.kuldevta,
    root_ancestor_name: data.root_ancestor_name,
    region_id: region?.region_id,
    surname_id,
    current_location: data.current_location,
  } as any).select().single();

  if (error) throw error;
  return family!;
}

// Persons
export async function getPersonsByFamily(familyId: string): Promise<Person[]> {
  const { data } = await supabase.from('persons').select('*').eq('family_id', familyId).order('birth_year', { ascending: true });
  return data || [];
}

export async function createPerson(data: PersonInsert): Promise<Person> {
  const { data: person, error } = await supabase.from('persons').insert(data).select().single();
  if (error) throw error;
  return person!;
}

export async function updatePerson(personId: string, data: Partial<PersonInsert>): Promise<Person> {
  const { data: person, error } = await supabase.from('persons').update(data).eq('person_id', personId).select().single();
  if (error) throw error;
  return person!;
}

export async function deletePerson(personId: string): Promise<void> {
  const { error } = await supabase.from('persons').delete().eq('person_id', personId);
  if (error) throw error;
}

// Auto-link parents by name
export async function autoLinkParents(person: Person, familyId: string): Promise<void> {
  const persons = await getPersonsByFamily(familyId);

  if ((person as any).father_name && !person.father_id) {
    const father = persons.find(p => p.name.toLowerCase() === (person as any).father_name.toLowerCase() && p.gender === 'MALE');
    if (father) {
      await updatePerson(person.person_id, { father_id: father.person_id });
    }
  }

  if ((person as any).mother_name && !person.mother_id) {
    const mother = persons.find(p => p.name.toLowerCase() === (person as any).mother_name.toLowerCase() && p.gender === 'FEMALE');
    if (mother) {
      await updatePerson(person.person_id, { mother_id: mother.person_id });
    }
  }
}

// Visits
export async function getVisitsByFamily(familyId: string): Promise<Visit[]> {
  const { data } = await supabase.from('visits').select('*').eq('family_id', familyId).order('created_at', { ascending: false });
  return data || [];
}

export async function getAllVisits(): Promise<Visit[]> {
  const { data } = await supabase.from('visits').select('*').order('created_at', { ascending: false }).limit(50);
  return data || [];
}

export async function createVisit(data: VisitInsert): Promise<Visit> {
  const { data: visit, error } = await supabase.from('visits').insert(data).select().single();
  if (error) throw error;
  return visit!;
}

// Regions
export async function getRegion(regionId: string): Promise<Region | null> {
  const { data } = await supabase.from('regions').select('*').eq('region_id', regionId).single();
  return data;
}

// Seed demo data
export async function seedDemoData() {
  const { count } = await supabase.from('families').select('*', { count: 'exact', head: true });
  if (count && count > 0) return;

  const { data: regions } = await supabase.from('regions').insert([
    { village: 'Ramnagar', district: 'Varanasi', state: 'Uttar Pradesh', country: 'India' },
    { village: 'Sarnath', district: 'Varanasi', state: 'Uttar Pradesh', country: 'India' },
    { village: 'Chandauli', district: 'Chandauli', state: 'Uttar Pradesh', country: 'India' },
  ]).select();
  if (!regions) return;

  const { data: surnames } = await supabase.from('surnames').insert([
    { surname: 'Sharma' },
    { surname: 'Tripathi' },
    { surname: 'Pandey' },
  ]).select();
  if (!surnames) return;

  const { data: families } = await supabase.from('families').insert([
    { gotra: 'Kashyap', region_id: regions[0].region_id, surname_id: surnames[0].surname_id, root_ancestor_name: 'Ram Prasad Sharma', kuldevta: 'Shiva' },
    { gotra: 'Bharadwaj', region_id: regions[1].region_id, surname_id: surnames[1].surname_id, root_ancestor_name: 'Hari Om Tripathi', kuldevta: 'Vishnu' },
    { gotra: 'Vasistha', region_id: regions[2].region_id, surname_id: surnames[2].surname_id, root_ancestor_name: 'Shiv Kumar Pandey', kuldevta: 'Hanuman' },
  ]).select();
  if (!families) return;

  const { data: p1 } = await supabase.from('persons').insert({ family_id: families[0].family_id, name: 'Ram Prasad Sharma', name_devanagari: 'राम प्रसाद शर्मा', gender: 'MALE', birth_year: 1940, death_year: 2010, is_root_ancestor: true }).select().single();
  const { data: p2 } = await supabase.from('persons').insert({ family_id: families[0].family_id, name: 'Sita Devi', name_devanagari: 'सीता देवी', gender: 'FEMALE', birth_year: 1945, spouse_name: 'Ram Prasad Sharma' }).select().single();
  const { data: p3 } = await supabase.from('persons').insert({ family_id: families[0].family_id, name: 'Mohan Sharma', name_devanagari: 'मोहन शर्मा', gender: 'MALE', birth_year: 1965, father_id: p1?.person_id, mother_id: p2?.person_id }).select().single();
  const { data: p4 } = await supabase.from('persons').insert({ family_id: families[0].family_id, name: 'Sunita Sharma', name_devanagari: 'सुनीता शर्मा', gender: 'FEMALE', birth_year: 1968, spouse_name: 'Mohan Sharma' }).select().single();
  await supabase.from('persons').insert({ family_id: families[0].family_id, name: 'Rohit Sharma', name_devanagari: 'रोहित शर्मा', gender: 'MALE', birth_year: 1990, father_id: p3?.person_id, mother_id: p4?.person_id });
  await supabase.from('persons').insert({ family_id: families[0].family_id, name: 'Priya Sharma', name_devanagari: 'प्रिया शर्मा', gender: 'FEMALE', birth_year: 1993, father_id: p3?.person_id, mother_id: p4?.person_id });

  await supabase.from('persons').insert({ family_id: families[1].family_id, name: 'Hari Om Tripathi', name_devanagari: 'हरि ओम त्रिपाठी', gender: 'MALE', birth_year: 1950, is_root_ancestor: true });
  await supabase.from('persons').insert({ family_id: families[1].family_id, name: 'Kamla Tripathi', name_devanagari: 'कमला त्रिपाठी', gender: 'FEMALE', birth_year: 1955, spouse_name: 'Hari Om Tripathi' });

  await supabase.from('persons').insert({ family_id: families[2].family_id, name: 'Shiv Kumar Pandey', name_devanagari: 'शिव कुमार पाण्डेय', gender: 'MALE', birth_year: 1960, is_root_ancestor: true });

  await supabase.from('visits').insert([
    { family_id: families[0].family_id, visit_year: 2024, visit_place: 'Dashashwamedh Ghat', purpose: 'Kartik Purnima', notes: 'Updated tree with Rohit\'s marriage.' },
    { family_id: families[0].family_id, visit_year: 2023, visit_place: 'Dashashwamedh Ghat', purpose: 'Makar Sankranti', notes: 'Confirmed death of Ram Prasad ji.' },
    { family_id: families[1].family_id, visit_year: 2024, visit_place: 'Manikarnika Ghat', purpose: 'Annual Visit', notes: 'No new events to record.' },
  ]);
}
