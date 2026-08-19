import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { AlertCircle, Calendar } from "lucide-react";
import { PrintButton } from "../PrintButton";
import Image from "next/image";

export const metadata = {
  title: "Offer Letter | Dashboard | CodeInternX",
};

export default async function OfferLetterPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch enrollment and profile
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("*, programs(title), profiles(full_name, email)")
    .eq("student_id", user.id)
    .order("enrolled_at", { ascending: false })
    .limit(1)
    .single();

  if (!enrollment) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center max-w-2xl mt-8">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-amber-600" />
        </div>
        <h2 className="text-xl font-semibold text-amber-900 mb-2">No Active Enrollment Found</h2>
        <p className="text-amber-700">
          Your offer letter will be available here once your application is approved and you have successfully enrolled.
        </p>
      </div>
    );
  }

  const studentName = enrollment.profiles?.full_name || "Student";
  const programTitle = enrollment.programs?.title || "Internship Program";
  const dateStr = new Date(enrollment.enrolled_at).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <div className="space-y-6">
      <div className="print:hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Offer Letter</h1>
          <p className="text-muted-foreground mt-1">Official CodeInternX offer of internship.</p>
        </div>
        <PrintButton className="w-full sm:w-auto" />
      </div>

      {/* Printable Document Container */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden print:border-none print:shadow-none print:m-0 print:p-0">
        <div className="p-8 sm:p-12 md:p-16 max-w-4xl mx-auto print:max-w-none print:w-full print:p-8">
          
          {/* Document Header */}
          <div className="flex justify-between items-start mb-12 border-b-2 border-slate-100 pb-8">
            <div>
              <Image src="/codeinternx-logo.png" alt="CodeInternX" width={200} height={45} className="h-10 w-auto print:h-12" priority />
              <div className="text-sm text-slate-500 mt-2">
                <p>support@codeinternx.com</p>
                <p>www.codeinternx.com</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold text-indigo-900 tracking-wider uppercase mb-2">Offer of Internship</h2>
              <div className="inline-flex items-center gap-1.5 text-sm bg-slate-100 px-3 py-1 rounded text-slate-600 font-medium">
                <Calendar className="w-4 h-4" /> Date: {dateStr}
              </div>
            </div>
          </div>

          {/* Document Body */}
          <div className="space-y-6 text-slate-800 leading-relaxed text-justify">
            <p><strong>Dear {studentName},</strong></p>
            
            <p>
              We are absolutely thrilled to formally offer you the position of <strong>{programTitle} Intern</strong> at CodeInternX. We were highly impressed by your background and enthusiasm, and we believe your skills will make a significant impact on our real-world projects.
            </p>

            <h3 className="font-semibold text-lg pt-4">Internship Details:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Role:</strong> {programTitle} Intern</li>
              <li><strong>Duration:</strong> {enrollment.duration_months} Months</li>
              <li><strong>Type:</strong> Remote / Work From Home</li>
              <li><strong>Start Date:</strong> {dateStr}</li>
            </ul>

            <p className="pt-2">
              During your time with CodeInternX, you will be deeply involved in developing cutting-edge solutions, collaborating with experienced mentors, and expanding your technical repertoire. We expect you to abide by our code of conduct, maintain confidentiality regarding proprietary systems, and actively engage in all assigned tasks.
            </p>

            <p>
              This internship is an unpaid educational opportunity designed to equip you with industry-standard practices. Upon successful completion of all required tasks and evaluations, you will be awarded an official verified Certificate of Completion and a Letter of Recommendation.
            </p>

            <p className="pt-4 pb-8">
              We look forward to welcoming you to the team and witnessing the incredible things you will build. Should you have any questions, please do not hesitate to reach out to your assigned mentor via the dashboard.
            </p>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-8 pt-8 border-t-2 border-slate-100 mt-12">
              <div>
                <p className="text-slate-500 text-sm mb-12">Authorized Signatory</p>
                <div className="w-48 h-px bg-slate-300 mb-2"></div>
                <p className="font-bold text-slate-900">Shani Bharadwaj</p>
                <p className="text-sm text-slate-500">Founder & CEO, CodeInternX</p>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-indigo-100 bg-indigo-50/50 transform -rotate-12">
                  <span className="text-indigo-300 font-bold tracking-widest uppercase text-sm">Official<br/>Seal</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
