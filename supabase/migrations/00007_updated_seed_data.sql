-- Clear existing data and insert comprehensive seed data

-- Clear existing data
DELETE FROM events;
DELETE FROM resources;
DELETE FROM quotes;

-- Insert comprehensive test data for Events
INSERT INTO events (title, slug, description, start, "end", location, calendar_link, image_url) VALUES
('Mental Health Awareness Week', 'mental-health-awareness-week', 'A week-long series of events focusing on mental health education, workshops, and peer support activities.', '2024-03-15 09:00:00+03', '2024-03-22 17:00:00+03', 'Strathmore University Campus', 'https://calendar.google.com/calendar/event?action=TEMPLATE&tmeid=mhaw2024', '/images/events/awareness-week.jpg'),
('Stress Management Workshop', 'stress-management-workshop', 'Learn practical techniques for managing academic stress and maintaining work-life balance during exams.', '2024-03-20 14:00:00+03', '2024-03-20 16:00:00+03', 'Student Center Room 201', 'https://calendar.google.com/calendar/event?action=TEMPLATE&tmeid=stress2024', '/images/events/stress-workshop.jpg'),
('Peer Support Circle', 'peer-support-circle', 'Weekly peer support meetings where students can share experiences and support each other in a safe environment.', '2024-03-25 16:00:00+03', '2024-03-25 17:30:00+03', 'Library Discussion Room', 'https://calendar.google.com/calendar/event?action=TEMPLATE&tmeid=peer2024', '/images/events/peer-circle.jpg'),
('Mindfulness and Meditation Session', 'mindfulness-meditation', 'Guided meditation and mindfulness practices to help reduce anxiety and improve mental clarity.', '2024-04-02 12:00:00+03', '2024-04-02 13:00:00+03', 'Campus Garden Pavilion', 'https://calendar.google.com/calendar/event?action=TEMPLATE&tmeid=mindful2024', '/images/events/meditation.jpg'),
('Mental Health First Aid Training', 'mental-health-first-aid', 'Comprehensive training on how to recognize mental health crises and provide initial support to peers.', '2024-04-10 09:00:00+03', '2024-04-10 17:00:00+03', 'Main Auditorium', 'https://calendar.google.com/calendar/event?action=TEMPLATE&tmeid=firstaid2024', '/images/events/first-aid.jpg');

-- Insert comprehensive test data for Resources
INSERT INTO resources (title, category, url_or_storage_path, tags, description, image_url) VALUES
('Understanding Anxiety: A Student Guide', 'article', 'https://example.com/anxiety-guide', ARRAY['anxiety', 'coping', 'students'], 'Comprehensive guide to understanding and managing anxiety specifically for university students.', '/images/resources/anxiety-guide.jpg'),
('Depression and Academic Performance', 'article', 'https://example.com/depression-academic', ARRAY['depression', 'academics', 'performance'], 'Research-based article on how depression affects academic performance and strategies for support.', '/images/resources/depression-academic.jpg'),
('Mindfulness Toolkit for Students', 'guide', '/files/mindfulness-toolkit.pdf', ARRAY['mindfulness', 'meditation', 'toolkit'], 'Practical toolkit with mindfulness exercises, breathing techniques, and meditation guides for students.', '/images/resources/mindfulness-toolkit.jpg'),
('Study-Life Balance Workbook', 'guide', '/files/balance-workbook.pdf', ARRAY['balance', 'study', 'lifestyle'], 'Interactive workbook to help students create sustainable study schedules and maintain mental health.', '/images/resources/balance-workbook.jpg'),
('Mental Health Matters Podcast', 'podcast', 'https://spotify.com/mental-health-matters', ARRAY['podcast', 'stories', 'inspiration'], 'Weekly podcast featuring student stories, expert interviews, and mental health tips for university life.', '/images/resources/podcast.jpg'),
('Coping with Exam Stress', 'podcast', 'https://spotify.com/exam-stress-coping', ARRAY['exams', 'stress', 'coping'], 'Podcast series dedicated to helping students manage exam anxiety and stress effectively.', '/images/resources/exam-stress.jpg');

-- Insert comprehensive test data for Quotes
INSERT INTO quotes (text, author) VALUES
('Mental health is not a destination, but a process. It''s about how you drive, not where you''re going.', 'Noam Shpancer'),
('You are not your illness. You have an individual story to tell. You have a name, a history, a personality. Staying yourself is part of the battle.', 'Julian Seifter'),
('Healing takes time, and asking for help is a courageous step.', 'Mariska Hargitay'),
('Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.', 'Anonymous'),
('It''s okay to not be okay. It''s not okay to stay that way.', 'Anonymous'),
('The strongest people are not those who show strength in front of us, but those who win battles we know nothing about.', 'Anonymous'),
('Mental health needs a great deal of attention. It''s the final taboo and it needs to be faced and dealt with.', 'Adam Ant'),
('You don''t have to be positive all the time. It''s perfectly okay to feel sad, angry, annoyed, frustrated, scared, or anxious. Having feelings doesn''t make you a negative person.', 'Lori Deschene');