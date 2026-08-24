import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);
const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim(), { auth: { autoRefreshToken: false, persistSession: false } });

async function check() {
  const { data: adminAuth } = await supabase.auth.signInWithPassword({ email: 'qa_admin_temp3@example.com', password: 'TestPassword123!' });
  const { data: enrollments } = await supabase.from('enrollments').select('*, profiles(email)').order('enrolled_at', { ascending: false }).limit(1);
  const studentEmail = enrollments[0].profiles.email;
  
  const { error: studentAuthError } = await supabase.auth.signInWithPassword({ email: studentEmail, password: 'TestPassword123!' });
  console.log("Student Login:", studentAuthError?.message || "OK");

  const { data: tasks, error: tasksError } = await supabase.from('tasks').select('*');
  console.log("Tasks:", tasks?.length, tasksError);
}
check();
