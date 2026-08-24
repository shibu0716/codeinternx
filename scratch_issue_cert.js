import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);
const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

const ENROLLMENT_ID = '22972c85-cfbc-45f3-a7eb-080aa1906bb1';
const STUDENT_ID = '83373e77-d76c-400b-a4e8-a4355d4208bb';
const PROGRAM_ID = '11111111-1111-1111-1111-111111111111';

async function check() {
  await supabase.auth.signInWithPassword({ email: 'qa_admin_temp3@example.com', password: 'TestPassword123!' });
  
  // Try to insert a certificate directly
  const year = new Date().getFullYear();
  const { count } = await supabase
    .from('certificates')
    .select('*', { count: 'exact', head: true })
    .ilike('certificate_id', `CIX-${year}-%`);
  
  const nextNum = (count || 0) + 1;
  const certId = `CIX-${year}-${nextNum.toString().padStart(6, '0')}`;
  
  const { data, error } = await supabase.from('certificates').insert({
    certificate_id: certId,
    student_id: STUDENT_ID,
    program_id: PROGRAM_ID,
    enrollment_id: ENROLLMENT_ID,
    issue_date: new Date().toISOString().split('T')[0]
  });
  
  console.log('Error:', error?.message || 'None');
  console.log('CertID:', certId);
  
  // Check it was created
  const { data: cert } = await supabase.from('certificates').select('*').eq('certificate_id', certId).single();
  console.log('Cert in DB:', JSON.stringify(cert, null, 2));
}
check();
