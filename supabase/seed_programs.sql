-- Run this script in your Supabase SQL Editor to seed the programs table

INSERT INTO programs (id, title, slug, description, category, level, mode, technologies, duration_weeks, price, is_published, created_at, updated_at)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Full Stack Development', 'full-stack-development', 'Learn to build complete web applications from frontend to backend.', 'INTERNSHIP', 'INTERMEDIATE', 'ONLINE', ARRAY['Next.js', 'React', 'Node.js', 'PostgreSQL'], 4, 99.00, true, NOW(), NOW()),
  ('22222222-2222-2222-2222-222222222222', 'Frontend Development', 'frontend-development', 'Master modern frontend development with React.', 'INTERNSHIP', 'BEGINNER', 'ONLINE', ARRAY['React', 'JavaScript', 'CSS'], 4, 99.00, true, NOW(), NOW()),
  ('33333333-3333-3333-3333-333333333333', 'Data Science & Python', 'data-science-python', 'Dive into data analysis and visualization.', 'INTERNSHIP', 'INTERMEDIATE', 'ONLINE', ARRAY['Python', 'Pandas'], 4, 99.00, true, NOW(), NOW()),
  ('44444444-4444-4444-4444-444444444444', 'Backend Development', 'backend-development', 'Build robust scalable APIs.', 'INTERNSHIP', 'INTERMEDIATE', 'ONLINE', ARRAY['Node.js', 'Express'], 4, 99.00, true, NOW(), NOW()),
  ('55555555-5555-5555-5555-555555555555', 'Python Programming', 'python-programming', 'Master Python from basics to advanced.', 'INTERNSHIP', 'BEGINNER', 'ONLINE', ARRAY['Python'], 4, 99.00, true, NOW(), NOW()),
  ('66666666-6666-6666-6666-666666666666', 'Java Programming', 'java-programming', 'Build robust enterprise applications.', 'INTERNSHIP', 'INTERMEDIATE', 'ONLINE', ARRAY['Java', 'Spring'], 4, 99.00, true, NOW(), NOW()),
  ('77777777-7777-7777-7777-777777777777', 'C Programming', 'c-programming', 'Understand the foundations of computer science.', 'INTERNSHIP', 'BEGINNER', 'ONLINE', ARRAY['C'], 4, 99.00, true, NOW(), NOW()),
  ('88888888-8888-8888-8888-888888888888', 'C++ Programming', 'c-plus-plus-programming', 'Master object-oriented programming with C++.', 'INTERNSHIP', 'INTERMEDIATE', 'ONLINE', ARRAY['C++'], 4, 99.00, true, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;
