-- Ensure council_leaders exists and avoid rename conflicts (idempotent)

DO $$
BEGIN
  IF to_regclass('public.council_leaders') IS NULL THEN
    CREATE TABLE public.council_leaders (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      bio TEXT NOT NULL,
      year TEXT NOT NULL,
      email TEXT NOT NULL,
      linkedin_url TEXT,
      photo_url TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  END IF;

  IF to_regclass('public.leaders') IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.council_leaders) THEN
      INSERT INTO public.council_leaders (name, role, bio, year, email, linkedin_url, photo_url)
      SELECT name, role, bio, year, COALESCE(email, 'unknown@example.com'), linkedin_url, photo_url
      FROM public.leaders;
    END IF;
    DROP TABLE public.leaders CASCADE;
  END IF;
END $$;

-- ... existing code ...

DO $$
BEGIN
  IF to_regclass('public.council_leaders') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.council_leaders ENABLE ROW LEVEL SECURITY';
  END IF;
END $$;

-- ... existing code ...

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'council_leaders'
      AND policyname = 'Allow public read access to council_leaders'
  ) THEN
    EXECUTE 'CREATE POLICY "Allow public read access to council_leaders"
             ON public.council_leaders FOR SELECT USING (true)';
  END IF;
END $$;

-- ... existing code ...