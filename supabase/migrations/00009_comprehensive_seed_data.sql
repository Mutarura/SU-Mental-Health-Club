-- Comprehensive seed data for essential tables only

-- Insert sample quotes
INSERT INTO quotes (text, author) VALUES
('Mental health is not a destination, but a process. It''s about how you drive, not where you''re going.', 'Noam Shpancer'),
('You are not your illness. You have an individual story to tell. You have a name, a history, a personality. Staying yourself is part of the battle.', 'Julian Seifter'),
('The greatest revolution of our generation is the discovery that human beings, by changing the inner attitudes of their minds, can change the outer aspects of their lives.', 'William James'),
('It''s okay to not be okay, as long as you don''t stay that way.', 'Anonymous'),
('Mental health is not about what you have been through, but how you choose to move forward.', 'Anonymous');

-- Insert sample events
INSERT INTO events (title, slug, description, start, "end", location, calendar_link, image_url) VALUES
('Mental Health Awareness Week', 'mental-health-awareness-week', 'A week-long series of events focusing on mental health education, workshops, and peer support activities.', '2024-03-15 09:00:00+03', '2024-03-22 17:00:00+03', 'Strathmore University Campus', 'https://calendar.google.com/calendar/event?action=TEMPLATE&tmeid=mhaw2024', '/images/events/awareness-week.jpg'),
('Stress Management Workshop', 'stress-management-workshop', 'Learn practical techniques for managing academic stress and maintaining work-life balance during exams.', '2024-03-20 14:00:00+03', '2024-03-20 16:00:00+03', 'Student Center Room 201', 'https://calendar.google.com/calendar/event?action=TEMPLATE&tmeid=stress2024', '/images/events/stress-workshop.jpg'),
('Peer Support Circle', 'peer-support-circle', 'Weekly peer support meetings where students can share experiences and support each other in a safe environment.', '2024-03-25 16:00:00+03', '2024-03-25 17:30:00+03', 'Library Discussion Room', 'https://calendar.google.com/calendar/event?action=TEMPLATE&tmeid=peer2024', '/images/events/peer-circle.jpg'),
('Mental Health First Aid Training', 'mental-health-first-aid', 'Comprehensive training on how to recognize mental health crises and provide initial support to peers.', '2024-04-10 09:00:00+03', '2024-04-10 17:00:00+03', 'Main Auditorium', 'https://calendar.google.com/calendar/event?action=TEMPLATE&tmeid=firstaid2024', '/images/events/first-aid.jpg');

-- Insert sample resources
INSERT INTO resources (title, category, url_or_storage_path, tags, description, image_url) VALUES
('Understanding Anxiety: A Student Guide', 'article', 'https://example.com/anxiety-guide', ARRAY['anxiety', 'coping', 'students'], 'Comprehensive guide to understanding and managing anxiety specifically for university students.', '/images/resources/anxiety-guide.jpg'),
('Depression and Academic Performance', 'article', 'https://example.com/depression-academic', ARRAY['depression', 'academics', 'performance'], 'Research-based article on how depression affects academic performance and strategies for support.', '/images/resources/depression-academic.jpg'),
('Study-Life Balance Workbook', 'guide', '/files/balance-workbook.pdf', ARRAY['balance', 'study', 'lifestyle'], 'Interactive workbook to help students create sustainable study schedules and maintain mental health.', '/images/resources/balance-workbook.jpg'),
('Mental Health Matters Podcast', 'podcast', 'https://spotify.com/mental-health-matters', ARRAY['podcast', 'stories', 'inspiration'], 'Weekly podcast featuring student stories, expert interviews, and mental health tips for university life.', '/images/resources/podcast.jpg'),
('Coping with Exam Stress', 'podcast', 'https://spotify.com/exam-stress-coping', ARRAY['exams', 'stress', 'coping'], 'Podcast series dedicated to helping students manage exam anxiety and stress effectively.', '/images/resources/exam-stress.jpg');

-- Insert sample monthly awareness data with banner fields
INSERT INTO monthly_awareness (month, theme, message, resource_url, icon, banner_url, caption) VALUES
('January', 'New Year, New Mindset', 'Start the year with mental wellness goals and positive habits.', 'https://example.com/new-year-wellness', 'sun', '/images/banners/january-banner.jpg', 'Embrace a fresh start with mental wellness'),
('February', 'Love Yourself First', 'Self-love and self-care are the foundation of mental health.', 'https://example.com/self-love', 'heart', '/images/banners/february-banner.jpg', 'Practice self-compassion and kindness'),
('March', 'Spring Into Wellness', 'Renewal and growth in mental health awareness.', 'https://example.com/spring-wellness', 'lightbulb', '/images/banners/march-banner.jpg', 'Grow and flourish with mental wellness'),
('April', 'Stress Awareness Month', 'Understanding and managing stress in academic life.', 'https://example.com/stress-management', 'balance', '/images/banners/april-banner.jpg', 'Find balance in your academic journey'),
('May', 'Mental Health Awareness Month', 'Breaking stigma and promoting open conversations.', 'https://example.com/mental-health-awareness', 'chat', '/images/banners/may-banner.jpg', 'Let''s talk about mental health openly'),
('October', 'Depression Awareness Month', 'Understanding depression and supporting each other.', 'https://example.com/depression-awareness', 'people', '/images/banners/october-banner.jpg', 'Together we raise awareness and support');

-- Insert sample council leaders
INSERT INTO council_leaders (name, role, bio, year, photo_url, email, linkedin_url) VALUES
('Sarah Wanjiku', 'President', 'Passionate about mental health advocacy and creating inclusive spaces for all students to thrive.', '4th Year Psychology', '/images/leaders/sarah-wanjiku.jpg', 'sarah.wanjiku@strathmore.edu', 'https://linkedin.com/in/sarah-wanjiku'),
('Michael Ochieng', 'Vice President', 'Dedicated to organizing impactful events and building strong peer support networks.', '3rd Year Business', '/images/leaders/michael-ochieng.jpg', 'michael.ochieng@strathmore.edu', 'https://linkedin.com/in/michael-ochieng'),
('Grace Muthoni', 'Secretary', 'Ensuring effective communication and documentation of our mental health initiatives.', '3rd Year Communications', '/images/leaders/grace-muthoni.jpg', 'grace.muthoni@strathmore.edu', 'https://linkedin.com/in/grace-muthoni'),
('David Mwangi', 'Treasurer', 'Managing resources effectively to maximize our impact on student mental health and wellbeing.', '2nd Year Engineering', '/images/leaders/david-mwangi.jpg', 'david.mwangi@strathmore.edu', 'https://linkedin.com/in/david-mwangi');