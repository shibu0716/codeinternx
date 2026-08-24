import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// ONE-TIME MIGRATION ROUTE — DELETE AFTER USE
export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || [];
  if (!adminEmails.includes(user.email!)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error: testError } = await supabase.from("payment_settings").select("id").limit(1);

  if (testError) {
    return NextResponse.json({
      success: false,
      message: "payment_settings table not found",
      sql_to_run: "See: https://supabase.com/dashboard/project/fbzfoznyzpgzgfxedlzl/sql/new",
      error: testError.message
    });
  }

  const { data: existing } = await supabase.from("payment_settings").select("id").maybeSingle();

  if (!existing) {
    const { error: insertError } = await supabase.from("payment_settings").insert({
      account_holder_name: "CodeInternX",
      bank_name: "Central Bank of India",
      account_number: "4052732274",
      ifsc_code: "CBIN0242826",
      upi_id_primary: "shibuthegenius@ybl",
      upi_id_secondary: "shibuthegenius@ibl",
      payee_name: "CodeInternX",
      instructions: "Please make your payment only to the official CodeInternX payment details. After completing the payment, enter your transaction/UTR number and upload your payment receipt."
    });
    if (insertError) return NextResponse.json({ success: false, error: insertError.message });
    return NextResponse.json({ success: true, message: "Seeded payment_settings" });
  }

  return NextResponse.json({ success: true, message: "payment_settings already has data" });
}
