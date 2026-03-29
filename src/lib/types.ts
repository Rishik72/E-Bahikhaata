import type { Tables, TablesInsert } from '@/integrations/supabase/types';

export type Family = Tables<'families'>;
export type FamilyInsert = TablesInsert<'families'>;

export type Person = Tables<'persons'>;
export type PersonInsert = TablesInsert<'persons'>;

export type Visit = Tables<'visits'>;
export type VisitInsert = TablesInsert<'visits'>;

export type Region = Tables<'regions'>;
export type RegionInsert = TablesInsert<'regions'>;

export type Surname = Tables<'surnames'>;
export type Community = Tables<'communities'>;
export type Pandit = Tables<'pandits'>;
export type DocumentRecord = Tables<'documents'>;
export type AuditLog = Tables<'audit_logs'>;
