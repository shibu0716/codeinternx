-- Add source_id to prevent duplicate imports
ALTER TABLE applications ADD COLUMN IF NOT EXISTS source_id TEXT UNIQUE;

-- Create sync logs table
CREATE TABLE IF NOT EXISTS google_sheet_sync_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    records_checked INTEGER DEFAULT 0,
    records_imported INTEGER DEFAULT 0,
    records_updated INTEGER DEFAULT 0,
    duplicates_skipped INTEGER DEFAULT 0,
    errors INTEGER DEFAULT 0,
    error_details TEXT,
    synced_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE google_sheet_sync_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view sync logs" ON google_sheet_sync_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('SUPER_ADMIN', 'ADMIN'))
);
CREATE POLICY "Admins can insert sync logs" ON google_sheet_sync_logs FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('SUPER_ADMIN', 'ADMIN'))
);
