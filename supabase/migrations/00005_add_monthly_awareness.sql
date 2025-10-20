-- Create Monthly Awareness table and policies

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS monthly_awareness (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  month TEXT NOT NULL,
  theme TEXT NOT NULL,
  message TEXT NOT NULL,
  resource_url TEXT,
  icon TEXT NOT NULL DEFAULT 'sun',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE monthly_awareness ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Public read access to monthly_awareness"
ON monthly_awareness FOR SELECT USING (true);

-- Authenticated write (insert/update/delete)
CREATE POLICY "Authenticated write access to monthly_awareness"
ON monthly_awareness FOR ALL USING (auth.role() = 'authenticated');