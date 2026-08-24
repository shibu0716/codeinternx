const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  const { data: student } = await supabase.from('profiles').select('id, email').eq('email', 'qa_student@example.com').single();
  console.log("Student:", student);
  
  if (student) {
    const { data: enrollments, error } = await supabase
      .from('enrollments')
      .select('*, programs(*)')
      .eq('student_id', student.id);
    console.log("Enrollments:", enrollments);
    console.log("Error:", error);
  }
}
main();
