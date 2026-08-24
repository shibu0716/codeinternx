import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// We need to fetch the service key from .env.local to update the profile without RLS
import fs from 'fs';
const env = fs.readFileSync('.env.local', 'utf8');
const serviceKeyMatch = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/);
const serviceKey = serviceKeyMatch ? serviceKeyMatch[1] : '';

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function makeAdmin() {
  const { data: user, error: userErr } = await supabase.from('profiles').select('*').eq('email', 'qa_admin_temp@example.com').single();
  if (user) {
    const { error } = await supabase.from('profiles').update({ role: 'ADMIN' }).eq('id', user.id);
    console.log('Made admin:', error || 'Success');
  } else {
    console.log('User not found');
  }
}

makeAdmin();
