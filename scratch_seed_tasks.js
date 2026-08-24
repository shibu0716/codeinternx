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
  const { data: adminAuth, error: authError } = await supabase.auth.signInWithPassword({
    email: 'qa_admin_temp3@example.com',
    password: 'TestPassword123!',
  });
  console.log("Admin Login:", authError?.message || "OK");

  if (adminAuth?.user) {
      const { data: program } = await supabase.from('programs').select('id').eq('slug', 'full-stack-development').single();
      
      const { error: insertError } = await supabase.from('tasks').insert([
        {
          program_id: program.id,
          title: 'Setup React Project',
          description: 'Initialize a Next.js project with Tailwind CSS',
          week_number: 1
        }
      ]);
      console.log("Task Insert:", insertError?.message || "OK");
  }
}
test();
