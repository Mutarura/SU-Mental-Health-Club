-- Remove counselors table and related functionality
-- This migration removes the deprecated peer counselor feature
DROP TABLE IF EXISTS public.counselors CASCADE;