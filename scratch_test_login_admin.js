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
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'qa_admin_temp@example.com',
    password: 'TestPassword123!',
  });
  console.log("Login TestPassword123!:", error?.message || "OK");

  const { data: d2, error: e2 } = await supabase.auth.signInWithPassword({
    email: 'qa_admin_temp@example.com',
    password: 'AdminPassword123!',
  });
  console.log("Login AdminPassword123!:", e2?.message || "OK");
}
test();
