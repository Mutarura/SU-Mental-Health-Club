-- Enable RLS and apply public read + authenticated CRUD for all tables (idempotent)

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.council_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_awareness ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- Helper to create policies idempotently
DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'events','resources','council_members','quotes','monthly_awareness','gallery_events','gallery_images'
  ]) LOOP
    -- Public read
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies
      WHERE schemaname = 'public' AND tablename = t AND policyname = 'Allow public read'
    ) THEN
      EXECUTE format('CREATE POLICY "Allow public read" ON public.%I FOR SELECT USING (true)', t);
    END IF;

    -- Authenticated CRUD: INSERT/UPDATE/DELETE
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies
      WHERE schemaname = 'public' AND tablename = t AND policyname = 'Allow authenticated insert'
    ) THEN
      EXECUTE format('CREATE POLICY "Allow authenticated insert" ON public.%I FOR INSERT TO authenticated WITH CHECK (auth.role() = ''authenticated'')', t);
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM pg_policies
      WHERE schemaname = 'public' AND tablename = t AND policyname = 'Allow authenticated update'
    ) THEN
      EXECUTE format('CREATE POLICY "Allow authenticated update" ON public.%I FOR UPDATE TO authenticated USING (auth.role() = ''authenticated'') WITH CHECK (auth.role() = ''authenticated'')', t);
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM pg_policies
      WHERE schemaname = 'public' AND tablename = t AND policyname = 'Allow authenticated delete'
    ) THEN
      EXECUTE format('CREATE POLICY "Allow authenticated delete" ON public.%I FOR DELETE TO authenticated USING (auth.role() = ''authenticated'')', t);
    END IF;
  END LOOP;
END $$;

-- Realtime publication
DO $$
BEGIN
  -- Add tables to supabase_realtime (ignore duplicates)
  BEGIN EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.events'; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.resources'; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.council_members'; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.quotes'; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.monthly_awareness'; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.gallery_events'; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.gallery_images'; EXCEPTION WHEN duplicate_object THEN NULL; END;
END $$;