-- Schema cleanup: Remove unused tables and keep only essential ones
-- Keep: quotes, monthly_awareness, events, resources, council_leaders, footer
-- Remove: team_members, counselors (already removed)

-- Drop unused tables
DROP TABLE IF EXISTS public.team_members CASCADE;
DROP TABLE IF EXISTS public.about CASCADE;
DROP TABLE IF EXISTS public.footer CASCADE;
DROP TABLE IF EXISTS public.admins CASCADE;

-- Rename leaders table to council_leaders for consistency
-- Avoid rename conflict: only rename if council_leaders does not already exist
DO $$
BEGIN
  IF to_regclass('public.council_leaders') IS NULL
     AND to_regclass('public.leaders') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.leaders RENAME TO council_leaders';
  END IF;
END $$;

-- Ensure all essential tables have proper structure
-- Update quotes table to ensure it has created_at
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update events table to ensure proper structure
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update resources table to ensure proper structure  
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Clear existing data from tables we're keeping for fresh start
-- Do not clear data here; leave content intact for production
-- DELETE FROM events;
-- DELETE FROM resources;
-- DELETE FROM quotes;