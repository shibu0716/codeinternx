-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Custom Types
CREATE TYPE user_role AS ENUM ('SUPER_ADMIN', 'ADMIN', 'EVALUATOR', 'STUDENT', 'COLLEGE_ADMIN', 'AMBASSADOR');
CREATE TYPE program_mode AS ENUM ('ONLINE', 'OFFLINE', 'HYBRID');
CREATE TYPE program_level AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
CREATE TYPE submission_status AS ENUM ('PENDING', 'CHANGES_REQUESTED', 'APPROVED', 'REJECTED');
CREATE TYPE payment_status AS ENUM ('PENDING_VERIFICATION', 'VERIFIED', 'REJECTED', 'RESUBMISSION_REQUIRED', 'CANCELLED', 'SUCCESS', 'FAILED', 'REFUNDED');
CREATE TYPE application_status AS ENUM ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'PAYMENT_PENDING', 'PAID', 'ENROLLED', 'CANCELLED');
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
    username TEXT UNIQUE,
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

-- Payment Settings Table
CREATE TABLE payment_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_holder_name TEXT NOT NULL,
    bank_name TEXT NOT NULL,
    account_number TEXT NOT NULL,
    ifsc_code TEXT NOT NULL,
    upi_id_primary TEXT NOT NULL,
    upi_id_secondary TEXT,
    payee_name TEXT,
    payment_qr_code_url TEXT,
    instructions TEXT,
    updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments Table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    enrollment_id UUID REFERENCES enrollments(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    payment_method TEXT NOT NULL,
    transaction_id TEXT UNIQUE NOT NULL,
    utr_number TEXT,
    payment_date DATE NOT NULL,
    payment_time TIME,
    proof_file_url TEXT NOT NULL,
    notes TEXT,
    status payment_status DEFAULT 'PENDING_VERIFICATION'::payment_status,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    rejection_reason TEXT,
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enrollments Table
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
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
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- 1. Helper Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('ADMIN', 'SUPER_ADMIN')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Profiles
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (is_public = true);
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can manage all profiles" ON profiles FOR ALL USING (public.is_admin());

-- 3. Programs
CREATE POLICY "Published programs are viewable by everyone" ON programs FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage all programs" ON programs FOR ALL USING (public.is_admin());

-- 4. Tasks
CREATE POLICY "Anyone can view tasks" ON tasks FOR SELECT USING (true);
CREATE POLICY "Admins can manage all tasks" ON tasks FOR ALL USING (public.is_admin());

-- 5. Applications
CREATE POLICY "Students can view their own applications" ON applications FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can insert their own applications" ON applications FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Students can update their own applications" ON applications FOR UPDATE USING (auth.uid() = student_id);
CREATE POLICY "Admins can manage all applications" ON applications FOR ALL USING (public.is_admin());

-- 7. Payments
CREATE POLICY "Students can view their own payments" ON payments FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can insert their own payments" ON payments FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Admins can manage all payments" ON payments FOR ALL USING (public.is_admin());

-- 7b. Payment Settings
CREATE POLICY "Anyone can view payment settings" ON payment_settings FOR SELECT USING (true);
CREATE POLICY "Admins can update payment settings" ON payment_settings FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can insert payment settings" ON payment_settings FOR INSERT WITH CHECK (public.is_admin());

-- 8. Enrollments
CREATE POLICY "Students can view their own enrollments" ON enrollments FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can insert their own enrollments" ON enrollments FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Students can update their own enrollments" ON enrollments FOR UPDATE USING (auth.uid() = student_id);
CREATE POLICY "Admins can manage all enrollments" ON enrollments FOR ALL USING (public.is_admin());

-- 9. Submissions
CREATE POLICY "Students can view their own submissions" ON submissions FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can create submissions" ON submissions FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Students can update their own submissions" ON submissions FOR UPDATE USING (auth.uid() = student_id);
CREATE POLICY "Admins can manage all submissions" ON submissions FOR ALL USING (public.is_admin());

-- 10. Evaluations
CREATE POLICY "Students can view their own evaluations" ON evaluations FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM submissions 
    WHERE submissions.id = evaluations.submission_id 
    AND submissions.student_id = auth.uid()
  )
);
CREATE POLICY "Admins can manage all evaluations" ON evaluations FOR ALL USING (public.is_admin());

-- 11. Certificates
CREATE POLICY "Public can verify certificates" ON certificates FOR SELECT USING (true);
CREATE POLICY "Students can view their own certificates" ON certificates FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Admins can manage all certificates" ON certificates FOR ALL USING (public.is_admin());
CREATE TYPE document_type AS ENUM ('OFFER_LETTER', 'PERFORMANCE_REPORT', 'CERTIFICATE', 'LOR');
CREATE TYPE document_status AS ENUM ('DRAFT', 'ISSUED', 'ACCEPTED', 'DECLINED', 'REVOKED');

CREATE TABLE internship_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id TEXT UNIQUE NOT NULL, -- e.g. OL-2026-000001, PR-2026-000001
    type document_type NOT NULL,
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    enrollment_id UUID REFERENCES enrollments(id) ON DELETE CASCADE,
    status document_status DEFAULT 'DRAFT'::document_status,
    issue_date DATE,
    pdf_url TEXT,
    verification_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb, -- Store dynamic fields here
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(type, enrollment_id) -- one of each type per enrollment/internship
);

ALTER TABLE internship_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can verify documents" ON internship_documents FOR SELECT USING (status IN ('ISSUED', 'ACCEPTED', 'REVOKED'));
CREATE POLICY "Students can view their own documents" ON internship_documents FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Admins can manage all documents" ON internship_documents FOR ALL USING (public.is_admin());
