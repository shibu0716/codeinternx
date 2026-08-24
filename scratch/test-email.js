require('dotenv').config({ path: '.env.local' });
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ADMIN_EMAIL || 'internxcode@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

async function run() {
  try {
    console.log('Using Email:', process.env.ADMIN_EMAIL);
    console.log('Using Password:', process.env.GMAIL_APP_PASSWORD);
    
    // Verify connection configuration
    await transporter.verify();
    console.log('Server is ready to take our messages');

    // Optionally send a test email to the same address
    const info = await transporter.sendMail({
      from: `"CodeInternX Security" <${process.env.ADMIN_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      subject: 'Test Email from Node',
      text: 'This is a test email to verify nodemailer configuration.',
    });
    console.log('Test email sent: ' + info.response);
  } catch (error) {
    console.error('Error during email test:', error);
  }
}

run();
