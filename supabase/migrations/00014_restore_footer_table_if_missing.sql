-- Restore footer table if missing; Footer.tsx reads this table (idempotent)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.footer (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  med_centre_contact TEXT NOT NULL,
  club_email TEXT NOT NULL,
  emergency_numbers TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.footer ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'footer'
      AND policyname = 'Allow public read access to footer'
  ) THEN
    EXECUTE 'CREATE POLICY "Allow public read access to footer"
             ON public.footer FOR SELECT USING (true)';
  END IF;
END $$;

-- Seed one footer row if table is empty
INSERT INTO public.footer (med_centre_contact, club_email, emergency_numbers)
SELECT '+254 703 034 000', 'mentalhealth@strathmore.edu',
       'Kenya Red Cross: 1199 | Befrienders Kenya: +254 722 178 177 | Emergency: 999'
WHERE NOT EXISTS (SELECT 1 FROM public.footer);