import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);
const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function check() {
  await supabase.auth.signInWithPassword({ email: 'qa_admin_temp3@example.com', password: 'TestPassword123!' });
  
  const { data: certs, error } = await supabase
    .from('certificates')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);
  
  console.log('Error:', error?.message);
  console.log('Certs:', JSON.stringify(certs, null, 2));
  
  // Also check evaluation
  const { data: eval1 } = await supabase
    .from('evaluations')
    .select('*')
    .eq('submission_id', 'f05d38d4-756d-4626-af9e-6b2d002dfe81')
    .single();
  console.log('Evaluation:', JSON.stringify(eval1, null, 2));
}
check();
