import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Signing up test user...");
  const { data: user, error } = await supabase.auth.signUp({
    email: 'test_demo_user@example.com',
    password: 'StrongPassword123!',
    options: {
        data: {
            full_name: 'Test Demo User'
        }
    }
  });
  console.log("User:", user?.user?.email, error?.message || "Success");

  console.log("Signing up QA Admin...");
  const { data: admin, error: adminErr } = await supabase.auth.signUp({
    email: 'qa_admin_temp@example.com',
    password: 'StrongPassword123!',
    options: {
        data: {
            full_name: 'QA Admin'
        }
    }
  });
  console.log("Admin:", admin?.user?.email, adminErr?.message || "Success");
}
main();
