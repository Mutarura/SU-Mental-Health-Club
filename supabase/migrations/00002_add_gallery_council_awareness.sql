-- Enable UUID extension if not already
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Gallery events
CREATE TABLE IF NOT EXISTS gallery_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT NOT NULL,
  cover_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gallery images
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gallery_event_id UUID NOT NULL REFERENCES gallery_events(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Council leaders
CREATE TABLE IF NOT EXISTS council_leaders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT NOT NULL,
  year TEXT NOT NULL,
  email TEXT NOT NULL,
  linkedin_url TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Monthly awareness (optional; used by Admin tab)
CREATE TABLE IF NOT EXISTS monthly_awareness (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  month TEXT NOT NULL,
  theme TEXT NOT NULL,
  message TEXT NOT NULL,
  resource_url TEXT,
  icon TEXT,
  banner_url TEXT,
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE gallery_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE council_leaders ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_awareness ENABLE ROW LEVEL SECURITY;

-- Public read-only policies
CREATE POLICY "Allow public read access to gallery_events" ON gallery_events FOR SELECT USING (true);
CREATE POLICY "Allow public read access to gallery_images" ON gallery_images FOR SELECT USING (true);
CREATE POLICY "Allow public read access to council_leaders" ON council_leaders FOR SELECT USING (true);
CREATE POLICY "Allow public read access to monthly_awareness" ON monthly_awareness FOR SELECT USING (true);

-- Admin-only write policies should be configured via Auth (optional)