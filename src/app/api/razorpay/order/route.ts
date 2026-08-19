import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createClient } from "@/utils/supabase/server";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "test_key",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "test_secret",
});

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { applicationId, programId, duration } = body;

    if (!applicationId || !programId || !duration) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Verify application exists and belongs to user
    const { data: application, error: appError } = await supabase
      .from("applications")
      .select("id, status")
      .eq("id", applicationId)
      .eq("student_id", user.id)
      .single();

    if (appError || !application) {
      return NextResponse.json({ error: "Application not found or unauthorized" }, { status: 404 });
    }

    if (application.status !== 'APPROVED') {
      return NextResponse.json({ error: "Application must be APPROVED before payment" }, { status: 400 });
    }

    // Determine secure price from backend pricing map
    const pricingMap: Record<number, number> = {
      1: 99,
      2: 199,
      3: 299,
      6: 499,
    };

    const securePrice = pricingMap[duration];
    if (!securePrice) {
       return NextResponse.json({ error: "Invalid duration selected" }, { status: 400 });
    }

    // Convert price to paise
    const amountInPaise = Math.round(securePrice * 100);

    // 2. Create Razorpay Order
    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `app_${applicationId.substring(0, 8)}_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // 3. Store Order in DB
    const { error: orderError } = await supabase
      .from("orders")
      .insert([{
        user_id: user.id,
        application_id: applicationId,
        program_id: programId,
        razorpay_order_id: order.id,
        amount: securePrice,
        currency: "INR",
        status: "CREATED",
      }]);

    if (orderError) {
      console.error("Failed to store order:", orderError);
      return NextResponse.json({ error: "Failed to store order in database" }, { status: 500 });
    }

    // Also update the application status to PAYMENT_PENDING
    await supabase.from("applications").update({ status: 'PAYMENT_PENDING' }).eq('id', applicationId);

    return NextResponse.json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
    });

  } catch (error) {
    console.error("Razorpay Order Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
