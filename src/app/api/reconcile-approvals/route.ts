import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "SUPER_ADMIN" && profile?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Find all applications that are APPROVED
    const { data: approvedApps, error: appError } = await supabase
      .from("applications")
      .select("*")
      .eq("status", "APPROVED");

    if (appError) {
      throw new Error(`Failed to fetch applications: ${appError.message}`);
    }

    let createdCount = 0;
    let skippedCount = 0;
    const errors = [];

    for (const app of approvedApps || []) {
      // Check if enrollment exists
      const { data: existingEnrollment } = await supabase
        .from("enrollments")
        .select("id")
        .eq("application_id", app.id)
        .maybeSingle();

      if (existingEnrollment) {
        skippedCount++;
        continue;
      }

      // Create enrollment
      const { error: enrollError } = await supabase
        .from("enrollments")
        .insert({
          student_id: app.student_id,
          program_id: app.program_id,
          application_id: app.id,
          payment_status: "PENDING",
          enrolled_at: new Date().toISOString(),
          duration_months: 1 // Default duration
        });

      if (enrollError) {
        errors.push(`Failed to create enrollment for app ${app.id}: ${enrollError.message}`);
      } else {
        createdCount++;
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: "Reconciliation complete", 
      createdCount, 
      skippedCount, 
      errors 
    });

  } catch (error: any) {
    console.error("Reconciliation Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
