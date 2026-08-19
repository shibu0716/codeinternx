import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { RateLimiter } from "@/lib/rate-limiter";

// 3 requests per minute per IP
const limiter = new RateLimiter(60 * 1000, 3);

export async function POST(req: Request) {
  try {
    // Basic IP tracking for rate limiting (fallback to 'unknown' if running locally without headers)
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const rateLimit = limiter.check(ip);
    
    if (!rateLimit.success) {
      return NextResponse.json({ error: "Too many requests. Please wait a minute before trying again." }, { status: 429 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please log in to apply." }, { status: 401 });
    }

    const body = await req.json();
    const { 
      fullName, email, phone, college, degree, branch, currentYear, graduationYear,
      linkedinUrl, githubUrl, portfolioUrl, programSlug, source
    } = body;

    if (!programSlug || !fullName || !email || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Get Program ID
    const { data: program } = await supabase
      .from("programs")
      .select("id")
      .eq("slug", programSlug)
      .single();

    if (!program) {
      return NextResponse.json({ error: "Invalid program selected" }, { status: 404 });
    }

    // 2. Update Profile metadata
    await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        phone: phone,
        college: college,
        degree: degree,
        graduation_year: parseInt(graduationYear) || null,
        linkedin_url: linkedinUrl,
        github_url: githubUrl,
      })
      .eq("id", user.id);

    // 3. Generate Application ID
    const appId = `CI-APP-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;

    // 4. Create Application
    const { data: application, error: appError } = await supabase
      .from("applications")
      .insert({
        application_id: appId,
        student_id: user.id,
        program_id: program.id,
        source: source || 'WEBSITE',
        status: 'PENDING',
        notes: JSON.stringify({ branch, currentYear, portfolioUrl })
      })
      .select()
      .single();

    if (appError) {
      // Check for unique constraint violation (student already applied)
      if (appError.code === '23505') {
        return NextResponse.json({ error: "You have already applied for this program." }, { status: 400 });
      }
      throw appError;
    }

    return NextResponse.json({ success: true, application_id: application.application_id, id: application.id });

  } catch (error: any) {
    console.error("Application submission error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
