import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);
const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim(), { auth: { autoRefreshToken: false, persistSession: false } });

async function check() {
  const { data: adminAuth } = await supabase.auth.signInWithPassword({ email: 'qa_admin_temp3@example.com', password: 'TestPassword123!' });
  const { data: enrollments } = await supabase.from('enrollments').select('program_id').order('enrolled_at', { ascending: false }).limit(1);
  const { data: tasks } = await supabase.from('tasks').select('program_id');
  
  console.log("Enrollment Program ID:", enrollments[0]?.program_id);
  console.log("Task Program IDs:", tasks.map(t => t.program_id));
}
check();
