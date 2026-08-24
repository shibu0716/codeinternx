-- Create a new public bucket for certificates
INSERT INTO storage.buckets (id, name, public) 
VALUES ('certificates', 'certificates', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to certificates
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'certificates' );

-- Allow authenticated admins to insert/update certificates
CREATE POLICY "Admin Upload Access" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'certificates' AND public.is_admin() );

CREATE POLICY "Admin Update Access" 
ON storage.objects FOR UPDATE 
USING ( bucket_id = 'certificates' AND public.is_admin() );
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS certificate_url TEXT;
