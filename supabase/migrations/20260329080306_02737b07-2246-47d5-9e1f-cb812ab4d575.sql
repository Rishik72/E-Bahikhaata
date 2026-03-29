
-- 1. Communities
CREATE TABLE public.communities (
  community_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_name VARCHAR(120) NOT NULL,
  description TEXT
);
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read communities" ON public.communities FOR SELECT USING (true);
CREATE POLICY "Anyone can insert communities" ON public.communities FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update communities" ON public.communities FOR UPDATE USING (true);

-- 2. Regions
CREATE TABLE public.regions (
  region_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country VARCHAR(80),
  state VARCHAR(80),
  district VARCHAR(80),
  taluka VARCHAR(80),
  village VARCHAR(120)
);
CREATE INDEX idx_region_search ON public.regions (state, district, village);
ALTER TABLE public.regions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read regions" ON public.regions FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert regions" ON public.regions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update regions" ON public.regions FOR UPDATE TO authenticated USING (true);

-- 3. Pandits
CREATE TABLE public.pandits (
  pandit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(120) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(120),
  assigned_state VARCHAR(80),
  assigned_district VARCHAR(80),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.pandits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read pandits" ON public.pandits FOR SELECT USING (true);
CREATE POLICY "Anyone can insert pandits" ON public.pandits FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update pandits" ON public.pandits FOR UPDATE USING (true);

-- 4. Surnames
CREATE TABLE public.surnames (
  surname_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  surname VARCHAR(120) NOT NULL,
  community_id UUID REFERENCES public.communities(community_id)
);
CREATE INDEX idx_surname ON public.surnames (surname);
ALTER TABLE public.surnames ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read surnames" ON public.surnames FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert surnames" ON public.surnames FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update surnames" ON public.surnames FOR UPDATE TO authenticated USING (true);

-- 5. Families
CREATE TABLE public.families (
  family_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  surname_id UUID REFERENCES public.surnames(surname_id),
  region_id UUID REFERENCES public.regions(region_id),
  gotra VARCHAR(120),
  kuldevta VARCHAR(120),
  root_ancestor_name VARCHAR(120),
  created_by_pandit UUID REFERENCES public.pandits(pandit_id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_family_search ON public.families (surname_id, region_id, gotra);
ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read families" ON public.families FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert families" ON public.families FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update families" ON public.families FOR UPDATE TO authenticated USING (true);

-- 6. Persons (with father_name, mother_name, profession)
CREATE TABLE public.persons (
  person_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES public.families(family_id),
  name VARCHAR(120) NOT NULL,
  name_devanagari VARCHAR(120),
  gender VARCHAR(20),
  birth_year INT,
  death_year INT,
  father_id UUID REFERENCES public.persons(person_id),
  mother_id UUID REFERENCES public.persons(person_id),
  father_name VARCHAR(120),
  mother_name VARCHAR(120),
  profession VARCHAR(120),
  spouse_name VARCHAR(120),
  is_root_ancestor BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_person_family ON public.persons (family_id);
CREATE INDEX idx_person_name ON public.persons (name);
ALTER TABLE public.persons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read persons" ON public.persons FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert persons" ON public.persons FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update persons" ON public.persons FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated can delete persons" ON public.persons FOR DELETE TO authenticated USING (true);

-- 7. Visits
CREATE TABLE public.visits (
  visit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES public.families(family_id),
  person_id UUID REFERENCES public.persons(person_id),
  visit_year INT,
  visit_place VARCHAR(120),
  purpose VARCHAR(120),
  notes TEXT,
  added_by_pandit UUID REFERENCES public.pandits(pandit_id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_visit_family ON public.visits (family_id);
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read visits" ON public.visits FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert visits" ON public.visits FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update visits" ON public.visits FOR UPDATE TO authenticated USING (true);

-- 8. Documents
CREATE TABLE public.documents (
  document_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(visit_id),
  document_type VARCHAR(50),
  file_url TEXT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read documents" ON public.documents FOR SELECT USING (true);
CREATE POLICY "Anyone can insert documents" ON public.documents FOR INSERT WITH CHECK (true);

-- 9. Audit Logs
CREATE TABLE public.audit_logs (
  log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(50),
  entity_id UUID,
  action VARCHAR(20),
  changed_by UUID,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  old_data JSONB,
  new_data JSONB
);
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read audit_logs" ON public.audit_logs FOR SELECT USING (true);
CREATE POLICY "Anyone can insert audit_logs" ON public.audit_logs FOR INSERT WITH CHECK (true);

-- Audit trigger
CREATE OR REPLACE FUNCTION public.log_audit()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE entity_pk UUID;
BEGIN
  IF TG_TABLE_NAME = 'persons' THEN entity_pk := NEW.person_id;
  ELSIF TG_TABLE_NAME = 'families' THEN entity_pk := NEW.family_id;
  ELSIF TG_TABLE_NAME = 'visits' THEN entity_pk := NEW.visit_id;
  END IF;
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_logs (entity_type, entity_id, action, new_data) VALUES (TG_TABLE_NAME, entity_pk, 'INSERT', to_jsonb(NEW));
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_logs (entity_type, entity_id, action, old_data, new_data) VALUES (TG_TABLE_NAME, entity_pk, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW));
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER audit_persons AFTER INSERT OR UPDATE ON public.persons FOR EACH ROW EXECUTE FUNCTION public.log_audit();
CREATE TRIGGER audit_families AFTER INSERT OR UPDATE ON public.families FOR EACH ROW EXECUTE FUNCTION public.log_audit();
CREATE TRIGGER audit_visits AFTER INSERT OR UPDATE ON public.visits FOR EACH ROW EXECUTE FUNCTION public.log_audit();

-- Auto-create pandit on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.pandits (user_id, name, email) VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'Pandit'), NEW.email);
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
