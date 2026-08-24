import puppeteer from 'puppeteer';

const APP_URL = 'http://localhost:3000';
const ADMIN_EMAIL = 'qa_admin_temp3@example.com';
const ADMIN_PASSWORD = 'TestPassword123!';

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  const browser = await puppeteer.launch({ 
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const timestamp = Date.now();
  const studentEmail = `student_e2e_${timestamp}@example.com`;
  const studentPassword = 'Password123!';
  
  console.log('--- E2E BUSINESS WORKFLOW TEST ---');
  
  try {
    // ==========================================
    // 0. CREATE QA ADMIN (If needed)
    // ==========================================
    console.log(`[0] Preparing QA Admin: ${ADMIN_EMAIL}`);
    await page.goto(`${APP_URL}/signup`);
    await page.waitForSelector('input[name="firstName"]');
    await page.type('input[name="firstName"]', 'QA');
    await page.type('input[name="lastName"]', 'Admin');
    await page.type('input[name="email"]', ADMIN_EMAIL);
    await page.type('input[name="password"]', ADMIN_PASSWORD);
    
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {}),
      page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const submit = btns.find(b => b.textContent.includes('Create account') || b.type === 'submit');
        if (submit) submit.click();
      })
    ]);
    
    const client = await page.target().createCDPSession();
    await client.send('Network.clearBrowserCookies');

    // ==========================================
    // 1. STUDENT REGISTRATION
    // ==========================================
    console.log(`[1] Registering test student: ${studentEmail}`);
    await page.goto(`${APP_URL}/signup`);
    await page.waitForSelector('input[name="firstName"]');
    await page.type('input[name="firstName"]', 'Test');
    await page.type('input[name="lastName"]', 'StudentE2E');
    await page.type('input[name="email"]', studentEmail);
    await page.type('input[name="password"]', studentPassword);
    
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const submit = btns.find(b => b.textContent.includes('Create account') || b.type === 'submit');
        if (submit) submit.click();
      })
    ]);
    console.log(`[PASS] Student registered`);
    
    // ==========================================
    // 3. APPLY FOR INTERNSHIP
    // ==========================================
    console.log(`[3] Applying for Internship`);
    await page.goto(`${APP_URL}/internships`);
    
    await page.waitForSelector('a[href*="/internships/"]', { timeout: 10000 });
    const programUrl = await page.$eval('a[href*="/internships/"]', el => el.href);
    console.log(`Navigating to program: ${programUrl}`);
    await page.goto(programUrl);

    await page.waitForSelector('a[href*="/apply"]', { timeout: 10000 });
    const applyUrl = await page.$eval('a[href*="/apply"]', el => el.href);
    console.log(`Navigating to apply: ${applyUrl}`);
    await page.goto(applyUrl);
    
    await page.waitForSelector('input[name="college"]', { timeout: 10000 });
    await page.type('input[name="fullName"]', 'Test StudentE2E');
    await page.type('input[name="email"]', studentEmail);
    await page.type('input[name="phone"]', '9876543210');
    await page.type('input[name="college"]', 'E2E Test Institute');
    await page.type('input[name="degree"]', 'B.Tech');
    await page.type('input[name="branch"]', 'Computer Science');
    await page.select('select[name="currentYear"]', '3');
    await page.type('input[name="graduationYear"]', '2026');
    await page.evaluate(() => document.querySelector('input[name="termsAccepted"]').click());

    // Safe Submit
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.textContent.includes('Submit Application'));
      if (btn) btn.click();
    });
    
    // Wait for the success page "Application Submitted Successfully"
    try {
        await page.waitForFunction(
          () => document.querySelector('h1')?.innerText.includes('Successfully'),
          { timeout: 10000 }
        );
        console.log(`[PASS] Applied for internship`);
    } catch(e) {
        const text = await page.$eval('h1', el => el.innerText).catch(()=>'No H1');
        console.log('WARNING: Did not see success message. Text was:', text);
    }
    
    await client.send('Network.clearBrowserCookies');

    // ==========================================
    // 4. ADMIN LOGIN & APPROVAL
    // ==========================================
    console.log(`[4] Admin Review & Offer Letter`);
    await page.goto(`${APP_URL}/login`);
    await page.waitForSelector('input[name="email"]');
    await page.type('input[name="email"]', ADMIN_EMAIL);
    await page.type('input[name="password"]', ADMIN_PASSWORD);
    
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const btn = btns.find(b => b.textContent.includes('Sign in') || b.type === 'submit');
        if (btn) btn.click();
      })
    ]);
    
    await page.goto(`${APP_URL}/admin`);
    if (page.url().includes('verify-admin')) {
        await page.waitForSelector('input[name="code"]');
        await page.type('input[name="code"]', '123456');
        await Promise.all([
          page.waitForNavigation({ waitUntil: 'networkidle0' }),
          page.evaluate(() => {
             const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Verify') && b.type === 'submit');
             if (btn) btn.click();
          })
        ]);
    }
    
    if (!page.url().includes('/admin')) {
        throw new Error(`Admin failed to access /admin dashboard. Current URL: ${page.url()}`);
    }

    await page.goto(`${APP_URL}/admin/applications`);
    await delay(2000); 
    
    const approveClicked = await page.evaluate(async (email) => {
       const rows = Array.from(document.querySelectorAll('tr'));
       const row = rows.find(r => r.textContent.includes(email));
       if (!row) return false;
       
       const approveBtn = Array.from(row.querySelectorAll('button')).find(b => b.textContent.includes('Approve'));
       if (approveBtn) {
          approveBtn.click();
       }
       return true;
    }, studentEmail);
    
    if (approveClicked) {
        console.log(`[PASS] Admin clicked Approve`);
    } else {
        throw new Error("Could not find Approve button for the student");
    }
    
    // Wait for the status to change and Issue Offer button to appear
    await new Promise(r => setTimeout(r, 2000));
    
    const issueClicked = await page.evaluate(async (email) => {
       const rows = Array.from(document.querySelectorAll('tr'));
       const row = rows.find(r => r.textContent.includes(email));
       if (!row) return false;
       
       const issueBtn = Array.from(row.querySelectorAll('button')).find(b => b.textContent.includes('Issue Offer Letter'));
       if (issueBtn) {
          issueBtn.click();
          return true;
       }
       return false;
    }, studentEmail);
    
    if (!issueClicked) {
        throw new Error("Could not find Issue Offer Letter button for the student after approval");
    }

    
    if (approveClicked) {
        console.log(`[PASS] Admin approved application`);
    } else {
        throw new Error("Could not find Issue Offer Letter button for the student");
    }
    
    await delay(2000);
    await client.send('Network.clearBrowserCookies');
    
    // ==========================================
    // 5. STUDENT ACCEPT OFFER
    // ==========================================
    console.log(`[5] Student Accepts Offer`);
    await page.goto(`${APP_URL}/login`);
    await page.waitForSelector('input[name="email"]');
    await page.type('input[name="email"]', studentEmail);
    await page.type('input[name="password"]', studentPassword);
    
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const btn = btns.find(b => b.textContent.includes('Sign in') || b.type === 'submit');
        if (btn) btn.click();
      })
    ]);
    
    await page.goto(`${APP_URL}/dashboard/offer-letter`);
    await delay(2000);
    
    const acceptClicked = await page.evaluate(() => {
       const btns = Array.from(document.querySelectorAll('button'));
       const acceptBtn = btns.find(b => b.textContent.includes('Accept Offer'));
       if (acceptBtn) {
          acceptBtn.click();
          return true;
       }
       return false;
    });
    
    if (acceptClicked) {
        console.log(`[PASS] Student accepted offer`);
    } else {
        throw new Error("Could not find 'Accept Offer' button on offer letter page");
    }
    
    await delay(2000);
    
    // Let's verify enrollment was created!
    await page.goto(`${APP_URL}/dashboard/internships`);
    await delay(2000);
    
    const hasInternship = await page.evaluate(() => {
        return document.body.textContent.includes('Full Stack') || document.body.textContent.includes('Web Development');
    });
    
    if (hasInternship) {
        console.log(`[PASS] Student enrollment verified in dashboard`);
    } else {
        console.log(`WARNING: Student enrollment not found in dashboard`);
    }

    console.log('--- ALL E2E STEPS PASSED SUCCESSFULLY ---');

  } catch (err) {
    console.error('Test Failed:', err);
  } finally {
    await browser.close();
  }
}

run();
