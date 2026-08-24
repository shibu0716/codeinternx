import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);
const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function check() {
  await supabase.auth.signInWithPassword({ email: 'qa_admin_temp3@example.com', password: 'TestPassword123!' });
  
  // Can admin access this submission?
  const { data, error } = await supabase
    .from('submissions')
    .select(`
      *,
      profiles:student_id (full_name, email, avatar_url),
      tasks (title, description, requirements, points, programs(title))
    `)
    .eq('id', 'f05d38d4-756d-4626-af9e-6b2d002dfe81')
    .single();
  
  console.log('Error:', error?.message);
  console.log('Data:', data ? 'Found submission' : 'Not found');
  console.log('Submission ID:', data?.id);
  console.log('Status:', data?.status);
}
check();
