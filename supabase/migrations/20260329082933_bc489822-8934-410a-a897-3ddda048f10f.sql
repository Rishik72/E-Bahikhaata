
ALTER TABLE public.families ADD COLUMN IF NOT EXISTS current_location character varying DEFAULT NULL;

ALTER TABLE public.persons ADD COLUMN IF NOT EXISTS extra_info text DEFAULT NULL;
ALTER TABLE public.persons ADD COLUMN IF NOT EXISTS num_sons integer DEFAULT NULL;
ALTER TABLE public.persons ADD COLUMN IF NOT EXISTS num_daughters integer DEFAULT NULL;
ALTER TABLE public.persons ADD COLUMN IF NOT EXISTS husband_surname character varying DEFAULT NULL;
ALTER TABLE public.persons ADD COLUMN IF NOT EXISTS current_location character varying DEFAULT NULL;
