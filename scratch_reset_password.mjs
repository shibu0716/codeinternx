import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/);

const supabaseUrl = urlMatch ? urlMatch[1].trim() : 'http://127.0.0.1:54321';
const supabaseKey = keyMatch ? keyMatch[1].trim() : '';

if (!supabaseKey) {
  console.error('No service key found');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function reset() {
  const { data: users, error: listErr } = await supabase.auth.admin.listUsers();
  if (listErr) {
    console.error('List error:', listErr);
    return;
  }
  const user = users.users.find(u => u.email === 'qa_admin_temp@example.com');
  if (user) {
    const { error } = await supabase.auth.admin.updateUserById(user.id, {
      password: 'AdminPassword123!'
    });
    console.log('Password update result:', error || 'Success');
  } else {
    console.log('User not found. I will create them!');
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'qa_admin_temp@example.com',
      password: 'AdminPassword123!',
      email_confirm: true
    });
    console.log('Create result:', error || 'Success');
  }
}
reset();
