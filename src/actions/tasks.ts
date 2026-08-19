"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function submitTask(taskId: string, formData: FormData) {
  const supabase = await createClient();
  
  // Verify user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const githubUrl = formData.get("githubUrl") as string;
  const liveUrl = formData.get("liveUrl") as string;
  const notes = formData.get("notes") as string;

  // Insert submission into database
  const { error } = await supabase
    .from("submissions")
    .upsert({
      task_id: taskId,
      student_id: user.id,
      github_url: githubUrl,
      live_url: liveUrl,
      notes: notes,
      status: "PENDING_REVIEW",
      submitted_at: new Date().toISOString(),
    });

  if (error) {
    console.error("Error submitting task:", error);
    return { error: "Failed to submit task" };
  }

  revalidatePath("/dashboard/tasks");
  revalidatePath(`/dashboard/tasks/${taskId}`);
  
  return { success: true };
}

export async function evaluateTask(submissionId: string, score: number, feedback: string, newStatus: string) {
  const supabase = await createClient();
  
  // Verify admin access in a real app
  // ...
  
  const { error } = await supabase
    .from("evaluations")
    .upsert({
      submission_id: submissionId,
      score,
      feedback,
      evaluated_at: new Date().toISOString()
    });
    
  if (!error) {
    // Update the submission status
    await supabase
      .from("submissions")
      .update({ status: newStatus })
      .eq("id", submissionId);
  }

  revalidatePath("/admin/evaluations");
  
  if (error) return { error: "Failed to evaluate" };
  return { success: true };
}
