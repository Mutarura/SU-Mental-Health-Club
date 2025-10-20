-- Update seed data with more comprehensive test data

-- Insert additional sample events
INSERT INTO events (title, slug, description, start, "end", location, calendar_link, image_url) VALUES
('Mindfulness Monday', 'mindfulness-monday', 'Weekly mindfulness and meditation session to start your week with clarity and calm.', '2024-04-08 08:00:00+00', '2024-04-08 09:00:00+00', 'Student Centre Quiet Room', 'https://calendar.google.com/event4', '/images/mindfulness.jpg'),
('Mental Health First Aid Training', 'mental-health-first-aid', 'Learn how to provide initial support to someone experiencing a mental health crisis.', '2024-04-12 13:00:00+00', '2024-04-12 17:00:00+00', 'Medical Centre Training Room', 'https://calendar.google.com/event5', '/images/first-aid.jpg'),
('Wellness Wednesday Workshop', 'wellness-wednesday', 'Interactive workshop on building healthy habits and maintaining work-life balance.', '2024-04-17 15:00:00+00', '2024-04-17 17:00:00+00', 'Library Seminar Room', 'https://calendar.google.com/event6', '/images/wellness.jpg');

-- Insert additional sample resources
INSERT INTO resources (title, category, url_or_storage_path, tags, description, image_url) VALUES
('Exam Stress Management Guide', 'guide', '/resources/exam-stress-guide.pdf', '{"stress", "exams", "study tips"}', 'Comprehensive guide to managing stress during examination periods.', '/images/exam-stress.jpg'),
('Sleep Hygiene for Students', 'article', 'https://example.com/sleep-hygiene', '{"sleep", "health", "productivity"}', 'Learn the importance of good sleep habits for mental and physical health.', '/images/sleep.jpg'),
('Meditation for Beginners', 'podcast', 'https://spotify.com/meditation-beginners', '{"meditation", "mindfulness", "relaxation"}', 'A beginner-friendly podcast series on meditation techniques.', '/images/meditation-podcast.jpg'),
('Building Resilience Toolkit', 'guide', '/resources/resilience-toolkit.pdf', '{"resilience", "coping", "mental strength"}', 'Tools and strategies for building emotional resilience and coping skills.', '/images/resilience.jpg'),
('Student Mental Health Stories', 'podcast', 'https://spotify.com/student-stories', '{"stories", "inspiration", "recovery"}', 'Real stories from students about their mental health journeys.', '/images/stories-podcast.jpg');

-- Insert additional sample quotes
INSERT INTO quotes (text, author) VALUES
('The greatest revolution of our generation is the discovery that human beings, by changing the inner attitudes of their minds, can change the outer aspects of their lives.', 'William James'),
('Mental health is not about what you have been through, but how you choose to move forward.', 'Anonymous'),
('You don''t have to be positive all the time. It''s perfectly okay to feel sad, angry, annoyed, frustrated, scared, or anxious. Having feelings doesn''t make you a negative person.', 'Lori Deschene'),
('Self-care is not selfish. You cannot serve from an empty vessel.', 'Eleanor Brown'),
('It''s okay to not be okay, as long as you don''t stay that way.', 'Anonymous');

-- Update about content with more comprehensive information
UPDATE about SET 
  mission_text = 'To create a supportive, inclusive community where every Strathmore student feels heard, valued, and empowered to prioritize their mental health and well-being. We strive to break stigma, provide resources, and foster peer connections that promote resilience and growth.',
  story_text = 'The Strathmore Mental Health Club was founded in 2020 by a group of students who recognized the urgent need for peer support and mental health awareness on campus. What began as informal support groups in dormitory common rooms has evolved into a comprehensive program offering workshops, resources, trained peer counselors, and campus-wide awareness campaigns. Our journey reflects the growing recognition that mental health is as important as physical health in the university experience.',
  collaboration_note = 'We work closely with the Strathmore Medical Centre, professional counselors, and mental health organizations to ensure our students receive comprehensive, evidence-based support. Our partnerships extend to local mental health NGOs and international student wellness initiatives.'
WHERE id = (SELECT id FROM about LIMIT 1);

-- Update footer with more comprehensive contact information
UPDATE footer SET 
  med_centre_contact = 'Strathmore Medical Centre: +254 703 034 000 | Email: medical@strathmore.edu | Hours: Mon-Fri 8AM-6PM, Sat 9AM-1PM',
  club_email = 'mentalhealth@strathmore.edu | Instagram: @strathmore_mentalhealth | WhatsApp: +254 712 345 678',
  emergency_numbers = 'Kenya Red Cross: 1199 | Befrienders Kenya: +254 722 178 177 | Suicide Prevention Lifeline: 1190 | Emergency Services: 999 | Campus Security: +254 703 034 100'
WHERE id = (SELECT id FROM footer LIMIT 1);

-- Insert additional admin users (replace with actual admin emails)
INSERT INTO admins (email, role) VALUES
('mentalhealth.admin@strathmore.edu', 'admin'),
('student.affairs@strathmore.edu', 'admin');