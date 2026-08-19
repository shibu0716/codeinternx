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
