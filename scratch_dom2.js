import puppeteer from 'puppeteer';
const APP_URL = 'http://localhost:3000';
const STUDENT_EMAIL = 'student_e2e_1787459446714@example.com';
const STUDENT_PASSWORD = 'Password123!';
const TASK_ID = '2407f6c0-f144-4a72-93b2-9cffe701de7a';

async function run() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto(`${APP_URL}/login`);
    await page.waitForSelector('input[name="email"]');
    await page.type('input[name="email"]', STUDENT_EMAIL);
    await page.type('input[name="password"]', STUDENT_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });

    await page.goto(`${APP_URL}/dashboard/tasks/${TASK_ID}`);
    await new Promise(r => setTimeout(r, 3000));
    
    // Check current status
    const text = await page.evaluate(() => document.body.innerText);
    console.log("=== PAGE TEXT ===");
    console.log(text.substring(0, 1000));
    
    // Now try to fill and submit
    const hasInput = await page.$('#githubUrl');
    if (hasInput) {
      console.log("=== FOUND INPUT, SUBMITTING ===");
      await page.type('#githubUrl', 'https://github.com/codeinternx/e2e-test');
      await page.type('#liveUrl', 'https://codeinternx-e2e.vercel.app');
      await page.click('button[type="submit"]');
      await new Promise(r => setTimeout(r, 5000));
      const textAfter = await page.evaluate(() => document.body.innerText);
      console.log("=== AFTER SUBMIT ===");
      console.log(textAfter.substring(0, 1000));
    } else {
      console.log("=== NO INPUT FOUND ===");
    }
    
  } finally {
    await browser.close();
  }
}

run();
