import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
  console.log("Seeding QA Admin...");
  const { data: admin, error: adminErr } = await supabase.auth.admin.createUser({
    email: 'qa_admin_temp@example.com',
    password: 'password123',
    email_confirm: true,
  });
  if (adminErr) {
    if (adminErr.message.includes('already registered')) {
        console.log("QA Admin already exists. Updating password...");
        const { data: existingAdmin } = await supabase.from('profiles').select('id').eq('email', 'qa_admin_temp@example.com').single();
        // we can't easily update password without id, let's just assume it's password123 or update it via service role
        const { data: users } = await supabase.auth.admin.listUsers();
        const user = users.users.find(u => u.email === 'qa_admin_temp@example.com');
        if (user) {
            await supabase.auth.admin.updateUserById(user.id, { password: 'password123' });
            console.log("QA Admin password updated to password123");
        }
    } else {
        console.error("Error creating QA Admin:", adminErr);
    }
  } else {
      console.log("QA Admin created.");
  }
}
main();
