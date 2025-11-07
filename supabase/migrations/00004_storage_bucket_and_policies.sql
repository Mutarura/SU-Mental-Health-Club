-- Create public-assets bucket and storage RLS policies (idempotent)

-- Create bucket (public so reads don’t require auth)
SELECT storage.create_bucket('public-assets', public := true);

-- Storage RLS is applied on storage.objects table
-- Policies limited to public-assets bucket

-- Public read
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Read public-assets'
  ) THEN
    EXECUTE 'CREATE POLICY "Read public-assets"
             ON storage.objects FOR SELECT
             USING (bucket_id = ''public-assets'')';
  END IF;
END $$;

-- Authenticated insert
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Insert public-assets (auth)'
  ) THEN
    EXECUTE 'CREATE POLICY "Insert public-assets (auth)"
             ON storage.objects FOR INSERT TO authenticated
             WITH CHECK (bucket_id = ''public-assets'')';
  END IF;
END $$;

-- Authenticated update
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Update public-assets (auth)'
  ) THEN
    EXECUTE 'CREATE POLICY "Update public-assets (auth)"
             ON storage.objects FOR UPDATE TO authenticated
             USING (bucket_id = ''public-assets'')
             WITH CHECK (bucket_id = ''public-assets'')';
  END IF;
END $$;

-- Authenticated delete
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Delete public-assets (auth)'
  ) THEN
    EXECUTE 'CREATE POLICY "Delete public-assets (auth)"
             ON storage.objects FOR DELETE TO authenticated
             USING (bucket_id = ''public-assets'')';
  END IF;
END $$;