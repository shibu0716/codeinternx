import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Signing up Test Admin...");
  const { data: admin, error: adminErr } = await supabase.auth.signUp({
    email: 'test_admin@example.com',
    password: 'StrongPassword123!',
    options: {
        data: {
            full_name: 'Test Admin'
        }
    }
  });
  console.log("Admin:", admin?.user?.email, adminErr?.message || "Success");
}
main();
