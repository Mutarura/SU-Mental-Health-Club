-- Schema cleanup: Remove unused tables and keep only essential ones
-- Keep: quotes, monthly_awareness, events, resources, leaders (renamed to council_leaders)
-- Remove: team_members, about, footer, counselors (already removed), admins

-- Drop unused tables
DROP TABLE IF EXISTS public.team_members CASCADE;
DROP TABLE IF EXISTS public.about CASCADE;
DROP TABLE IF EXISTS public.footer CASCADE;
DROP TABLE IF EXISTS public.admins CASCADE;

-- Rename leaders table to council_leaders for consistency
ALTER TABLE IF EXISTS public.leaders RENAME TO council_leaders;

-- Ensure all essential tables have proper structure
-- Update quotes table to ensure it has created_at
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update events table to ensure proper structure
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update resources table to ensure proper structure  
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Clear existing data from tables we're keeping for fresh start
DELETE FROM events;
DELETE FROM resources;
DELETE FROM quotes;