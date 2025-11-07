-- Restore admins table for RLS policies and seed one admin (idempotent)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Minimal policies to allow reads by authenticated users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'admins'
      AND policyname = 'Allow authenticated users to read admins'
  ) THEN
    EXECUTE 'CREATE POLICY "Allow authenticated users to read admins"
             ON public.admins FOR SELECT TO authenticated USING (true)';
  END IF;
END $$;

-- Seed at least one admin used in RLS checks
INSERT INTO public.admins (email, role)
VALUES ('ronald.mutarura@strathmore.edu', 'admin')
ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role;