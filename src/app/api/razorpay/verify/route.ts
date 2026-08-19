import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      applicationId
    } = body;

    const secret = process.env.RAZORPAY_KEY_SECRET || "test_secret";

    // Create signature to verify
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // Signature matches, payment is successful
    
    // 1. Get Order
    const { data: order } = await supabase
      .from("orders")
      .select("*")
      .eq("razorpay_order_id", razorpay_order_id)
      .single();

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 2. Insert into Payments
    await supabase.from("payments").insert([{
      order_id: order.id,
      user_id: user.id,
      application_id: applicationId,
      razorpay_payment_id: razorpay_payment_id,
      razorpay_order_id: razorpay_order_id,
      amount: order.amount,
      status: "SUCCESS"
    }]);

    // 3. Update Order
    await supabase.from("orders").update({ status: "PAID" }).eq("id", order.id);

    // 4. Update Application
    await supabase.from("applications").update({ status: "PAID" }).eq("id", applicationId);

    // 5. Create or Update Enrollment
    const { data: existingEnrollment } = await supabase
      .from("enrollments")
      .select("id")
      .eq("student_id", user.id)
      .eq("program_id", order.program_id)
      .single();

    if (existingEnrollment) {
      await supabase
        .from("enrollments")
        .update({ 
          payment_status: "SUCCESS",
          application_id: applicationId,
          order_id: order.id
        })
        .eq("id", existingEnrollment.id);
    } else {
      // we need to know duration, we can default to 1, or try to get it if we saved it
      // we can infer duration from amount based on pricing map, but hardcoding for now or default
      let duration_months = 1;
      if (order.amount == 199) duration_months = 2;
      else if (order.amount == 299) duration_months = 3;
      else if (order.amount == 499) duration_months = 6;

      await supabase
        .from("enrollments")
        .insert([{
          student_id: user.id,
          program_id: order.program_id,
          application_id: applicationId,
          order_id: order.id,
          payment_status: "SUCCESS",
          duration_months: duration_months
        }]);
    }

    return NextResponse.json({ success: true, message: "Payment verified successfully" });

  } catch (error) {
    console.error("Razorpay Verification Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
