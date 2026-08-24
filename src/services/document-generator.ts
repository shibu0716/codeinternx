import fs from 'fs';
import path from 'path';
import { generateQrCode } from './qr-generator';

export type DocumentType = 'OFFER_LETTER' | 'PERFORMANCE_REPORT' | 'CERTIFICATE' | 'LOR';

interface BaseTemplateData {
  issue_date: string;
  signatory_name: string;
  qr_code?: string;
}

export interface OfferLetterData extends BaseTemplateData {
  student_name: string;
  position: string;
  department: string;
  work_mode: string;
  start_date: string;
  end_date: string;
  responsibilities: string;
  offer_letter_id: string;
}

export interface PerformanceReportData extends BaseTemplateData {
  intern_name: string;
  intern_id: string;
  program_role: string;
  department: string;
  internship_duration: string;
  reporting_manager: string;
  
  technical_skills_rating: string | number;
  technical_skills_comment: string;
  quality_of_work_rating: string | number;
  quality_of_work_comment: string;
  timeliness_rating: string | number;
  timeliness_comment: string;
  teamwork_rating: string | number;
  teamwork_comment: string;
  communication_rating: string | number;
  communication_comment: string;
  initiative_learning_rating: string | number;
  initiative_learning_comment: string;
  professionalism_rating: string | number;
  professionalism_comment: string;
  
  overall_rating: string | number;
  
  strength_1: string;
  strength_2: string;
  strength_3: string;
  improvement_1: string;
  improvement_2: string;
  improvement_3: string;
  manager_comments: string;
  
  performance_report_id: string;
}

export interface CertificateData extends BaseTemplateData {
  student_name: string;
  internship_domain: string;
  company_name: string;
  start_date: string;
  end_date: string;
  certificate_id: string;
}

export interface LorData extends BaseTemplateData {
  student_name: string;
  start_date: string;
  end_date: string;
  lor_id: string;
}

type AnyDocumentData = OfferLetterData | PerformanceReportData | CertificateData | LorData;

const TEMPLATE_MAP = {
  OFFER_LETTER: 'offer-letter/offer-letter.html',
  PERFORMANCE_REPORT: 'performance-report/performance-report.html',
  CERTIFICATE: 'certificate/certificate.html',
  LOR: 'lor/lor.html',
};

/**
 * Generates the HTML string for a given document type by injecting the data into the template.
 */
export async function generateDocumentHtml(
  type: DocumentType,
  data: AnyDocumentData,
  verificationUrlBase: string = 'https://codeinternx.com/verify'
): Promise<string> {
  const rootDir = process.cwd();
  const templatePath = path.join(rootDir, 'documents', TEMPLATE_MAP[type]);
  
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template not found at ${templatePath}`);
  }

  let htmlTemplate = fs.readFileSync(templatePath, 'utf8');
  
  // Generate QR Code if applicable
  let qrCodeUrl = '';
  switch (type) {
    case 'CERTIFICATE':
      qrCodeUrl = `${verificationUrlBase}/certificate/${(data as CertificateData).certificate_id}`;
      break;
    case 'LOR':
      qrCodeUrl = `${verificationUrlBase}/lor/${(data as LorData).lor_id}`;
      break;
    case 'OFFER_LETTER':
      qrCodeUrl = `${verificationUrlBase}/offer/${(data as OfferLetterData).offer_letter_id}`;
      break;
    case 'PERFORMANCE_REPORT':
      qrCodeUrl = `${verificationUrlBase}/report/${(data as PerformanceReportData).performance_report_id}`;
      break;
  }
  
  const qrCodeBase64 = await generateQrCode(qrCodeUrl);
  const templateData = {
    ...data,
    qr_code: qrCodeBase64
  };

  // Replace all placeholders {{key}} with value
  for (const [key, value] of Object.entries(templateData)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    htmlTemplate = htmlTemplate.replace(regex, value !== undefined && value !== null ? String(value) : '');
  }

  // Handle CSS/JS paths in Puppeteer by injecting absolute file paths for local rendering
  // Replace relative paths like "../shared/brand.css" with absolute "file:///.../documents/shared/brand.css"
  const docDir = path.join(rootDir, 'documents');
  htmlTemplate = htmlTemplate.replace(/href="\.\.\/shared\//g, `href="file://${docDir}/shared/`);
  htmlTemplate = htmlTemplate.replace(/src="\.\.\/shared\//g, `src="file://${docDir}/shared/`);
  // Handle local styles
  const currentDocDir = path.dirname(templatePath);
  htmlTemplate = htmlTemplate.replace(/href="([a-zA-Z0-9-]+\.css)"/g, `href="file://${currentDocDir}/$1"`);

  return htmlTemplate;
}
