// Try Supabase Management API to run the migration
// Project ref: fbzfoznyzpgzgfxedlzl
const PROJECT_REF = 'fbzfoznyzpgzgfxedlzl';

const SQL = `
CREATE TABLE IF NOT EXISTS payment_settings (
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

ALTER TABLE payment_settings ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Anyone can view payment settings" ON payment_settings FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Admins can insert payment settings" ON payment_settings FOR INSERT WITH CHECK (public.is_admin());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Admins can update payment settings" ON payment_settings FOR UPDATE USING (public.is_admin());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

INSERT INTO payment_settings (account_holder_name, bank_name, account_number, ifsc_code, upi_id_primary, upi_id_secondary, payee_name, instructions)
SELECT 'CodeInternX', 'Central Bank of India', '4052732274', 'CBIN0242826', 'shibuthegenius@ybl', 'shibuthegenius@ibl', 'CodeInternX',
       'Please make your payment to the official CodeInternX payment details. After payment, enter your UTR number and upload your receipt.'
WHERE NOT EXISTS (SELECT 1 FROM payment_settings);
`;

// This requires a personal access token — check if user has configured one
const token = process.env.SUPABASE_ACCESS_TOKEN;
if (!token) {
  console.log("No SUPABASE_ACCESS_TOKEN found in env.");
  console.log("To run the migration, go to:");
  console.log(`https://supabase.com/dashboard/project/${PROJECT_REF}/sql/new`);
  console.log("\nAnd run the SQL from: ~/.gemini/antigravity-ide/brain/95ea6222-c740-4238-999c-4959660ccde9/scratch/payment_settings_migration.sql");
  process.exit(0);
}

const resp = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: SQL })
});
const result = await resp.json();
console.log('Result:', JSON.stringify(result, null, 2));
