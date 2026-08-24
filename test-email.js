const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

async function test() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.ADMIN_EMAIL,
      to: 'shibu95085@gmail.com',
      subject: 'Test Email',
      text: 'This is a test email to verify credentials.',
    });
    console.log('Success!', info.response);
  } catch (error) {
    console.error('Failed!', error);
  }
}
test();
