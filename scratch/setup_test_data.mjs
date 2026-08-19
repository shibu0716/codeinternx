import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://fbzfoznyzpgzgfxedlzl.supabase.co', 'sb_publishable_LRSdl-QzP0U9o6MDc6W8Iw_OiFYCrlP');

async function run() {
  await supabase.auth.signInWithPassword({
    email: 'shibu95085@gmail.com',
    password: 'Aniket91020@12%*'
  });
  
  const { data: prog, error: progErr } = await supabase.from('programs').insert({
    title: 'Full Stack Development',
    slug: 'full-stack-dev-' + Date.now(),
    description: 'Learn full stack.',
    price: 500
  }).select('id').single();
  
  if (progErr) console.log("Program err:", progErr.message);
  const programId = prog?.id;
  if (!programId) return;
  
  const email = `student_${Date.now()}@codeinternx.test`;
  const { data: studentData } = await supabase.auth.signUp({
    email,
    password: 'Password123!',
    options: {
      data: {
        first_name: 'Test',
        last_name: 'Student',
      }
    }
  });
  const studentId = studentData.user.id;
  
  await supabase.auth.signInWithPassword({
    email: 'shibu95085@gmail.com',
    password: 'Aniket91020@12%*'
  });

  const { error: appErr } = await supabase.from('applications').insert({
    application_id: `CI-APP-TEST-${Math.floor(Math.random()*1000)}`,
    student_id: studentId,
    program_id: programId,
    status: 'ENROLLED'
  });
  if (appErr) console.log("App err:", appErr.message);

  const { error: enrollErr } = await supabase.from('enrollments').insert({
    student_id: studentId,
    program_id: programId,
    is_completed: false
  });
  if (enrollErr) console.log("Enroll err:", enrollErr.message);

  console.log("Done! Student:", email);
}
run();
