import fs from 'fs';
let code = fs.readFileSync('scratch_e2e.js', 'utf8');

const oldLogic = `    const approveClicked = await page.evaluate((email) => {
       const rows = Array.from(document.querySelectorAll('tr'));
       const row = rows.find(r => r.textContent.includes(email));
       if (!row) return false;
       const btn = Array.from(row.querySelectorAll('button')).find(b => b.textContent.includes('Issue Offer Letter'));
       if (btn) {
          btn.click();
          return true;
       }
       return false;
    }, studentEmail);`;

const newLogic = `    const approveClicked = await page.evaluate(async (email) => {
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
        console.log(\`[PASS] Admin clicked Approve\`);
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
`;

code = code.replace(oldLogic, newLogic);
fs.writeFileSync('scratch_e2e.js', code);
