"use server";

import nodemailer from "nodemailer";

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const subject = formData.get("subject");
  const message = formData.get("message");

  // Basic validation
  if (!name || !email || !message) {
    return { error: "Name, email, and message are required." };
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "internxcode@gmail.com",
        pass: process.env.GMAIL_APP_PASSWORD, // Must be set in .env.local
      },
    });

    await transporter.sendMail({
      from: `"CodeInternX Support" <internxcode@gmail.com>`,
      to: "internxcode@gmail.com", // Sending to yourself to receive the details
      replyTo: email as string, // Reply to the student who filled the form
      subject: `New Support Request: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr/>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${message}</p>
      `,
    });

    console.log("Form submission received and emailed:", { name, email, subject });

    return { success: true, message: "Thank you! Your message has been sent to our support team. We'll get back to you shortly." };
  } catch (error) {
    console.error("Failed to send message via NodeMailer:", error);
    return { error: "Failed to send message. Please make sure the email system is configured properly." };
  }
}
