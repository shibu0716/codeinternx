import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const email = `test_${Date.now()}@example.com`;
  console.log('Signing up', email);
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
  } else {
    console.log('Signup success:', data.user?.id);
    console.log('Session exists?', !!data.session);
  }
}

run();
