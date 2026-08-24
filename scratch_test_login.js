const puppeteer = require('puppeteer-core');
const APP_URL = 'http://localhost:3000';
const ADMIN_EMAIL = 'qa_admin_temp@example.com';
const ADMIN_PASSWORD = 'AdminPassword123!';

(async () => {
    const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' }).catch(() => null) 
                 || await puppeteer.launch({ channel: 'chrome', headless: true });
    const page = await browser.newPage();
    
    console.log('Going to login page...');
    await page.goto(`${APP_URL}/login`);
    await page.waitForSelector('input[name="email"]');
    
    await page.type('input[name="email"]', ADMIN_EMAIL);
    await page.type('input[name="password"]', ADMIN_PASSWORD);
    
    console.log('Submitting...');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const btn = btns.find(b => b.textContent.includes('Sign in') || b.type === 'submit');
        if (btn) btn.click();
      })
    ]);
    
    console.log('Landed on:', page.url());
    const bodyText = await page.evaluate(() => document.body.innerText);
    if (page.url().includes('error=')) {
      console.log('Error in URL!');
    }
    await browser.close();
})();
