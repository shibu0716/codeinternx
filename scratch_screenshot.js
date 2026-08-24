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
    await page.screenshot({ path: 'e2e_student_task.png', fullPage: true });
    
  } finally {
    await browser.close();
  }
}

run();
