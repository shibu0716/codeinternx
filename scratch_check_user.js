import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=(.*)/); // use service role!

const supabaseUrl = urlMatch[1].trim();
const supabaseKey = keyMatch ? keyMatch[1].trim() : env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)[1].trim();

const supabase = createClient(supabaseUrl, supabaseKey, { auth: { autoRefreshToken: false, persistSession: false } });

async function check() {
  const { data: enrollments } = await supabase.from('enrollments').select('*, profiles(email)').order('enrolled_at', { ascending: false }).limit(1);
  const studentEmail = enrollments[0].profiles.email;
  
  const { data: { users }, error } = await supabase.auth.admin.listUsers();
  const user = users.find(u => u.email === studentEmail);
  console.log("Student User:", user?.email, "Confirmed at:", user?.email_confirmed_at);
}
check();
