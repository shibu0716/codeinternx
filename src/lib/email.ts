import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ADMIN_EMAIL || 'internxcode@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendAdminOTPEmail(email: string, otp: string) {
  try {
    await transporter.sendMail({
      from: `"CodeInternX Security" <${process.env.ADMIN_EMAIL || 'internxcode@gmail.com'}>`,
      to: email,
      subject: 'CodeInternX Admin - Security Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
          <h2 style="color: #0f172a; text-align: center;">Admin Verification Required</h2>
          <p style="color: #475569; font-size: 16px;">Hello Admin,</p>
          <p style="color: #475569; font-size: 16px;">A login attempt was made to the CodeInternX Admin Dashboard. Please use the following One-Time Password (OTP) to complete your login. This code will expire in 10 minutes.</p>
          
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; text-align: center; border-radius: 8px; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2563eb;">${otp}</span>
          </div>
          
          <p style="color: #64748b; font-size: 14px;">If you did not attempt to log in, please ignore this email or secure your account.</p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return { success: false, error };
  }
}
