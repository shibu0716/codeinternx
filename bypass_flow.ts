import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
// Use anon key, but we might need a user token. We'll login as admin to do admin things.
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data: adminAuth } = await supabase.auth.signInWithPassword({
      email: 'test_admin@example.com',
      password: 'StrongPassword123!'
  });
  if (!adminAuth.session) {
      console.log("Admin login failed", adminAuth);
      return;
  }
  console.log("Admin logged in");

  const { data: userAuth } = await supabase.auth.signInWithPassword({
      email: 'test_demo_user@example.com',
      password: 'StrongPassword123!'
  });
  if (!userAuth.session) {
      console.log("User login failed", userAuth);
      return;
  }
  const userId = userAuth.user.id;
  console.log("User logged in, ID:", userId);

  // We need to restore admin session to do admin DB changes
  await supabase.auth.setSession(adminAuth.session);

  // 1. Get user's application
  let { data: apps } = await supabase.from('applications').select('*').eq('student_id', userId);
  if (!apps || apps.length === 0) {
      console.log("No application found for user. Let's create one.");
      // fetch a program
      const { data: progs } = await supabase.from('programs').select('id').limit(1);
      if (progs && progs.length > 0) {
          const res = await supabase.from('applications').insert({
              student_id: userId,
              program_id: progs[0].id,
              status: 'APPROVED',
              github_url: 'https://github.com',
              linkedin_url: 'https://linkedin.com',
              experience_level: 'beginner',
              goals: 'learn'
          }).select();
          apps = res.data;
          console.log("Created & approved application");
      }
  } else {
      await supabase.from('applications').update({ status: 'APPROVED' }).eq('id', apps[0].id);
      console.log("Approved application");
  }

  if (apps && apps.length > 0) {
      const progId = apps[0].program_id;
      // 2. Create enrollment
      let { data: enrolls } = await supabase.from('enrollments').select('*').eq('student_id', userId);
      if (!enrolls || enrolls.length === 0) {
          const res = await supabase.from('enrollments').insert({
              student_id: userId,
              program_id: progId,
              status: 'COMPLETED',
              progress: 100
          }).select();
          enrolls = res.data;
          console.log("Created enrollment");
      } else {
          await supabase.from('enrollments').update({ status: 'COMPLETED', progress: 100 }).eq('id', enrolls[0].id);
          console.log("Updated enrollment to COMPLETED");
      }

      if (enrolls && enrolls.length > 0) {
           const enrollId = enrolls[0].id;
           // Issue certificate
           const certId = `CIX-2026-${Math.floor(Math.random() * 100000)}`;
           const { error } = await supabase.from('certificates').insert({
               certificate_id: certId,
               student_id: userId,
               program_id: progId,
               enrollment_id: enrollId,
               issue_date: new Date().toISOString()
           });
           if (error && !error.message.includes('unique constraint')) {
               console.log("Error creating cert", error);
           } else {
               console.log("Certificate issued:", certId);
           }
      }
  }
}
main();
