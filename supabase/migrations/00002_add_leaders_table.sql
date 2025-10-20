-- Add leaders table for About page management
CREATE TABLE IF NOT EXISTS leaders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT NOT NULL,
  year TEXT NOT NULL,
  photo_url TEXT,
  email TEXT,
  linkedin_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE leaders ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public read access for leaders" ON leaders FOR SELECT USING (true);
CREATE POLICY "Admin write access for leaders" ON leaders FOR ALL USING (auth.role() = 'authenticated');

-- Insert sample data
INSERT INTO leaders (name, role, bio, year, photo_url, email, linkedin_url) VALUES
('Sarah Wanjiku', 'President', 'Passionate about mental health advocacy and creating inclusive spaces for all students to thrive.', '4th Year Psychology', '/images/leader-1.jpg', 'sarah.wanjiku@strathmore.edu', 'https://linkedin.com/in/sarah-wanjiku'),
('Michael Ochieng', 'Vice President', 'Dedicated to organizing impactful events and building strong peer support networks.', '3rd Year Business', '/images/leader-2.jpg', 'michael.ochieng@strathmore.edu', 'https://linkedin.com/in/michael-ochieng'),
('Aisha Kimani', 'Secretary', 'Focused on communication, outreach, and ensuring every student feels heard and supported.', '3rd Year Medicine', '/images/leader-3.jpg', 'aisha.kimani@strathmore.edu', 'https://linkedin.com/in/aisha-kimani'),
('David Mwangi', 'Treasurer', 'Managing resources effectively to maximize our impact on student mental health and wellbeing.', '2nd Year Engineering', '/images/leader-4.jpg', 'david.mwangi@strathmore.edu', 'https://linkedin.com/in/david-mwangi');