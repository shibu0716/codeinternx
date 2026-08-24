import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSignup() {
  const email = `test_${Date.now()}@example.com`;
  console.log(`Testing signup with email: ${email}`);
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password: 'Password123!',
    options: {
      data: {
        first_name: 'Test',
        last_name: 'User'
      }
    }
  });

  if (error) {
    console.error('Signup error:', error.message);
    return;
  }

  console.log('Signup successful, User ID:', data.user.id);
  
  // Wait a moment for trigger
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Check if profile exists using anon client? Wait, RLS might prevent anon select.
  // But wait, there is a policy: "Users can view their own profile" USING (auth.uid() = id).
  // But wait, since we haven't verified email, we can't login, so auth.uid() is null.
  // We can login if email confirmations are disabled!
  
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password: 'Password123!'
  });

  if (loginError) {
    console.error('Login error (expected if email confirmation required):', loginError.message);
  } else {
    console.log('Login successful without confirmation!');
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', loginData.user.id).single();
    console.log('Profile:', profile);
  }
}

testSignup();
