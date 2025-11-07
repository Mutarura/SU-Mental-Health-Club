-- Create tables per requested schema (idempotent)

-- 1) events
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2) resources
CREATE TABLE IF NOT EXISTS public.resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL, -- e.g. "Article", "Podcast", "Video"
  link TEXT NOT NULL,
  icon_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3) council_members
CREATE TABLE IF NOT EXISTS public.council_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  image_url TEXT,
  bio TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4) quotes
CREATE TABLE IF NOT EXISTS public.quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote_text TEXT NOT NULL,
  author TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5) monthly_awareness
CREATE TABLE IF NOT EXISTS public.monthly_awareness (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  month_name TEXT NOT NULL, -- e.g. "October"
  theme TEXT NOT NULL,
  banner_image_url TEXT,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6) gallery system
CREATE TABLE IF NOT EXISTS public.gallery_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  cover_image_url TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.gallery_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES public.gallery_events(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);