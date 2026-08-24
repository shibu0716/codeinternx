import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testAuthz() {
  const email = `student_${Date.now()}@example.com`;
  
  await supabase.auth.signUp({
    email,
    password: 'Password123!',
    options: { data: { first_name: 'Test', last_name: 'Student' } }
  });
  
  // Try to read other profiles
  const { data: profiles, error: readProfileError } = await supabase.from('profiles').select('*');
  console.log('Profiles read (should be 1 or filtered):', profiles?.length, 'Error:', readProfileError);
  
  // Try to insert into programs (Admin only)
  const { error: insertProgramError } = await supabase.from('programs').insert({
    title: 'Hacked Program',
    slug: 'hacked-program',
    category: 'hack',
    duration_weeks: 4,
    level: 'BEGINNER',
    mode: 'ONLINE'
  });
  console.log('Insert Program Error (Should be 42501):', insertProgramError?.code);
}

testAuthz();
