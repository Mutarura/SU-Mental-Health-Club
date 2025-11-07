-- Fix schema and policies

-- Recreate the admins table
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on the admins table
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read admin data
CREATE POLICY "Allow authenticated users to read admins" ON admins FOR SELECT TO authenticated USING (true);

-- Allow admins to update their own data
CREATE POLICY "Allow admins to update their own data" ON admins FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Allow admins to delete their own data
CREATE POLICY "Allow admins to delete their own data" ON admins FOR DELETE TO authenticated USING (auth.uid() = id);

-- Consolidate the leaders tables
DROP TABLE IF EXISTS leaders;

-- Remove unused tables from seed data
-- (This should be done by editing the 00007_updated_seed_data.sql file)

-- Standardize RLS policies
-- (The policies in 00012_enable_authenticated_admin_writes.sql are correct,
-- so no changes are needed here)