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
