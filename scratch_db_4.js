import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);
const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function check() {
  await supabase.auth.signInWithPassword({ email: 'student_e2e_1787459446714@example.com', password: 'Password123!' });
  const { data, error } = await supabase.from('tasks').select('id').eq('id', '2407f6c0-f144-4a72-93b2-9cffe701de7a');
  console.log(error, data);
}
check();
