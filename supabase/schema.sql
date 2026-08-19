-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Custom Types
CREATE TYPE user_role AS ENUM ('SUPER_ADMIN', 'ADMIN', 'EVALUATOR', 'STUDENT', 'COLLEGE_ADMIN', 'AMBASSADOR');
CREATE TYPE program_mode AS ENUM ('ONLINE', 'OFFLINE', 'HYBRID');
CREATE TYPE program_level AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
CREATE TYPE submission_status AS ENUM ('PENDING', 'CHANGES_REQUESTED', 'APPROVED', 'REJECTED');
CREATE TYPE payment_status AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED');
CREATE TYPE application_status AS ENUM ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'PAYMENT_PENDING', 'PAID', 'ENROLLED', 'CANCELLED');
CREATE TYPE order_status AS ENUM ('CREATED', 'PENDING', 'PAID', 'FAILED', 'CANCELLED', 'REFUNDED');
CREATE TYPE application_source AS ENUM ('WEBSITE', 'GOOGLE_FORM', 'WHATSAPP', 'REFERRAL', 'OTHER');

-- Profiles Table (Extends Supabase Auth Users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    college TEXT,
    degree TEXT,
    graduation_year INTEGER,
    skills TEXT[],
    github_url TEXT,
    linkedin_url TEXT,
    role user_role DEFAULT 'STUDENT'::user_role,
    avatar_url TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Programs Table (e.g., Internships, Courses)
CREATE TABLE programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    category TEXT NOT NULL,
    duration_weeks INTEGER NOT NULL,
    level program_level NOT NULL,
    mode program_mode NOT NULL,
    technologies TEXT[],
    price DECIMAL(10,2) DEFAULT 0.00,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks Table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    objective TEXT,
    requirements TEXT,
    skills_tested TEXT[],
    difficulty program_level,
    week_number INTEGER NOT NULL,
    is_final_project BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Applications Table
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id TEXT UNIQUE NOT NULL, -- e.g. CI-APP-2026-000001
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
    source application_source DEFAULT 'WEBSITE'::application_source,
    status application_status DEFAULT 'PENDING'::application_status,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, program_id)
);

-- Orders Table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
    razorpay_order_id TEXT UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    status order_status DEFAULT 'CREATED'::order_status,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments Table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    razorpay_payment_id TEXT UNIQUE NOT NULL,
    razorpay_order_id TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    status payment_status DEFAULT 'SUCCESS'::payment_status,
    payment_method TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enrollments Table
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    duration_months INTEGER DEFAULT 1,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    progress_percentage INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,
    payment_status payment_status DEFAULT 'PENDING'::payment_status,
    UNIQUE(student_id, program_id)
);

-- Submissions Table
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    enrollment_id UUID REFERENCES enrollments(id) ON DELETE CASCADE,
    github_url TEXT NOT NULL,
    live_url TEXT,
    notes TEXT,
    status submission_status DEFAULT 'PENDING'::submission_status,
    version INTEGER DEFAULT 1,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Evaluations Table
CREATE TABLE evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE UNIQUE,
    evaluator_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    technical_score INTEGER,
    ui_ux_score INTEGER,
    requirements_score INTEGER,
    code_quality_score INTEGER,
    professionalism_score INTEGER,
    total_score INTEGER,
    feedback TEXT,
    strengths TEXT[],
    weaknesses TEXT[],
    evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Certificates Table
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    certificate_id TEXT UNIQUE NOT NULL, -- e.g., CERT-2026-FS-000182
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
    enrollment_id UUID REFERENCES enrollments(id) ON DELETE CASCADE UNIQUE,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) Setup
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- (Basic policies placeholder, will refine later)
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (is_public = true);
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Published programs are viewable by everyone" ON programs FOR SELECT USING (is_published = true);

CREATE POLICY "Students can view their own enrollments" ON enrollments FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can view their own submissions" ON submissions FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can create submissions" ON submissions FOR INSERT WITH CHECK (auth.uid() = student_id);
