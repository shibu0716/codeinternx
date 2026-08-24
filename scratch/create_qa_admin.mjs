import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function setupQAAdmin() {
  const email = 'qa_admin_temp@example.com';
  const password = 'Password123!';

  console.log(`Checking if QA admin exists: ${email}`);

  let { data: users, error: listError } = await supabase.auth.admin.listUsers();
  
  if (listError) {
    console.error("Error listing users:", listError);
    process.exit(1);
  }

  let user = users.users.find(u => u.email === email);

  if (!user) {
    console.log("User not found. Creating...");
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: 'SUPER_ADMIN', full_name: 'QA Admin' }
    });

    if (createError) {
      console.error("Error creating user:", createError);
      process.exit(1);
    }
    user = newUser.user;
    console.log("Created user with ID:", user.id);
  } else {
    console.log("User already exists with ID:", user.id);
    
    // update password just in case
    await supabase.auth.admin.updateUserById(user.id, { password });
  }

  // Ensure they are in the admins table
  console.log("Ensuring user is in admins table...");
  const { error: insertError } = await supabase
    .from('admins')
    .upsert({ id: user.id, email: user.email, role: 'SUPER_ADMIN' }, { onConflict: 'id' });

  if (insertError) {
    console.error("Error adding to admins table:", insertError);
    process.exit(1);
  }

  console.log("QA Admin setup complete.");
}

setupQAAdmin().catch(console.error);
