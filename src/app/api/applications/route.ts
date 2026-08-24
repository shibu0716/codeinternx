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

    // 1. Get Program ID (Fallback to null if DB is empty to prevent UI from breaking)
    const { data: program } = await supabase
      .from("programs")
      .select("id")
      .eq("slug", programSlug)
      .single();

    const programId = program ? program.id : null;

    // 2. Update or Create Profile metadata
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        email: user.email,
        full_name: fullName,
        phone: phone,
        college: college,
        degree: degree,
        graduation_year: parseInt(graduationYear) || null,
        linkedin_url: linkedinUrl,
        github_url: githubUrl,
      });

    if (profileError) {
      throw profileError;
    }

    // 3. Generate Application ID
    const appId = `CI-APP-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;

    // 4. Create Application
    const { data: application, error: appError } = await supabase
      .from("applications")
      .insert({
        application_id: appId,
        student_id: user.id,
        program_id: programId,
        source: source || 'WEBSITE',
        status: 'PENDING',
        notes: JSON.stringify({ branch, currentYear, portfolioUrl, programSlug })
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
    
    // 5. Send Confirmation Email (non-blocking)
    import("@/lib/email").then((module) => {
       const programTitle = programSlug.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
       module.sendApplicationConfirmationEmail(email, fullName, programTitle, appId).catch(console.error);
    });

    return NextResponse.json({ success: true, application_id: application.application_id, id: application.id });

  } catch (error: any) {
    console.error("Application submission error:", error);
    return NextResponse.json({ error: error.message || JSON.stringify(error) || "Internal Server Error" }, { status: 500 });
  }
}
