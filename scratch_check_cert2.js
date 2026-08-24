import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);
const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function check() {
  await supabase.auth.signInWithPassword({ email: 'qa_admin_temp3@example.com', password: 'TestPassword123!' });
  
  // All submissions and their status
  const { data: subs } = await supabase
    .from('submissions')
    .select('id, status, task_id, enrollment_id')
    .order('submitted_at', { ascending: false })
    .limit(5);
  console.log('Submissions:', JSON.stringify(subs, null, 2));

  // All evaluations
  const { data: evals } = await supabase
    .from('evaluations')
    .select('*')
    .order('evaluated_at', { ascending: false })
    .limit(5);
  console.log('Evaluations:', JSON.stringify(evals, null, 2));
}
check();
