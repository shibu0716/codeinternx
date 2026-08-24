import puppeteer from 'puppeteer';
const APP_URL = 'http://localhost:3000';
const ADMIN_EMAIL = 'qa_admin_temp3@example.com';
const ADMIN_PASSWORD = 'TestPassword123!';

async function loginAdmin(page) {
  await page.goto(`${APP_URL}/login`);
  await page.waitForSelector('input[name="email"]');
  await page.type('input[name="email"]', ADMIN_EMAIL);
  await page.type('input[name="password"]', ADMIN_PASSWORD);
  await page.evaluate(() => document.querySelector('button[type="submit"]').click());
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  
  // Handle 2FA if redirected
  if (page.url().includes('/verify-admin')) {
    console.log("Handling 2FA...");
    await page.waitForSelector('input[name="otp"]');
    await page.type('input[name="otp"]', '123456'); // QA bypass
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Verify'));
      if (btn) btn.click();
    });
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    console.log("2FA done, now at:", page.url());
  }
}

async function run() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await loginAdmin(page);
    console.log("Logged in, at:", page.url());

    await page.goto(`${APP_URL}/evaluator/review/f05d38d4-756d-4626-af9e-6b2d002dfe81`);
    await new Promise(r => setTimeout(r, 3000));
    
    // Handle 2FA again if session expired
    if (page.url().includes('/verify-admin')) {
      console.log("Handling 2FA again...");
      await page.waitForSelector('input[name="otp"]');
      await page.type('input[name="otp"]', '123456');
      await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Verify'));
        if (btn) btn.click();
      });
      await page.waitForNavigation({ waitUntil: 'networkidle0' });
      await page.goto(`${APP_URL}/evaluator/review/f05d38d4-756d-4626-af9e-6b2d002dfe81`);
      await new Promise(r => setTimeout(r, 3000));
    }
    
    const url = page.url();
    const text = await page.evaluate(() => document.body.innerText);
    console.log("URL:", url);
    console.log("Text:", text.substring(0, 500));
    
    const textareaEl = await page.$('textarea[name="feedback"]');
    console.log('textarea[name=feedback] found:', !!textareaEl);
    
  } finally {
    await browser.close();
  }
}

run();
