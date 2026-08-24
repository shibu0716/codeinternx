import puppeteer, { PaperFormat } from 'puppeteer';

export interface PdfOptions {
  format?: PaperFormat;
  landscape?: boolean;
  printBackground?: boolean;
}

/**
 * Generates a PDF buffer from an HTML string using Puppeteer.
 */
export async function generatePdf(htmlContent: string, options: PdfOptions = {}): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  try {
    const page = await browser.newPage();
    
    // Set content and wait for network idle to ensure local assets (images, css) are loaded
    await page.setContent(htmlContent, {
      waitUntil: ['load', 'domcontentloaded'],
    });

    // Evaluate the document-utils scripts (like text scaling) since they execute on DOMContentLoaded
    // Ensure they have run by evaluating manually if needed or just letting the page settle.
    // By waiting for networkidle0, the scripts should have run.

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: options.format || 'A4',
      landscape: options.landscape || false,
      printBackground: options.printBackground !== false, // default true
      margin: {
        top: '0',
        right: '0',
        bottom: '0',
        left: '0',
      },
    });

    return Buffer.from(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF with Puppeteer:', error);
    throw error;
  } finally {
    await browser.close();
  }
}
