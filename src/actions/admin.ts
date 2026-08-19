"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function issueOfferLetter(applicationId: string) {
  const supabase = await createClient();

  // 1. Verify admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "SUPER_ADMIN" && profile?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  // 2. Fetch the application
  const { data: app, error: appError } = await supabase
    .from("applications")
    .select("*")
    .eq("id", applicationId)
    .single();

  if (appError || !app) {
    throw new Error("Application not found");
  }

  // 3. Create the enrollment
  const { error: enrollError } = await supabase
    .from("enrollments")
    .insert({
      student_id: app.student_id,
      program_id: app.internship_id,
      application_id: app.id,
      payment_status: "PAID",
      enrolled_at: new Date().toISOString()
    });

  if (enrollError) {
    throw new Error(`Failed to create enrollment: ${enrollError.message}`);
  }

  // 4. Update the application status to ENROLLED
  const { error: updateError } = await supabase
    .from("applications")
    .update({ status: "ENROLLED" })
    .eq("id", applicationId);

  if (updateError) {
    throw new Error("Failed to update application status");
  }

  revalidatePath("/admin/applications");
  return { success: true };
}

export async function issueCertificate(studentId: string, programId: string, enrollmentId: string) {
  const supabase = await createClient();

  // 1. Verify admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "SUPER_ADMIN" && profile?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  // Generate unique certificate ID
  const certId = `CI-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  // 2. Insert Certificate
  const { error } = await supabase
    .from("certificates")
    .insert({
      certificate_id: certId,
      student_id: studentId,
      program_id: programId,
      enrollment_id: enrollmentId,
      issue_date: new Date().toISOString()
    });

  if (error) {
    if (error.code === '23505') {
       throw new Error("A certificate has already been issued for this enrollment.");
    }
    throw new Error(`Failed to issue certificate: ${error.message}`);
  }

  // Update enrollment to is_completed
  await supabase
    .from("enrollments")
    .update({ is_completed: true, completed_at: new Date().toISOString() })
    .eq("id", enrollmentId);

  revalidatePath("/admin/certificates");
  return { success: true, certificateId: certId };
}

export async function initiateRefund(paymentId: string) {
  const supabase = await createClient();

  // 1. Verify admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "SUPER_ADMIN") {
    throw new Error("Only SUPER_ADMIN can initiate refunds");
  }

  // 2. Fetch Payment
  const { data: payment, error: payError } = await supabase
    .from("payments")
    .select("*")
    .eq("id", paymentId)
    .single();

  if (payError || !payment) {
    throw new Error("Payment not found");
  }

  if (payment.status === "REFUNDED") {
    throw new Error("Payment is already refunded");
  }

  // NOTE: In a real production system, we would integrate the Razorpay Node SDK here:
  // const instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_SECRET });
  // await instance.payments.refund(payment.razorpay_payment_id, { amount: payment.amount * 100 });
  // For now, we simulate the refund by updating the database.

  // 3. Update Payment Status
  const { error: updateError } = await supabase
    .from("payments")
    .update({ status: "REFUNDED" })
    .eq("id", paymentId);

  if (updateError) {
    throw new Error("Failed to update payment status");
  }

  // Update Order Status too
  if (payment.order_id) {
    await supabase
      .from("orders")
      .update({ status: "REFUNDED" })
      .eq("id", payment.order_id);
  }

  revalidatePath("/admin/payments");
  return { success: true };
}

export async function saveProgram(programData: any, programId?: string) {
  const supabase = await createClient();

  // 1. Verify admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "SUPER_ADMIN" && profile?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  if (programId) {
    // Update
    const { error } = await supabase
      .from("programs")
      .update(programData)
      .eq("id", programId);
    
    if (error) throw new Error(`Failed to update program: ${error.message}`);
  } else {
    // Insert
    const { error } = await supabase
      .from("programs")
      .insert(programData);

    if (error) throw new Error(`Failed to create program: ${error.message}`);
  }

  revalidatePath("/admin/programs");
  return { success: true };
}

export async function deleteProgram(programId: string) {
  const supabase = await createClient();

  // 1. Verify admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "SUPER_ADMIN") {
    throw new Error("Only SUPER_ADMIN can delete programs");
  }

  const { error } = await supabase
    .from("programs")
    .delete()
    .eq("id", programId);

  if (error) {
    throw new Error(`Failed to delete program: ${error.message}`);
  }

  revalidatePath("/admin/programs");
  return { success: true };
}

export async function importApplications(csvData: any[]) {
  const supabase = await createClient();

  // 1. Verify admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "SUPER_ADMIN" && profile?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  let successCount = 0;
  let failedCount = 0;
  const errors: string[] = [];

  for (const row of csvData) {
    const email = row["Email"] || row["email"] || row["Email Address"];
    const programTitle = row["Program Title"] || row["program"] || row["Program"];

    if (!email || !programTitle) {
      failedCount++;
      errors.push(`Row missing email or program title: ${JSON.stringify(row)}`);
      continue;
    }

    // Find student profile by email
    const { data: studentProfile } = await supabase
      .from("profiles")
      .select("id")
      .ilike("email", email.trim())
      .single();

    if (!studentProfile) {
      failedCount++;
      errors.push(`Student with email ${email} has not signed up on the platform yet.`);
      continue;
    }

    // Find program by title
    const { data: program } = await supabase
      .from("programs")
      .select("id")
      .ilike("title", programTitle.trim())
      .single();

    if (!program) {
      failedCount++;
      errors.push(`Program "${programTitle}" not found in database.`);
      continue;
    }

    // Insert Application
    const appId = `CI-APP-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const { error: insertError } = await supabase
      .from("applications")
      .insert({
        application_id: appId,
        student_id: studentProfile.id,
        program_id: program.id,
        source: 'GOOGLE_FORM',
        status: 'PENDING'
      });

    if (insertError) {
      failedCount++;
      if (insertError.code === '23505') {
        errors.push(`${email} has already applied to "${programTitle}".`);
      } else {
        errors.push(`Failed to insert application for ${email}: ${insertError.message}`);
      }
    } else {
      successCount++;
    }
  }

  revalidatePath("/admin/applications");
  return { success: successCount, failed: failedCount, errors };
}

export async function updateUserRole(targetUserId: string, newRole: string) {
  const supabase = await createClient();

  // 1. Verify admin is SUPER_ADMIN
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "SUPER_ADMIN") {
    throw new Error("Only SUPER_ADMIN can change user roles");
  }

  const allowedRoles = ["STUDENT", "EVALUATOR", "ADMIN"];
  if (!allowedRoles.includes(newRole)) {
    throw new Error("Invalid role specified");
  }

  const { error } = await supabase
    .from("profiles")
    .update({ role: newRole as any })
    .eq("id", targetUserId);

  if (error) {
    throw new Error(`Failed to update role: ${error.message}`);
  }

  revalidatePath("/admin/users");
  return { success: true };
}

export async function performGlobalSearch(query: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "SUPER_ADMIN" && profile?.role !== "ADMIN") return [];

  const safeQuery = `%${query.trim()}%`;
  const results: any[] = [];

  // Search profiles (Email, Name)
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .or(`full_name.ilike.${safeQuery},email.ilike.${safeQuery}`)
    .limit(5);

  if (profiles) {
    profiles.forEach(p => results.push({
      type: 'USER',
      title: p.full_name,
      subtitle: p.email,
      url: `/admin/users` // In a real app we'd link to user profile
    }));
  }

  // Search applications
  const { data: applications } = await supabase
    .from("applications")
    .select("id, application_id")
    .ilike("application_id", safeQuery)
    .limit(3);

  if (applications) {
    applications.forEach(a => results.push({
      type: 'APPLICATION',
      title: a.application_id,
      subtitle: "Student Application",
      url: `/admin/applications`
    }));
  }

  // Search Orders
  const { data: orders } = await supabase
    .from("orders")
    .select("id, razorpay_order_id, amount")
    .ilike("razorpay_order_id", safeQuery)
    .limit(3);

  if (orders) {
    orders.forEach(o => results.push({
      type: 'ORDER',
      title: o.razorpay_order_id,
      subtitle: `Amount: ₹${o.amount}`,
      url: `/admin/orders`
    }));
  }

  // Search Payments
  const { data: payments } = await supabase
    .from("payments")
    .select("id, razorpay_payment_id, amount")
    .ilike("razorpay_payment_id", safeQuery)
    .limit(3);

  if (payments) {
    payments.forEach(p => results.push({
      type: 'PAYMENT',
      title: p.razorpay_payment_id,
      subtitle: `Amount: ₹${p.amount}`,
      url: `/admin/payments`
    }));
  }

  // Search Certificates
  const { data: certs } = await supabase
    .from("certificates")
    .select("id, certificate_id")
    .ilike("certificate_id", safeQuery)
    .limit(3);

  if (certs) {
    certs.forEach(c => results.push({
      type: 'CERTIFICATE',
      title: c.certificate_id,
      subtitle: "Issued Certificate",
      url: `/admin/certificates`
    }));
  }

  return results;
}
