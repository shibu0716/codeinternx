import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

export interface CertificateData {
  studentName: string;
  internshipDomain: string;
  companyName: string;
  startDate: string;
  endDate: string;
  issueDate: string;
  certificateId: string;
  signatoryName: string;
}

export async function generateCertificatePDF(data: CertificateData): Promise<Buffer> {
  // 1. Read HTML Template
  const templatePath = path.join(process.cwd(), 'certificates', 'certificate.html');
  let html = fs.readFileSync(templatePath, 'utf-8');

  // 2. Generate QR Code URL
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://codeinternx.com'}/verify/certificate/${data.certificateId}`;
  const qrCodeImg = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verifyUrl)}" alt="QR Code">`;

  // 3. Replace placeholders
  html = html.replace('{{student_name}}', data.studentName)
             .replace('{{internship_domain}}', data.internshipDomain)
             .replace('{{company_name}}', data.companyName)
             .replace('{{start_date}}', data.startDate)
             .replace('{{end_date}}', data.endDate)
             .replace('{{issue_date}}', data.issueDate)
             .replace('{{certificate_id}}', data.certificateId)
             .replace('{{signatory_name}}', data.signatoryName)
             .replace('{{qr_code_svg}}', qrCodeImg);

  // 4. Read CSS to inject directly (since Puppeteer might struggle with relative linked CSS)
  const cssPath = path.join(process.cwd(), 'certificates', 'certificate.css');
  const css = fs.readFileSync(cssPath, 'utf-8');
  html = html.replace('<link rel="stylesheet" href="certificate.css">', `<style>${css}</style>`);

  // Handle local assets (base64 inline them or use file:// protocol)
  // For simplicity, we convert local assets to base64 if they exist
  try {
    const logoPath = path.join(process.cwd(), 'certificates', 'assets', 'logo.png');
    if (fs.existsSync(logoPath)) {
      const logoBase64 = fs.readFileSync(logoPath).toString('base64');
      html = html.replace('assets/logo.png', `data:image/png;base64,${logoBase64}`);
    }
    
    const sigPath = path.join(process.cwd(), 'certificates', 'assets', 'signature.png');
    if (fs.existsSync(sigPath)) {
      const sigBase64 = fs.readFileSync(sigPath).toString('base64');
      html = html.replace('assets/signature.png', `data:image/png;base64,${sigBase64}`);
    }
  } catch (e) {
    console.error("Asset embedding error:", e);
  }

  // 5. Generate PDF
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'load' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      landscape: true,
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });
    
    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}
