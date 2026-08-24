import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSignup() {
  const email = `test_${Date.now()}@example.com`;
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password: 'Password123!',
    options: { data: { first_name: 'Test', last_name: 'User' } }
  });

  console.log('Session present immediately after signUp?:', !!data.session);
  const { data: userData } = await supabase.auth.getUser();
  console.log('User present immediately after signUp?:', !!userData?.user);
}

testSignup();
