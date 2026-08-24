import puppeteer from 'puppeteer';
import fs from 'fs';
const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

const APP_URL = 'http://localhost:3000';
const ADMIN_EMAIL = 'qa_admin_temp3@example.com';
const ADMIN_PASSWORD = 'TestPassword123!';
const STUDENT_EMAIL = 'student_e2e_1787459446714@example.com';
const STUDENT_PASSWORD = 'Password123!';

async function loginAdmin(page) {
  await page.goto(`${APP_URL}/login`);
  await page.waitForSelector('input[name="email"]');
  await page.type('input[name="email"]', ADMIN_EMAIL);
  await page.type('input[name="password"]', ADMIN_PASSWORD);
  await page.evaluate(() => document.querySelector('button[type="submit"]').click());
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  
  if (page.url().includes('/verify-admin')) {
    await page.waitForSelector('input[name="code"]', { timeout: 10000 });
    await page.type('input[name="code"]', '123456');
    await page.evaluate(() => document.querySelector('button[type="submit"]').click());
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
  }
}

async function run() {
  // 1. Check payment settings exist
  await supabase.auth.signInWithPassword({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
  const { data: settings } = await supabase.from('payment_settings').select('*').maybeSingle();
  console.log("[PA1] Payment settings:", settings ? `Found (UPI: ${settings.upi_id_primary})` : "NOT FOUND");
  
  // 2. Check existing payments
  const { data: payments } = await supabase.from('payments').select('id, status, amount, payment_method').limit(5);
  console.log("[PA2] Existing payments:", JSON.stringify(payments, null, 2));
  
  // 3. Check the student has an approved application
  await supabase.auth.signInWithPassword({ email: STUDENT_EMAIL, password: STUDENT_PASSWORD });
  const { data: apps } = await supabase
    .from('applications')
    .select('id, status, program_id')
    .order('created_at', { ascending: false });
  console.log("[PA3] Student applications:", JSON.stringify(apps, null, 2));
  
  // 4. Check payment page UI via puppeteer
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // Login as student
    await page.goto(`${APP_URL}/login`);
    await page.waitForSelector('input[name="email"]');
    await page.type('input[name="email"]', STUDENT_EMAIL);
    await page.type('input[name="password"]', STUDENT_PASSWORD);
    await page.evaluate(() => document.querySelector('button[type="submit"]').click());
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    
    // Check dashboard for payment button
    await page.goto(`${APP_URL}/dashboard`);
    await new Promise(r => setTimeout(r, 2000));
    const dashText = await page.evaluate(() => document.body.innerText.substring(0, 1000));
    console.log("[PA4] Dashboard text (looking for payment link):", dashText.includes('payment') || dashText.includes('Payment') ? 'Payment mention found' : 'No payment mention');
    
    // Check /dashboard/payments
    await page.goto(`${APP_URL}/dashboard/payments`);
    await new Promise(r => setTimeout(r, 2000));
    const payText = await page.evaluate(() => document.body.innerText.substring(0, 600));
    console.log("[PA5] /dashboard/payments:", payText.substring(0, 300));
    
    // Admin view of payments
    const client = await page.target().createCDPSession();
    await client.send('Network.clearBrowserCookies');
    await loginAdmin(page);
    
    await page.goto(`${APP_URL}/admin/payments`);
    await new Promise(r => setTimeout(r, 2000));
    const adminPayText = await page.evaluate(() => document.body.innerText.substring(0, 500));
    console.log("[PA6] /admin/payments:", adminPayText.substring(0, 300));
    
    console.log("=== PAYMENT AUDIT COMPLETE ===");
    
  } finally {
    await browser.close();
  }
}

run().catch(console.error);
