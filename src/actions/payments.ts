"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";



export async function submitPayment(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const applicationId = formData.get("applicationId") as string;
  const enrollmentId = formData.get("enrollmentId") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const paymentMethod = formData.get("paymentMethod") as string;
  const transactionId = formData.get("transactionId") as string;
  const utrNumber = formData.get("utrNumber") as string;
  const paymentDate = formData.get("paymentDate") as string;
  const paymentTime = formData.get("paymentTime") as string;
  const file = formData.get("proofFile") as File;

  if (!transactionId || !amount || !paymentDate || !file) {
    throw new Error("Missing required fields");
  }

  // Handle file upload
  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}/${Date.now()}.${fileExt}`;
  
  // Upload to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("payment_proofs")
    .upload(fileName, file);

  if (uploadError) {
    console.error("Storage upload error:", uploadError);
    throw new Error("Failed to upload payment proof. Please try again.");
  }

  const { data: publicUrlData } = supabase.storage.from("payment_proofs").getPublicUrl(fileName);
  const proof_file_url = publicUrlData.publicUrl;

  // Check duplicate transaction ID
  const { data: existingTx } = await supabase
    .from("payments")
    .select("id")
    .eq("transaction_id", transactionId)
    .single();

  if (existingTx) {
    throw new Error("DUPLICATE_TRANSACTION");
  }

  // Insert payment
  const { error: insertError } = await supabase.from("payments").insert({
    student_id: user.id,
    application_id: applicationId,
    enrollment_id: enrollmentId,
    amount,
    currency: "INR",
    payment_method: paymentMethod,
    transaction_id: transactionId,
    utr_number: utrNumber,
    payment_date: paymentDate,
    payment_time: paymentTime,
    proof_file_url,
    status: "PENDING_VERIFICATION",
  });

  if (insertError) {
    console.error("Failed to insert payment:", insertError);
    throw new Error(`Failed to submit payment: ${insertError.message}`);
  }

  revalidatePath("/dashboard/payments");
  revalidatePath("/dashboard/certificates");
  
  return { success: true };
}

export async function verifyPayment(paymentId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "SUPER_ADMIN" && profile?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  // Fetch payment to get enrollment
  const { data: payment, error: fetchErr } = await supabase.from("payments").select("enrollment_id").eq("id", paymentId).single();
  
  if (fetchErr) {
    throw new Error("Payment not found");
  }
  
  if (payment?.enrollment_id) {
    // Update enrollment payment status
    await supabase.from("enrollments").update({ payment_status: "SUCCESS" }).eq("id", payment.enrollment_id);
  }

  // Update payment status
  const { error: updateErr } = await supabase.from("payments").update({
    status: "VERIFIED",
    reviewed_at: new Date().toISOString(),
    reviewed_by: user.id
  }).eq("id", paymentId);

  if (updateErr) {
    throw new Error(`Failed to verify payment: ${updateErr.message}`);
  }

  // Send verification email
  try {
    const { data: student } = await supabase.from("payments")
      .select("transaction_id, profiles!inner(email, full_name)")
      .eq("id", paymentId)
      .single();
    
    if (student?.profiles) {
       const profile = Array.isArray(student.profiles) ? student.profiles[0] : student.profiles;
       const { sendPaymentVerificationEmail } = await import("@/lib/email");
       await sendPaymentVerificationEmail(profile.email, profile.full_name, student.transaction_id);
    }
  } catch (emailErr) {
    console.error("Failed to send verification email:", emailErr);
    // Don't throw — payment is verified, email is best-effort
  }

  revalidatePath("/admin/payments");
  return { success: true };
}

export async function rejectPayment(paymentId: string, reason: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "SUPER_ADMIN" && profile?.role !== "ADMIN") throw new Error("Unauthorized");

  const { data, error } = await supabase.from("payments").update({
    status: "REJECTED",
    rejection_reason: reason,
    reviewed_at: new Date().toISOString(),
    reviewed_by: user.id
  }).eq("id", paymentId).select("transaction_id, profiles!inner(email, full_name)").single();

  if (error) {
    throw new Error(`Failed to reject payment: ${error.message}`);
  }

  if (data?.profiles) {
    try {
      const profile = Array.isArray(data.profiles) ? data.profiles[0] : data.profiles;
      const { sendPaymentRejectionEmail } = await import("@/lib/email");
      await sendPaymentRejectionEmail(profile.email, profile.full_name, data.transaction_id, reason);
    } catch (emailErr) {
      console.error("Failed to send rejection email:", emailErr);
    }
  }

  revalidatePath("/admin/payments");
  return { success: true };
}

export async function requestResubmission(paymentId: string, reason: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "SUPER_ADMIN" && profile?.role !== "ADMIN") throw new Error("Unauthorized");

  const { data, error } = await supabase.from("payments").update({
    status: "RESUBMISSION_REQUIRED",
    rejection_reason: reason,
    reviewed_at: new Date().toISOString(),
    reviewed_by: user.id
  }).eq("id", paymentId).select("transaction_id, profiles!inner(email, full_name)").single();

  if (error) {
    throw new Error(`Failed to request resubmission: ${error.message}`);
  }

  if (data?.profiles) {
    try {
      const profile = Array.isArray(data.profiles) ? data.profiles[0] : data.profiles;
      const { sendPaymentRejectionEmail } = await import("@/lib/email");
      await sendPaymentRejectionEmail(profile.email, profile.full_name, data.transaction_id, reason);
    } catch (emailErr) {
      console.error("Failed to send resubmission email:", emailErr);
    }
  }

  revalidatePath("/admin/payments");
  return { success: true };
}

export async function getPaymentSettings() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("payment_settings").select("*").maybeSingle();
  if (error) console.error("Error fetching payment settings:", error);
  return data;
}

export async function updatePaymentSettings(formData: FormData) {
  const { checkIsAdminAction } = await import("@/actions/auth");
  const isAdmin = await checkIsAdminAction();
  if (!isAdmin) throw new Error("Unauthorized");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const settingsData = {
    account_holder_name: formData.get("account_holder_name") as string,
    bank_name: formData.get("bank_name") as string,
    account_number: formData.get("account_number") as string,
    ifsc_code: formData.get("ifsc_code") as string,
    upi_id_primary: formData.get("upi_id_primary") as string,
    upi_id_secondary: formData.get("upi_id_secondary") as string || null,
    payee_name: formData.get("payee_name") as string,
    payment_qr_code_url: formData.get("payment_qr_code_url") as string || null,
    instructions: formData.get("instructions") as string || null,
    updated_by: user?.id,
    updated_at: new Date().toISOString()
  };

  // Check if a row exists
  const { data: existing } = await supabase.from("payment_settings").select("id").maybeSingle();

  let error;
  if (existing) {
    const { error: updateError } = await supabase.from("payment_settings").update(settingsData).eq("id", existing.id);
    error = updateError;
  } else {
    const { error: insertError } = await supabase.from("payment_settings").insert([settingsData]);
    error = insertError;
  }

  if (error) {
    console.error("Error updating payment settings:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/payment-settings");
  revalidatePath("/payment");
  return { success: true };
}
