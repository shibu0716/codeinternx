import fs from 'fs';
import path from 'path';
import { generateQrCode } from './qr-generator';

export type DocumentType = 'OFFER_LETTER' | 'PERFORMANCE_REPORT' | 'CERTIFICATE' | 'LOR';

interface BaseTemplateData {
  issueDate?: string;
  signatoryName?: string;
  signatoryTitle?: string;
  companyPhone?: string;
  companyEmail?: string;
  companyWebsite?: string;
  // Legacy aliases
  issue_date?: string;
  signatory_name?: string;
  qr_code?: string;
}

export interface OfferLetterData extends BaseTemplateData {
  recipientName: string;
  recipientPhone?: string;
  recipientAddress?: string;
  position: string;
  startDate: string;
  endDate?: string;
  employmentStatus?: string;
  compensation?: string;
  domain: string;
  workMode?: string;
  department?: string;
  stipend?: string;
  workingHours?: string;
  supervisor?: string;
  offerLetterId: string;
  // Aliases
  offer_letter_id?: string;
}

export interface PerformanceReportData extends BaseTemplateData {
  recipientName: string;
  position: string;
  domain: string;
  startDate: string;
  endDate: string;
  workMode?: string;
  department?: string;

  technicalSkillsRating?: string;
  technicalSkillsScore?: string | number;
  technicalSkillsRemarks?: string;

  problemSolvingRating?: string;
  problemSolvingScore?: string | number;
  problemSolvingRemarks?: string;

  communicationRating?: string;
  communicationScore?: string | number;
  communicationRemarks?: string;

  teamworkRating?: string;
  teamworkScore?: string | number;
  teamworkRemarks?: string;

  professionalismRating?: string;
  professionalismScore?: string | number;
  professionalismRemarks?: string;

  overallRating?: string;
  overallScore?: string | number;
  attendancePercentage?: string | number;

  achievements?: string;
  projectName?: string;
  projectDescription?: string;
  finalRemarks?: string;

  performanceReportId?: string;
  performance_report_id?: string;

  // Legacy aliases
  intern_name?: string;
  intern_id?: string;
  program_role?: string;
  technical_skills_rating?: string | number;
  technical_skills_comment?: string;
  quality_of_work_rating?: string | number;
  quality_of_work_comment?: string;
  timeliness_rating?: string | number;
  timeliness_comment?: string;
  teamwork_rating?: string | number;
  teamwork_comment?: string;
  communication_rating?: string | number;
  communication_comment?: string;
  initiative_learning_rating?: string | number;
  initiative_learning_comment?: string;
  professionalism_rating?: string | number;
  professionalism_comment?: string;
  overall_rating?: string | number;
  manager_comments?: string;
}

export interface CertificateData extends BaseTemplateData {
  recipientName: string;
  domain: string;
  startDate: string;
  endDate: string;
  certificateId: string;
  // Legacy aliases
  student_name?: string;
  internship_domain?: string;
  company_name?: string;
  start_date?: string;
  end_date?: string;
  certificate_id?: string;
}

export interface LorData extends BaseTemplateData {
  recipientName?: string;
  candidateName?: string;
  position?: string;
  domain?: string;
  startDate?: string;
  endDate?: string;
  lorId?: string;
  documentId?: string;
  // Legacy aliases
  student_name?: string;
}

export type AnyDocumentData = OfferLetterData | PerformanceReportData | CertificateData | LorData;

export const TEMPLATE_MAP = {
  OFFER_LETTER: { svg: 'CodeInternX_Offer_Letter_Master_High_Quality_Proper_Justification.svg', width: 768, height: 1024 },
  PERFORMANCE_REPORT: { svg: 'CodeInternX_Performance_Report_Master_Website_Vector.svg', width: 794, height: 1123 },
  CERTIFICATE: { svg: 'CodeInternX_Internship_Completion_Certificate_Master_Final_With_ID_Signature.svg', width: 842.25, height: 595.5 },
  LOR: { svg: 'CodeInternX_LOR_Master_High_Quality_Justified_Vector_v2.svg', width: 595.5, height: 841.5 },
};

export interface GeneratedDocument {
  html: string;
  width: string;
  height: string;
}

/**
 * Validates dynamic document data to ensure no required field is missing or invalid.
 */
export function validateDocumentData(type: DocumentType, data: AnyDocumentData): void {
  const missing: string[] = [];

  const check = (field: string, val: any) => {
    if (val === undefined || val === null || String(val).trim() === '' || String(val).includes('undefined') || String(val).includes('null')) {
      missing.push(field);
    }
  };

  if (type === 'CERTIFICATE') {
    const d = data as CertificateData;
    check('Candidate Name', d.recipientName || d.student_name);
    check('Domain', d.domain || d.internship_domain);
    check('Start Date', d.startDate || d.start_date);
    check('End Date', d.endDate || d.end_date);
    check('Certificate ID', d.certificateId || d.certificate_id);
    check('Issue Date', d.issueDate || d.issue_date);
  } else if (type === 'OFFER_LETTER') {
    const d = data as OfferLetterData;
    check('Recipient Name', d.recipientName);
    check('Recipient Phone', d.recipientPhone);
    check('Recipient Address', d.recipientAddress);
    check('Position', d.position);
    check('Domain', d.domain);
    check('Department', d.department);
    check('Start Date', d.startDate);
    check('End Date', d.endDate);
    check('Employment Status', d.employmentStatus);
    check('Compensation', d.compensation || d.stipend);
    check('Work Mode', d.workMode);
    check('Offer Letter ID', d.offerLetterId || d.offer_letter_id);
    check('Issue Date', d.issueDate || d.issue_date);
  } else if (type === 'LOR') {
    const d = data as LorData;
    check('Candidate Name', d.candidateName || d.recipientName || d.student_name);
    check('Domain', d.domain);
    check('Document ID', d.documentId || d.lorId);
    check('Issue Date', d.issueDate || d.issue_date);
  } else if (type === 'PERFORMANCE_REPORT') {
    const d = data as PerformanceReportData;
    check('Candidate Name', d.recipientName || d.intern_name);
    check('Position', d.position || d.program_role);
    check('Domain', d.domain || d.department);
    check('Start Date', d.startDate);
    check('End Date', d.endDate);
    check('Report ID', d.performanceReportId || d.performance_report_id);
    check('Issue Date', d.issueDate || d.issue_date);
  }

  if (missing.length > 0) {
    throw new Error(`Cannot generate ${type.replace('_', ' ')}. Missing required fields: ${missing.join(', ')}`);
  }
}

/**
 * Escapes XML special characters safely for SVG text rendering.
 */
function escapeXml(unsafe: string): string {
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generates the HTML string and dimensions for a given document type by injecting validated data into the master vector SVG.
 */
export async function generateDocumentHtml(
  type: DocumentType,
  data: AnyDocumentData,
  verificationUrlBase: string = 'https://codeinternx.com/verify'
): Promise<GeneratedDocument> {
  const rootDir = process.cwd();
  const templateInfo = TEMPLATE_MAP[type];

  // 1. Data Validation
  validateDocumentData(type, data);

  const templatePath = path.join(rootDir, 'public', templateInfo.svg);
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Master SVG template not found at ${templatePath}`);
  }

  let svgTemplate = fs.readFileSync(templatePath, 'utf8');

  // =========================================================================
  // 1. OFFER LETTER MASTER GENERATOR (Exact Master Coordinates & Geometry)
  // =========================================================================
  if (type === 'OFFER_LETTER') {
    const offData = data as OfferLetterData;

    const repName = offData.recipientName || '';
    const repPhone = offData.recipientPhone || '';
    const repAddress = offData.recipientAddress || '';
    const pos = offData.position || '';
    const sDate = offData.startDate || '';
    const eDate = offData.endDate || '';
    const empStatus = offData.employmentStatus || '';
    const comp = offData.compensation || offData.stipend || '';
    const dom = offData.domain || '';
    const dept = offData.department || '';
    const wMode = offData.workMode || '';
    const iDate = offData.issueDate || offData.issue_date || '';
    const offId = offData.offerLetterId || offData.offer_letter_id || '';

    // Replace placeholders directly in master SVG
    svgTemplate = svgTemplate
      .replace(/{recipientName}/g, escapeXml(repName))
      .replace(/{recipientPhone}/g, escapeXml(repPhone))
      .replace(/{recipientAddress}/g, escapeXml(repAddress))
      .replace(/{issueDate}/g, escapeXml(iDate))
      .replace(/{offerLetterId}/g, escapeXml(offId))
      .replace(/{position}/g, escapeXml(pos))
      .replace(/{startDate}/g, escapeXml(sDate))
      .replace(/{endDate}/g, escapeXml(eDate))
      .replace(/{employmentStatus}/g, escapeXml(empStatus))
      .replace(/{compensation}/g, escapeXml(comp))
      .replace(/{domain}/g, escapeXml(dom))
      .replace(/{department}/g, escapeXml(dept))
      .replace(/{workMode}/g, escapeXml(wMode));

    return {
      html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>CodeInternX Master Offer Letter</title>
  <style>
    @page {
      size: ${templateInfo.width}px ${templateInfo.height}px portrait;
      margin: 0;
    }
    html, body {
      margin: 0;
      padding: 0;
      width: ${templateInfo.width}px;
      height: ${templateInfo.height}px;
      overflow: hidden;
      background: white;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    svg {
      display: block;
      width: ${templateInfo.width}px;
      height: ${templateInfo.height}px;
    }
  </style>
</head>
<body>
  ${svgTemplate}
  <script>
    window.onload = () => {
      const margin = 77;
      const pageWidth = ${templateInfo.width};
      const rightMarginX = pageWidth - margin;
      
      document.querySelectorAll('.dynamic, [data-field]').forEach(tspan => {
        const textNode = tspan.closest('text');
        if (!textNode) return;
        
        let fontSize = parseFloat(window.getComputedStyle(textNode).fontSize);
        const anchor = window.getComputedStyle(textNode).textAnchor || 'start';
        
        // Find maximum allowable width
        let currentX = textNode.getBBox().x;
        let maxWidth = rightMarginX - currentX; // default 'start' alignment
        
        if (anchor === 'end') {
          maxWidth = (currentX + textNode.getBBox().width) - margin;
        } else if (anchor === 'middle') {
          const center = currentX + textNode.getBBox().width / 2;
          maxWidth = Math.min(center - margin, rightMarginX - center) * 2;
        }
        
        // Gradually reduce font size if width exceeds maximum
        while (textNode.getBBox().width > maxWidth && fontSize > 5) {
          fontSize -= 0.5;
          textNode.style.fontSize = fontSize + 'px';
        }
      });

      // JUSTIFICATION LOGIC for body paragraphs
      const bodyGroup = document.getElementById('offerLetterBody');
      if (bodyGroup) {
        const svg = document.querySelector('svg');
        const measureText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        measureText.setAttribute('class', 'body');
        measureText.setAttribute('x', '-1000');
        measureText.setAttribute('y', '-1000');
        svg.appendChild(measureText);

        const getWordWidth = (word, isBold) => {
          measureText.innerHTML = '';
          const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
          if (isBold) tspan.setAttribute('class', 'bodyBold');
          tspan.textContent = word === ' ' ? '\u00A0' : word;
          measureText.appendChild(tspan);
          return measureText.getBBox().width;
        };
        
        const spaceWidth = getWordWidth(' ', false);
        const exactMaxWidth = parseFloat(bodyGroup.getAttribute('data-justify-width')) || 612;
        const startX = parseFloat(bodyGroup.getAttribute('data-justify-left')) || 77;
        const lineHeight = 19; // Offer letter standard body line-height

        const bodyTexts = Array.from(bodyGroup.querySelectorAll('text.body'));
        const paragraphs = [];
        let currentParagraph = [];
        let lastY = -100;
        
        bodyTexts.forEach(text => {
          const y = parseFloat(text.getAttribute('y'));
          // Group lines into paragraphs if they are vertically close (less than 1.5x line height)
          if (y - lastY > lineHeight * 1.5) {
            if (currentParagraph.length > 0) paragraphs.push(currentParagraph);
            currentParagraph = [text];
          } else {
            currentParagraph.push(text);
          }
          lastY = y;
        });
        if (currentParagraph.length > 0) paragraphs.push(currentParagraph);

        paragraphs.forEach(lines => {
          const tokens = [];
          lines.forEach(line => {
            Array.from(line.childNodes).forEach(child => {
              let text = '';
              let isBold = false;
              if (child.nodeType === Node.TEXT_NODE) {
                text = child.textContent;
              } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName.toLowerCase() === 'tspan') {
                text = child.textContent;
                isBold = child.classList.contains('bodyBold') || child.style.fontWeight === 'bold';
              }
              if (text) {
                const words = text.split(/\\s+/).filter(w => w.trim().length > 0);
                words.forEach(w => tokens.push({ text: w, isBold: isBold }));
              }
            });
          });

          const firstLine = lines[0];
          const startY = parseFloat(firstLine.getAttribute('y'));
          
          lines.forEach(line => line.parentNode.removeChild(line));
          
          const textBlock = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          textBlock.setAttribute('class', 'body');
          textBlock.setAttribute('x', startX);
          textBlock.setAttribute('y', startY);
          bodyGroup.appendChild(textBlock);
          
          let currentY = startY;
          let currentLineTokens = [];
          let currentLineWidth = 0;
          
          const renderLine = (tokensToRender, y, isLastLine) => {
            let wordsWidth = 0;
            tokensToRender.forEach(t => wordsWidth += t.width);
            
            let wordSpacing = spaceWidth;
            const naturalWidth = wordsWidth + (tokensToRender.length - 1) * spaceWidth;
            const forceJustify = isLastLine && naturalWidth > exactMaxWidth * 0.85;

            if ((!isLastLine || forceJustify) && tokensToRender.length > 1) {
              const extraSpace = exactMaxWidth - wordsWidth;
              wordSpacing = extraSpace / (tokensToRender.length - 1);
            }
            
            let currentX = startX;
            tokensToRender.forEach(t => {
              const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
              if (t.isBold) tspan.setAttribute('class', 'bodyBold');
              tspan.setAttribute('x', currentX);
              tspan.setAttribute('y', y);
              tspan.textContent = t.text;
              textBlock.appendChild(tspan);
              currentX += t.width + wordSpacing;
            });
          };
          
          tokens.forEach((t) => {
            t.width = getWordWidth(t.text, t.isBold);
            const nextWidth = currentLineWidth + t.width + (currentLineTokens.length > 0 ? spaceWidth : 0);
            
            if (nextWidth > exactMaxWidth && currentLineTokens.length > 0) {
              renderLine(currentLineTokens, currentY, false);
              currentLineTokens = [t];
              currentLineWidth = t.width;
              currentY += lineHeight;
            } else {
              currentLineTokens.push(t);
              currentLineWidth += t.width + (currentLineTokens.length > 1 ? spaceWidth : 0);
            }
          });
          
          if (currentLineTokens.length > 0) {
            renderLine(currentLineTokens, currentY, true);
          }
        });
        
        measureText.parentNode.removeChild(measureText);
      }
    };
  </script>
</body>
</html>`,
      width: `${templateInfo.width}px`,
      height: `${templateInfo.height}px`
    };
  }

  // =========================================================================
  // 2. LETTER OF RECOMMENDATION (LOR) MASTER GENERATOR
  // =========================================================================
  if (type === 'LOR') {
    const lorData = data as LorData;

    const repName = lorData.recipientName || 'Whom It May Concern';
    const candName = lorData.candidateName || lorData.recipientName || lorData.student_name || 'Hannah Morales';
    const pos = lorData.position || 'Full Stack Development Intern';
    const dom = lorData.domain || 'Full Stack Web Development';
    const iDate = lorData.issueDate || lorData.issue_date || '01 September 2026';
    const docId = lorData.documentId || lorData.lorId || 'CIX-LOR-2026-000001';

    // Direct replacement of placeholders inside master SVG preserving 100% master geometry
    svgTemplate = svgTemplate
      .replace(/\{\{candidateName\}\}/g, escapeXml(candName))
      .replace(/\{\{position\}\}/g, escapeXml(pos))
      .replace(/\{\{domain\}\}/g, escapeXml(dom))
      .replace(/{issueDate}/g, escapeXml(iDate))
      .replace(/{documentId}/g, escapeXml(docId));

    return {
      html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>CodeInternX Master Letter of Recommendation</title>
  <style>
    @page {
      size: ${templateInfo.width}px ${templateInfo.height}px portrait;
      margin: 0;
    }
    html, body {
      margin: 0;
      padding: 0;
      width: ${templateInfo.width}px;
      height: ${templateInfo.height}px;
      overflow: hidden;
      background: white;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    svg {
      display: block;
      width: ${templateInfo.width}px;
      height: ${templateInfo.height}px;
    }
  </style>
</head>
<body>
  ${svgTemplate}
  <script>
    window.onload = () => {
      const margin = 70;
      const pageWidth = ${templateInfo.width};
      const rightMarginX = pageWidth - margin;
      const maxWidth = rightMarginX - margin;
      const lineHeight = 16;
      
      const svg = document.querySelector('svg');
      const measureText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      measureText.setAttribute('class', 'body');
      measureText.setAttribute('x', '-1000');
      measureText.setAttribute('y', '-1000');
      svg.appendChild(measureText);

      const getWordWidth = (word, isBold) => {
        measureText.innerHTML = '';
        const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        if (isBold) tspan.setAttribute('class', 'bodyBold');
        tspan.textContent = word === ' ' ? '\u00A0' : word;
        measureText.appendChild(tspan);
        return measureText.getBBox().width;
      };
      
      const spaceWidth = getWordWidth(' ', false);

      // Group text lines into paragraphs based on Y coordinate
      const bodyTexts = Array.from(document.querySelectorAll('text.body'));
      const paragraphs = [];
      let currentParagraph = [];
      let lastY = -100;
      
      bodyTexts.forEach(text => {
        const y = parseFloat(text.getAttribute('y'));
        if (y - lastY > 24) {
          if (currentParagraph.length > 0) paragraphs.push(currentParagraph);
          currentParagraph = [text];
        } else {
          currentParagraph.push(text);
        }
        lastY = y;
      });
      if (currentParagraph.length > 0) paragraphs.push(currentParagraph);

      let maxRightEdge = rightMarginX;
      let foundStaticLine = false;
      bodyTexts.forEach(text => {
        if (!text.querySelector('.dynamic, .bodyBold, [data-field]')) {
          const rightEdge = text.getBBox().x + text.getBBox().width;
          if (!foundStaticLine || rightEdge > maxRightEdge) {
            maxRightEdge = rightEdge;
            foundStaticLine = true;
          }
        }
      });
      // Fallback in case no purely static lines existed
      if (!foundStaticLine) {
        bodyTexts.forEach(text => {
          const rightEdge = text.getBBox().x + text.getBBox().width;
          if (rightEdge > maxRightEdge) maxRightEdge = rightEdge;
        });
      }

      let globalShiftY = 0;

      paragraphs.forEach(lines => {
        const tokens = [];
        lines.forEach(line => {
          Array.from(line.childNodes).forEach(child => {
            let text = '';
            let isBold = false;
            if (child.nodeType === Node.TEXT_NODE) {
              text = child.textContent;
            } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName.toLowerCase() === 'tspan') {
              text = child.textContent;
              isBold = child.classList.contains('bodyBold');
            }
            if (text) {
              const words = text.split(/\\s+/).filter(w => w.trim().length > 0);
              words.forEach(w => tokens.push({ text: w, isBold: isBold }));
            }
          });
        });

        const firstLine = lines[0];
        const startX = parseFloat(firstLine.getAttribute('x'));
        const originalStartY = parseFloat(firstLine.getAttribute('y'));
        const actualStartY = originalStartY + globalShiftY;
        
        // Use exact layout width derived from the master SVG's true right edge
        const exactMaxWidth = maxRightEdge - startX;
        
        const parentNode = firstLine.parentNode;
        lines.forEach(line => parentNode.removeChild(line));
        
        const textBlock = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textBlock.setAttribute('class', 'body');
        textBlock.setAttribute('x', startX);
        textBlock.setAttribute('y', actualStartY);
        parentNode.appendChild(textBlock);
        
        let currentY = actualStartY;
        let currentLineTokens = [];
        let currentLineWidth = 0;
        
        const renderLine = (tokensToRender, y, isLastLine) => {
          let wordsWidth = 0;
          tokensToRender.forEach(t => wordsWidth += t.width);
          
          let wordSpacing = spaceWidth;
          if (!isLastLine && tokensToRender.length > 1) {
            const extraSpace = exactMaxWidth - wordsWidth;
            wordSpacing = extraSpace / (tokensToRender.length - 1);
          }
          
          let currentX = startX;
          tokensToRender.forEach(t => {
            const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
            if (t.isBold) tspan.setAttribute('class', 'bodyBold');
            tspan.setAttribute('x', currentX);
            tspan.setAttribute('y', y);
            tspan.textContent = t.text;
            textBlock.appendChild(tspan);
            currentX += t.width + wordSpacing;
          });
        };
        
        tokens.forEach((t) => {
          t.width = getWordWidth(t.text, t.isBold);
          const nextWidth = currentLineWidth + t.width + (currentLineTokens.length > 0 ? spaceWidth : 0);
          
          if (nextWidth > exactMaxWidth && currentLineTokens.length > 0) {
            renderLine(currentLineTokens, currentY, false);
            currentLineTokens = [t];
            currentLineWidth = t.width;
            currentY += lineHeight;
          } else {
            currentLineTokens.push(t);
            currentLineWidth += t.width + (currentLineTokens.length > 1 ? spaceWidth : 0);
          }
        });
        
        if (currentLineTokens.length > 0) {
          renderLine(currentLineTokens, currentY, true);
        }

        const originalFinalY = parseFloat(lines[lines.length - 1].getAttribute('y'));
        const newShift = currentY - (originalFinalY + globalShiftY);
        if (newShift > 0) {
          globalShiftY += newShift;
        }
      });
      
      // Shift all static text that was originally below the body paragraphs
      if (globalShiftY > 0 && paragraphs.length > 0) {
        const lastOriginalY = parseFloat(paragraphs[paragraphs.length - 1][paragraphs[paragraphs.length - 1].length - 1].getAttribute('y'));
        
        document.querySelectorAll('text').forEach(t => {
          if (t.classList.contains('body')) return;
          const y = parseFloat(t.getAttribute('y'));
          if (y > lastOriginalY) {
            t.setAttribute('y', y + globalShiftY);
            
            // Also move any <tspan> inside this text if they have explicit 'y'
            t.querySelectorAll('tspan').forEach(tspan => {
              if (tspan.hasAttribute('y')) {
                tspan.setAttribute('y', parseFloat(tspan.getAttribute('y')) + globalShiftY);
              }
            });
          }
        });
      }
      
      measureText.parentNode.removeChild(measureText);
      
      // Also adjust signatory and metadata to shift down if the document grew too much
      // (Optional: Admin warning if total height exceeds page)
    };
  </script>
</body>
</html>`,
      width: `${templateInfo.width}px`,
      height: `${templateInfo.height}px`
    };
  }

  // =========================================================================
  // 3. PERFORMANCE REPORT MASTER GENERATOR
  // =========================================================================
  if (type === 'PERFORMANCE_REPORT') {
    const repData = data as PerformanceReportData;

    const repName = repData.recipientName || repData.intern_name || '';
    const pos = repData.position || repData.program_role || 'Intern';
    const dom = repData.domain || repData.department || 'Web Development';
    const sDate = repData.startDate || '';
    const eDate = repData.endDate || '';
    const validateRemarks = (remarks: string) => {
      if (!remarks) return;
      const words = remarks.trim().split(/\s+/);
      if (words.length !== 2) {
        throw new Error('Please use exactly 2 words for table remarks.');
      }
    };

    const wMode = repData.workMode || 'Remote';

    const techRating = repData.technicalSkillsRating || 'Excellent';
    const techScore = repData.technicalSkillsScore !== undefined ? String(repData.technicalSkillsScore) : (repData.technical_skills_rating ? String(repData.technical_skills_rating) : '4.8/5');
    const techRemarks = repData.technicalSkillsRemarks || repData.technical_skills_comment || 'Excellent Skills';
    validateRemarks(techRemarks);

    const probRating = repData.problemSolvingRating || 'Excellent';
    const probScore = repData.problemSolvingScore !== undefined ? String(repData.problemSolvingScore) : '4.7/5';
    const probRemarks = repData.problemSolvingRemarks || 'Strong Solver';
    validateRemarks(probRemarks);

    const commRating = repData.communicationRating || 'Very Good';
    const commScore = repData.communicationScore !== undefined ? String(repData.communicationScore) : (repData.communication_rating ? String(repData.communication_rating) : '4.5/5');
    const commRemarks = repData.communicationRemarks || repData.communication_comment || 'Clear Communicator';
    validateRemarks(commRemarks);

    const teamRating = repData.teamworkRating || 'Excellent';
    const teamScore = repData.teamworkScore !== undefined ? String(repData.teamworkScore) : (repData.teamwork_rating ? String(repData.teamwork_rating) : '4.8/5');
    const teamRemarks = repData.teamworkRemarks || repData.teamwork_comment || 'Excellent Teamwork';
    validateRemarks(teamRemarks);

    const profRating = repData.professionalismRating || 'Excellent';
    const profScore = repData.professionalismScore !== undefined ? String(repData.professionalismScore) : (repData.professionalism_rating ? String(repData.professionalism_rating) : '4.9/5');
    const profRemarks = repData.professionalismRemarks || repData.professionalism_comment || 'Highly Professional';
    validateRemarks(profRemarks);

    const ovRating = repData.overallRating || (repData.overall_rating ? 'Excellent' : 'Excellent');
    const ovScore = repData.overallScore !== undefined ? String(repData.overallScore).replace(/\s*\/\s*5/g, '') : (repData.overall_rating ? String(repData.overall_rating).replace(/\s*\/\s*5/g, '') : '4.7');
    const attPct = repData.attendancePercentage !== undefined ? String(repData.attendancePercentage).replace(/%/g, '') : '96';

    const ach = repData.achievements || 'Successfully completed assigned development tasks and contributed to project implementation.';
    const projName = repData.projectName || `${dom} Platform`;
    const fRemarks = repData.finalRemarks || repData.manager_comments || `${repName} demonstrated excellent technical ability, professionalism, and willingness to learn throughout the internship.`;

    const iDate = repData.issueDate || repData.issue_date || '';
    const reportId = repData.performanceReportId || repData.performance_report_id || '';
    const sigName = repData.signatoryName || repData.signatory_name || 'Shani Bharadwaj';
    const sigTitle = repData.signatoryTitle || 'Co-Founder';

    // Replace period lines with unified <tspan> to prevent date overlap
    const datePeriodReplacement = `<text x="412" y="260" font-family="Arial, Helvetica, sans-serif" font-size="13.5" fill="#111111"><tspan font-weight="700">${escapeXml(sDate)}</tspan><tspan font-weight="400" font-size="12" fill="#555555"> to </tspan><tspan font-weight="700">${escapeXml(eDate)}</tspan></text>`;
    svgTemplate = svgTemplate.replace(
      /<text x="412" y="260"[\s\S]*?<text x="520" y="260"[\s\S]*?<\/text>/i,
      datePeriodReplacement
    );

    // Replace intro line with unified <tspan> so text flows after candidate name
    const introReplacement = `<text x="44" y="400" font-family="Arial, Helvetica, sans-serif" font-size="12.5" fill="#222222"><tspan font-weight="700" fill="#111111">${escapeXml(repName)}</tspan><tspan fill="#333333"> during the internship with CodeInternX.</tspan></text>`;
    svgTemplate = svgTemplate.replace(
      /<text x="44" y="400"[\s\S]*?<text x="195" y="400"[\s\S]*?<\/text>/i,
      introReplacement
    );

    const fieldReplacements: Record<string, string> = {
      recipientName: escapeXml(repName),
      position: escapeXml(pos),
      domain: escapeXml(dom),
      startDate: escapeXml(sDate),
      endDate: escapeXml(eDate),
      workMode: escapeXml(wMode),
      technicalRating: escapeXml(techRating),
      technicalScore: escapeXml(techScore),
      technicalRemarks: escapeXml(techRemarks),
      problemSolvingRating: escapeXml(probRating),
      problemSolvingScore: escapeXml(probScore),
      problemSolvingRemarks: escapeXml(probRemarks),
      communicationRating: escapeXml(commRating),
      communicationScore: escapeXml(commScore),
      communicationRemarks: escapeXml(commRemarks),
      teamworkRating: escapeXml(teamRating),
      teamworkScore: escapeXml(teamScore),
      teamworkRemarks: escapeXml(teamRemarks),
      professionalismRating: escapeXml(profRating),
      professionalismScore: escapeXml(profScore),
      professionalismRemarks: escapeXml(profRemarks),
      overallRating: escapeXml(ovRating),
      overallScore: escapeXml(ovScore),
      attendancePercentage: escapeXml(attPct),
      achievements: escapeXml(ach),
      projectName: escapeXml(projName),
      finalRemarks: escapeXml(fRemarks),
      issueDate: escapeXml(iDate),
      performanceReportId: escapeXml(reportId),
      signatoryName: escapeXml(sigName),
      signatoryTitle: escapeXml(sigTitle),
    };

    for (const [field, val] of Object.entries(fieldReplacements)) {
      const tagRegex = new RegExp(`(<(?:text|tspan)[^>]*?data-field="${field}"[^>]*?>)[\\s\\S]*?(<\\/(?:text|tspan)>)`, 'gi');
      svgTemplate = svgTemplate.replace(tagRegex, `$1${val}$2`);
      svgTemplate = svgTemplate.replace(new RegExp(`{${field}}`, 'g'), val);
    }

    return {
      html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>CodeInternX Master Performance Report</title>
  <style>
    @page {
      size: 794px 1123px portrait;
      margin: 0;
    }
    html, body {
      margin: 0;
      padding: 0;
      width: 794px;
      height: 1123px;
      overflow: hidden;
      background: white;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    svg {
      display: block;
      width: 794px;
      height: 1123px;
    }
  </style>
</head>
<body>
  ${svgTemplate}
  <script>
    window.onload = () => {
      const wrapText = (textNode, maxWidth, maxLines, lineHeight) => {
        if (!textNode) return;
        const text = textNode.textContent || '';
        if (textNode.getBBox().width <= maxWidth) return; 

        const words = text.split(' ');
        const x = textNode.getAttribute('x');
        const y = parseFloat(textNode.getAttribute('y') || 0);
        textNode.textContent = '';
        
        let line = '';
        let currentY = y;
        let tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        tspan.setAttribute('x', x);
        tspan.setAttribute('y', currentY);
        textNode.appendChild(tspan);
        
        let lineCount = 1;
        for (let n = 0; n < words.length; n++) {
          let testLine = line + words[n] + ' ';
          tspan.textContent = testLine;
          if (tspan.getComputedTextLength() > maxWidth && n > 0) {
            tspan.textContent = line;
            lineCount++;
            if (lineCount > maxLines) {
              tspan.textContent = line.trim() + '...';
              break;
            }
            line = words[n] + ' ';
            currentY += lineHeight;
            tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
            tspan.setAttribute('x', x);
            tspan.setAttribute('y', currentY);
            tspan.textContent = line;
            textNode.appendChild(tspan);
          } else {
            line = testLine;
          }
        }
      };

      const finalRemarksNode = document.querySelector('text[data-field="finalRemarks"]');
      if (finalRemarksNode) wrapText(finalRemarksNode, 600, 3, 18);

      const achievementsNode = document.querySelector('text[data-field="achievements"]');
      if (achievementsNode) wrapText(achievementsNode, 680, 2, 14);
    };
  </script>
</body>
</html>`,
      width: `${templateInfo.width}px`,
      height: `${templateInfo.height}px`
    };
  }

  // =========================================================================
  // 4. CERTIFICATE MASTER GENERATOR
  // =========================================================================
  if (type === 'CERTIFICATE') {
    const certData = data as CertificateData;

    const certId = certData.certificateId || certData.certificate_id || '';
    const recName = certData.recipientName || certData.student_name || '';
    const dom = certData.domain || certData.internship_domain || '';
    const sDate = certData.startDate || certData.start_date || '';
    const eDate = certData.endDate || certData.end_date || '';
    const iDate = certData.issueDate || certData.issue_date || '';
    const sigName = certData.signatoryName || certData.signatory_name || 'Shani Bharadwaj';
    const sigTitle = certData.signatoryTitle || 'Co-Founder';

    // Generate candidate-specific QR code for verification URL
    const qrUrl = `${verificationUrlBase}/certificate/${certId}`;
    const qrDataUrl = await generateQrCode(qrUrl);

    // Replace the QR image in verificationQr group
    svgTemplate = svgTemplate.replace(
      /(<g[^>]*id="verificationQr"[^>]*>[\s\S]*?<image[^>]*?(?:xlink:)?href=")([^"]*)(")/i,
      `$1${qrDataUrl}$3`
    );

    // Replace all placeholders inside the master SVG clone
    svgTemplate = svgTemplate
      .replace(/{recipientName}/g, escapeXml(recName))
      .replace(/{domain}/g, escapeXml(dom))
      .replace(/{startDate}/g, escapeXml(sDate))
      .replace(/{endDate}/g, escapeXml(eDate))
      .replace(/{issueDate}/g, escapeXml(iDate))
      .replace(/{certificateId}/g, escapeXml(certId))
      .replace(/{signatoryName}/g, escapeXml(sigName))
      .replace(/{signatoryTitle}/g, escapeXml(sigTitle));

    return {
      html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>CodeInternX Master Internship Completion Certificate</title>
  <style>
    @page {
      size: 842.25px 595.5px landscape;
      margin: 0;
    }
    html, body {
      margin: 0;
      padding: 0;
      width: 842.25px;
      height: 595.5px;
      overflow: hidden;
      background: white;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    svg {
      display: block;
      width: 842.25px;
      height: 595.5px;
    }
  </style>
</head>
<body>
  ${svgTemplate}
</body>
</html>`,
      width: `${templateInfo.width}px`,
      height: `${templateInfo.height}px`
    };
  }

  throw new Error(`Unsupported document type: ${type}`);
}
