-- Update resources table to include wellness_tools category
ALTER TABLE public.resources 
DROP CONSTRAINT IF EXISTS resources_category_check;

ALTER TABLE public.resources 
ADD CONSTRAINT resources_category_check 
CHECK (category IN ('article','guide','podcast','wellness_tools'));