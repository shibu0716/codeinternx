"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitTask(taskId: string, enrollmentId: string, githubUrl: string, liveUrl?: string, notes?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  // Ensure user owns this enrollment
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id")
    .eq("id", enrollmentId)
    .eq("student_id", user.id)
    .single();

  if (!enrollment) {
    return { success: false, error: "Unauthorized access to this enrollment." };
  }

  // Check if submission already exists to update it instead of insert
  const { data: existingSub } = await supabase
    .from("submissions")
    .select("id")
    .eq("task_id", taskId)
    .eq("enrollment_id", enrollmentId)
    .single();

  const payload = {
    task_id: taskId,
    enrollment_id: enrollmentId,
    student_id: user.id,
    github_url: githubUrl,
    live_url: liveUrl,
    notes: notes,
    status: 'PENDING',
    submitted_at: new Date().toISOString()
  };

  let error;
  if (existingSub) {
    const { error: updateError } = await supabase
      .from("submissions")
      .update(payload)
      .eq("id", existingSub.id);
    error = updateError;
  } else {
    const { error: insertError } = await supabase
      .from("submissions")
      .insert(payload);
    error = insertError;
  }

  if (error) {
    console.error("Submission error:", error);
    return { success: false, error: "Failed to submit task. Please try again later." };
  }

  revalidatePath(`/dashboard/tasks`);
  revalidatePath(`/dashboard/tasks/${taskId}`);

  return { success: true };
}
