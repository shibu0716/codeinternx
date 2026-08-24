import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const matrix = {
  emailSignup: 'FAIL',
  emailLogin: 'FAIL',
  passwordReset: 'FAIL',
  passwordChange: 'FAIL',
  studentAuthz: 'FAIL',
  adminAuthz: 'FAIL',
  rls: 'FAIL',
};

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTests() {
  const timestamp = Date.now();
  const testEmail = `student_${timestamp}@example.com`;
  const testPassword = 'SecurePassword123!';
  let userId;

  console.log('--- STARTING AUTH TEST MATRIX ---');

  // 1. Email Signup
  try {
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: { data: { first_name: 'Test', last_name: 'Student' } }
    });
    if (error) throw error;
    userId = data.user.id;
    matrix.emailSignup = 'PASS';
    console.log(`[PASS] Email Signup (User ID: ${userId})`);
  } catch (err) {
    console.error(`[FAIL] Email Signup: ${err.message}`);
    return matrix;
  }

  await delay(1000);

  // 2. Email Login
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });
    if (error) throw error;
    if (data.session) {
      matrix.emailLogin = 'PASS';
      console.log('[PASS] Email Login');
    }
  } catch (err) {
    console.error(`[FAIL] Email Login: ${err.message}`);
  }

  // 3. RLS - View own profile
  try {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (error) throw error;
    if (data && data.id === userId) {
      matrix.rls = 'PASS';
      console.log('[PASS] RLS (View own profile)');
    }
  } catch (err) {
    console.error(`[FAIL] RLS: ${err.message}`);
  }

  // 4. Password Change (Authenticated)
  try {
    const newPassword = 'NewSecurePassword123!';
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
    matrix.passwordChange = 'PASS';
    console.log('[PASS] Password Change');
    
    // Test login with new password
    await supabase.auth.signOut();
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: newPassword
    });
    if (loginError) throw loginError;
    console.log('[PASS] Login with new password');
  } catch (err) {
    console.error(`[FAIL] Password Change: ${err.message}`);
  }

  // 5. Password Reset (Unauthenticated)
  try {
    await supabase.auth.signOut();
    const { error } = await supabase.auth.resetPasswordForEmail(testEmail, {
      redirectTo: 'http://localhost:3000/auth/callback',
    });
    if (error) throw error;
    matrix.passwordReset = 'PASS';
    console.log('[PASS] Password Reset Email Generated');
  } catch (err) {
    console.error(`[FAIL] Password Reset: ${err.message}`);
  }

  // 6. Admin Authz check (Student trying to modify payment settings)
  try {
    // Re-login as student
    await supabase.auth.signInWithPassword({ email: testEmail, password: 'NewSecurePassword123!' });
    
    // Try to read payment settings (Allowed for all by RLS)
    const { error: readError } = await supabase.from('payment_settings').select('*');
    if (readError) console.error('Error reading payment settings:', readError);
    
    // Try to update payment settings (Denied for students)
    const { error: updateError } = await supabase.from('payment_settings').update({ bank_name: 'Hacked' }).eq('id', 1);
    if (updateError && updateError.code === '42501') { // row-level security violation
      matrix.studentAuthz = 'PASS';
      console.log('[PASS] Student Authorization (Blocked from admin actions)');
    } else {
      console.error('[FAIL] Student Authorization: Was able to bypass RLS!');
    }
  } catch (err) {
    console.error(`[FAIL] Student Authz: ${err.message}`);
  }

  console.log('\n--- RESULTS ---');
  console.log(matrix);
  return matrix;
}

runTests();
