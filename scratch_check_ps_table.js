import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);

// Use anon key to verify what happens
const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function check() {
  await supabase.auth.signInWithPassword({ email: 'qa_admin_temp3@example.com', password: 'TestPassword123!' });
  
  // Try selecting with no filter to see what columns exist
  const { data, error } = await supabase.from('payment_settings').select('*').limit(1);
  console.log('Error:', error?.message);
  console.log('Data:', JSON.stringify(data));
  
  // Try the update_payment_settings.sql file
  const sqlFile = fs.existsSync('./update_payment_settings.sql');
  console.log('update_payment_settings.sql exists:', sqlFile);
}
check();
