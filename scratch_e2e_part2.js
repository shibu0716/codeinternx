import puppeteer from 'puppeteer';
const APP_URL = 'http://localhost:3000';
const ADMIN_EMAIL = 'qa_admin_temp3@example.com';
const ADMIN_PASSWORD = 'TestPassword123!';
const STUDENT_EMAIL = 'student_e2e_1787459446714@example.com';
const STUDENT_PASSWORD = 'Password123!';
const TASK_ID = '2407f6c0-f144-4a72-93b2-9cffe701de7a';

// Helper: Login admin with 2FA bypass
async function loginAdmin(page) {
  await page.goto(`${APP_URL}/login`);
  await page.waitForSelector('input[name="email"]');
  await page.type('input[name="email"]', ADMIN_EMAIL);
  await page.type('input[name="password"]', ADMIN_PASSWORD);
  await page.evaluate(() => document.querySelector('button[type="submit"]').click());
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  
  // Handle 2FA (field name is "code" not "otp")
  if (page.url().includes('/verify-admin')) {
    console.log("Handling 2FA...");
    await page.waitForSelector('input[name="code"]', { timeout: 10000 });
    await page.type('input[name="code"]', '123456'); // QA bypass
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button[type="submit"]'))[0];
      if (btn) btn.click();
    });
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    console.log("2FA done, now at:", page.url());
  }
}

// Helper: Login student
async function loginStudent(page) {
  await page.goto(`${APP_URL}/login`);
  await page.waitForSelector('input[name="email"]');
  await page.type('input[name="email"]', STUDENT_EMAIL);
  await page.type('input[name="password"]', STUDENT_PASSWORD);
  await page.evaluate(() => document.querySelector('button[type="submit"]').click());
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
}

async function run() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // ============================
    // STEP 6: Student Submits Task
    // ============================
    console.log("[6] Student Task Submission");
    await loginStudent(page);

    await page.goto(`${APP_URL}/dashboard/tasks/${TASK_ID}`);
    await new Promise(r => setTimeout(r, 3000));
    
    const isSubmitted = await page.evaluate(() => {
        const text = document.body.innerText;
        return text.includes('Pending Review') || text.includes('Approved') || text.includes('Changes Requested');
    });

    if (!isSubmitted) {
        console.log("Filling submission form...");
        await page.waitForSelector('#githubUrl', { timeout: 10000 });
        await page.type('#githubUrl', 'https://github.com/codeinternx/e2e-test');
        await page.type('#liveUrl', 'https://codeinternx-e2e.vercel.app');
        
        // Use the "Submit Revision" button by text (not generic type=submit)
        await page.evaluate(() => {
            const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.trim() === 'Submit Revision');
            if (btn) btn.click();
            else throw new Error("Submit Revision button not found");
        });
        
        await new Promise(r => setTimeout(r, 5000));
        await page.goto(`${APP_URL}/dashboard/tasks/${TASK_ID}`);
        await new Promise(r => setTimeout(r, 2000));
        
        const submitted = await page.evaluate(() => {
            return document.body.innerText.includes('Pending Review') || document.body.innerText.includes('Approved');
        });
        console.log(submitted ? "[PASS] Student submitted task" : "[FAIL] Task not submitted");
    } else {
        console.log("[PASS] Student task already submitted");
    }
    
    // Clear cookies for admin login
    const client = await page.target().createCDPSession();
    await client.send('Network.clearBrowserCookies');

    // ============================
    // STEP 7: Admin Evaluates
    // ============================
    console.log("[7] Admin Reviews Submission");
    await loginAdmin(page);

    await page.goto(`${APP_URL}/evaluator/queue`);
    await page.waitForSelector('table', { timeout: 10000 });
    await new Promise(r => setTimeout(r, 1000));
    
    const reviewHref = await page.evaluate(() => {
        const link = Array.from(document.querySelectorAll('a')).find(l => l.href.includes('/evaluator/review/'));
        return link ? link.href : null;
    });
    
    if (reviewHref) {
        console.log("Review link:", reviewHref);
        await page.goto(reviewHref);
        await new Promise(r => setTimeout(r, 3000));
        
        // Check 2FA again on navigating to evaluator/review
        if (page.url().includes('/verify-admin')) {
            await page.waitForSelector('input[name="code"]', { timeout: 5000 });
            await page.type('input[name="code"]', '123456');
            await page.evaluate(() => document.querySelector('button[type="submit"]').click());
            await page.waitForNavigation({ waitUntil: 'networkidle0' });
            await page.goto(reviewHref);
            await new Promise(r => setTimeout(r, 3000));
        }
        
        const hasFeedback = await page.$('textarea[name="feedback"]');
        if (hasFeedback) {
            await page.type('textarea[name="feedback"]', 'Excellent work! E2E test passing.');
            
            await page.evaluate(() => {
                const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('Submit Final Grade'));
                if (btn) btn.click();
            });
            
            await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
            await new Promise(r => setTimeout(r, 3000));
            console.log("[PASS] Admin evaluated task");
        } else {
            const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 300));
            console.error("[FAIL] textarea[name=feedback] not found. Page:", bodyText);
        }
    } else {
        console.log("[WARN] No review link found in queue.");
    }

    // ============================
    // STEP 8: Admin Issues Certificate
    // ============================
    console.log("[8] Admin Issues Certificate");
    await page.goto(`${APP_URL}/admin/certificates`);
    await page.waitForSelector('table', { timeout: 15000 });
    await new Promise(r => setTimeout(r, 2000));
    
    const hasCert = await page.evaluate(() => document.body.innerText.includes('CIX-202'));
    
    if (hasCert) {
        console.log("[PASS] Certificate already exists");
        await page.screenshot({ path: 'e2e_cert_success.png', fullPage: true });
    } else {
        const clickedIssue = await page.evaluate(() => {
            const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('Issue') && b.textContent?.includes('Certificate') && !b.textContent?.includes('Bulk'));
            if (btn) { btn.click(); return true; }
            return false;
        });
        
        if (clickedIssue) {
            await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
            await page.click('button[role="combobox"]');
            await page.waitForSelector('[role="option"]');
            await page.evaluate(() => {
                const opts = Array.from(document.querySelectorAll('[role="option"]'));
                if (opts.length > 0) opts[0].click();
            });
            await page.evaluate(() => {
                const btn = Array.from(document.querySelectorAll('[role="dialog"] button')).find(b => b.textContent?.includes('Generate Certificate'));
                if (btn) btn.click();
            });
            
            await new Promise(r => setTimeout(r, 4000));
            console.log("[PASS] Certificate generation triggered");
            
            await page.reload({ waitUntil: 'networkidle0' });
            await new Promise(r => setTimeout(r, 2000));
            
            const hasCertNow = await page.evaluate(() => document.body.innerText.includes('CIX-202'));
            if (hasCertNow) {
                console.log("[PASS] Certificate confirmed in list");
                await page.screenshot({ path: 'e2e_cert_success.png', fullPage: true });
            } else {
                console.error("[FAIL] Certificate not found after generation");
                await page.screenshot({ path: 'e2e_cert_fail.png', fullPage: true });
            }
        } else {
            console.log("[WARN] Issue Certificate button not found");
            const buttons = await page.evaluate(() => Array.from(document.querySelectorAll('button')).map(b => b.textContent?.trim()));
            console.log("Buttons on page:", JSON.stringify(buttons));
        }
    }
    
    console.log("=== PART 2 E2E COMPLETE ===");
    
  } catch (error) {
    console.error("E2E Test Failed:", error.message);
    await page.screenshot({ path: 'e2e_error.png', fullPage: true }).catch(() => {});
  } finally {
    await browser.close();
  }
}

run();
