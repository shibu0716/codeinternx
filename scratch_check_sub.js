import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);
const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function check() {
  await supabase.auth.signInWithPassword({ email: 'qa_admin_temp3@example.com', password: 'TestPassword123!' });
  
  const { data: subs, error } = await supabase
    .from('submissions')
    .select('*')
    .eq('task_id', '2407f6c0-f144-4a72-93b2-9cffe701de7a')
    .order('submitted_at', { ascending: false });
  
  console.log('Error:', error);
  console.log('Submissions:', JSON.stringify(subs, null, 2));
}
check();
