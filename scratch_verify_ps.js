import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);
const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

await supabase.auth.signInWithPassword({ email: 'qa_admin_temp3@example.com', password: 'TestPassword123!' });
const { data, error } = await supabase.from('payment_settings').select('*').maybeSingle();
console.log('Error:', error?.message || 'None');
console.log('Data:', JSON.stringify(data, null, 2));
