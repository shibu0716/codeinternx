import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);

const supabaseUrl = urlMatch ? urlMatch[1].trim() : 'http://127.0.0.1:54321';
const supabaseKey = keyMatch ? keyMatch[1].trim() : '';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function test() {
  const { data, error } = await supabase.auth.signUp({
    email: 'qa_admin_temp3@example.com',
    password: 'TestPassword123!',
  });
  console.log("Signup:", error?.message || "OK");
  
  if (data?.user) {
    const { error: insertError } = await supabase.from('profiles').upsert({
      id: data.user.id,
      email: 'qa_admin_temp3@example.com',
      full_name: 'QA Admin',
      role: 'ADMIN'
    });
    console.log("Insert Profile Error:", insertError?.message || "OK");
  }
}
test();
