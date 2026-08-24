"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfileSettings(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const isPublic = formData.get("is_public") === "true";
  const githubUrl = formData.get("github_url")?.toString() || null;
  const linkedinUrl = formData.get("linkedin_url")?.toString() || null;

  const { error } = await supabase
    .from("profiles")
    .update({
      is_public: isPublic,
      github_url: githubUrl,
      linkedin_url: linkedinUrl,
      updated_at: new Date().toISOString()
    })
    .eq("id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/settings");
  revalidatePath(`/p/${user.id}`);
  return { success: true };
}

export async function acceptOfferLetter(applicationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Verify the application belongs to the user and is APPROVED
  const { data: app, error: appError } = await supabase
    .from("applications")
    .select("*")
    .eq("id", applicationId)
    .eq("student_id", user.id)
    .single();

  if (appError || !app) {
    throw new Error("Application not found");
  }

  if (app.status !== 'APPROVED') {
    throw new Error("Application is not in a state to be accepted.");
  }

  // Update application status to ENROLLED
  const { error: updateError } = await supabase
    .from("applications")
    .update({ status: "ENROLLED" })
    .eq("id", applicationId);

  if (updateError) {
    throw new Error("Failed to accept offer letter.");
  }

  // Also check if there's an internship_documents record and update its status
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id")
    .eq("application_id", applicationId)
    .single();

  if (enrollment) {
    await supabase
      .from("internship_documents")
      .update({ status: "ACCEPTED" })
      .eq("enrollment_id", enrollment.id)
      .eq("type", "OFFER_LETTER");
  }

  revalidatePath("/dashboard/applications");
  revalidatePath("/dashboard/offer-letter");
  revalidatePath("/dashboard/internships");
  revalidatePath("/dashboard/tasks");
  return { success: true };
}
