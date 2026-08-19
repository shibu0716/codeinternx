import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://fbzfoznyzpgzgfxedlzl.supabase.co', 'sb_publishable_LRSdl-QzP0U9o6MDc6W8Iw_OiFYCrlP');

async function run() {
  const email = `student_${Date.now()}@codeinternx.test`;
  console.log('Signing up', email);
  
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password: 'Password123!',
    options: {
      data: {
        first_name: 'Test',
        last_name: 'Student',
      }
    }
  });
  
  if (authError) {
    console.error("Signup error:", authError.message);
    return;
  }
  
  const studentId = authData.user.id;
  console.log("Student ID:", studentId);
  
  // Create profile (auth.signUp automatically creates auth.users, but might not create a profile depending on triggers. Let's assume there is a trigger or insert it if missing).
  const { error: profError } = await supabase.from('profiles').upsert({
    id: studentId,
    email: email,
    full_name: 'Test Student',
    role: 'STUDENT'
  });
  
  if (profError) {
    console.log("Profile error (might be fine if trigger exists):", profError.message);
  }

  // Fetch a program
  const { data: progs } = await supabase.from('programs').select('id').limit(1);
  if (!progs || progs.length === 0) {
    console.error("No programs found!");
    return;
  }
  const programId = progs[0].id;
  
  // Insert Application
  const { data: appData, error: appError } = await supabase.from('applications').insert({
    application_id: `CI-APP-TEST-${Math.floor(Math.random()*1000)}`,
    student_id: studentId,
    program_id: programId,
    status: 'ENROLLED'
  }).select('id').single();
  
  if (appError) {
    console.error("App insert error:", appError.message);
    return;
  }
  
  // Insert Enrollment
  const { error: enrollError } = await supabase.from('enrollments').insert({
    student_id: studentId,
    program_id: programId,
    is_completed: false
  });
  
  if (enrollError) {
    console.error("Enrollment error:", enrollError.message);
    return;
  }
  
  console.log("Success! Created student and enrolled them.");
  console.log("Email:", email);
  console.log("Password: Password123!");
}
run();
