require('dotenv').config({ path: '.env.local' });
const nodemailer = require('nodemailer');

async function test() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.ADMIN_EMAIL || 'internxcode@gmail.com',
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  try {
    let info = await transporter.sendMail({
      from: `"CodeInternX Security" <${process.env.ADMIN_EMAIL}>`,
      to: 'internxcode@gmail.com',
      subject: 'CodeInternX Admin - Test Email',
      text: 'This is a test email to verify credentials.',
    });
    console.log("Success! Message ID:", info.messageId);
  } catch (error) {
    console.error("Failed to send:", error.message);
  }
}

test();
