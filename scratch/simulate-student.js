const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function main() {
  const { data: users, error } = await supabase.auth.signInWithPassword({
    email: 'alice@example.com',
    password: 'password123'
  });
  console.log('Login result:', users ? 'Success' : 'Failed', error?.message || '');
}
main();
