-- Remove counselors table and related functionality
-- This migration removes the deprecated peer counselor feature

-- Drop the counselors table and its policies
DROP POLICY IF EXISTS "Allow public read access to counselors" ON counselors;
DROP POLICY IF EXISTS "Admin write access for counselors" ON counselors;
DROP TABLE IF EXISTS counselors;

-- Update the seed data to remove any counselor references
DELETE FROM counselors WHERE true;