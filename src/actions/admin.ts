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
