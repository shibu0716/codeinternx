"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function gradeSubmission(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Verify Role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !["EVALUATOR", "ADMIN", "SUPER_ADMIN"].includes(profile.role)) {
    throw new Error("Forbidden");
  }

  const submissionId = formData.get("submissionId") as string;
  const score = parseInt(formData.get("score") as string, 10);
  const feedback = formData.get("feedback") as string;
  const status = formData.get("status") as string;

  if (!submissionId || isNaN(score) || !feedback || !status) {
    throw new Error("Missing required fields");
  }

  // 1. Insert/Update Evaluation
  const { error: evalError } = await supabase
    .from("evaluations")
    .upsert({
      submission_id: submissionId,
      evaluator_id: user.id,
      overall_score: score,
      feedback: feedback
    }, { onConflict: "submission_id" });

  if (evalError) {
    console.error("Evaluation Error:", evalError);
    throw new Error("Failed to save evaluation");
  }

  // 2. Update Submission Status
  const { error: subError } = await supabase
    .from("submissions")
    .update({ status: status })
    .eq("id", submissionId);

  if (subError) {
    console.error("Submission Update Error:", subError);
    throw new Error("Failed to update submission status");
  }

  // Note: Depending on the task status, we might need to check if all tasks in the program are completed
  // to auto-generate a certificate. For simplicity in this iteration, we focus on the grading loop.

  revalidatePath("/evaluator/queue");
  revalidatePath("/evaluator");
  redirect("/evaluator/queue");
}
