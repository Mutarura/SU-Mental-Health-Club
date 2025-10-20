ALTER TABLE public.monthly_awareness
  ADD COLUMN IF NOT EXISTS banner_url TEXT,
  ADD COLUMN IF NOT EXISTS caption TEXT;