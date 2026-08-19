require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function run() {
  const { data: enrollments, error: e1 } = await supabase.from('enrollments').select('id, student_id, program_id, profiles(full_name, email), programs(title)');
  const { data: certs, error: e2 } = await supabase.from('certificates').select('*');
  console.log("Enrollments:", JSON.stringify(enrollments, null, 2), e1);
  console.log("Certs:", JSON.stringify(certs, null, 2), e2);
}
run();
