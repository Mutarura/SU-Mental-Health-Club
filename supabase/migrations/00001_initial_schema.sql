-- Create tables for Strathmore Mental Health Club website

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  start TIMESTAMP WITH TIME ZONE NOT NULL,
  "end" TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT NOT NULL,
  calendar_link TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resources table
CREATE TYPE resource_category AS ENUM ('article', 'guide', 'podcast');

CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category resource_category NOT NULL,
  url_or_storage_path TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  description TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Counselors table
CREATE TABLE IF NOT EXISTS counselors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  year TEXT NOT NULL,
  bio TEXT NOT NULL,
  specializations TEXT[] DEFAULT '{}',
  email TEXT NOT NULL,
  calendly_url TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quotes table
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text TEXT NOT NULL,
  author TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- About page content
CREATE TABLE IF NOT EXISTS about (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mission_text TEXT NOT NULL,
  story_text TEXT NOT NULL,
  collaboration_note TEXT NOT NULL,
  image_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Footer content
CREATE TABLE IF NOT EXISTS footer (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  med_centre_contact TEXT NOT NULL,
  club_email TEXT NOT NULL,
  emergency_numbers TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE counselors ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE about ENABLE ROW LEVEL SECURITY;
ALTER TABLE footer ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Public read-only policies
CREATE POLICY "Allow public read access to events" ON events FOR SELECT USING (true);
CREATE POLICY "Allow public read access to resources" ON resources FOR SELECT USING (true);
CREATE POLICY "Allow public read access to counselors" ON counselors FOR SELECT USING (true);
CREATE POLICY "Allow public read access to quotes" ON quotes FOR SELECT USING (true);
CREATE POLICY "Allow public read access to about" ON about FOR SELECT USING (true);
CREATE POLICY "Allow public read access to footer" ON footer FOR SELECT USING (true);

-- Admin-only write policies (will be configured with Supabase Auth)
-- These will be implemented when setting up authentication