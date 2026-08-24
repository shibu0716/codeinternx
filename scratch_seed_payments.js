import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);
const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function seed() {
  await supabase.auth.signInWithPassword({ email: 'qa_admin_temp3@example.com', password: 'TestPassword123!' });
  
  const { data: existing } = await supabase.from('payment_settings').select('id').maybeSingle();
  
  const settings = {
    account_holder_name: 'CodeInternX Technologies',
    bank_name: 'HDFC Bank',
    account_number: '50200012345678',
    ifsc_code: 'HDFC0001234',
    upi_id_primary: 'codeinternx@hdfcbank',
    upi_id_secondary: 'codeinternx@paytm',
    payee_name: 'CodeInternX Technologies',
    payment_qr_code_url: null,
    instructions: 'Please send payment via UPI or bank transfer. Include your application ID in the payment notes. Take a screenshot and upload proof below.',
    updated_at: new Date().toISOString()
  };
  
  let error;
  if (existing) {
    const r = await supabase.from('payment_settings').update(settings).eq('id', existing.id);
    error = r.error;
    console.log('Updated payment settings');
  } else {
    const r = await supabase.from('payment_settings').insert([settings]);
    error = r.error;
    console.log('Inserted payment settings');
  }
  
  if (error) {
    console.error('Error:', error.message);
  } else {
    const { data } = await supabase.from('payment_settings').select('*').maybeSingle();
    console.log('Payment settings now:', JSON.stringify(data, null, 2));
  }
}
seed();
