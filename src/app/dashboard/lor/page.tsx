import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { AlertCircle, Calendar } from "lucide-react";
import { PrintButton } from "../PrintButton";
import Image from "next/image";

export const metadata = {
  title: "Letter of Recommendation | Dashboard | CodeInternX",
};

export default async function LORPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check if they have an approved certificate to get the LOR
  const { data: certificate } = await supabase
    .from("certificates")
    .select("*, programs(title), profiles(full_name, email)")
    .eq("student_id", user.id)
    .order("issue_date", { ascending: false })
    .limit(1)
    .single();

  if (!certificate) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Letter of Recommendation</h1>
          <p className="text-muted-foreground mt-2">
            View and download your official CodeInternX Letter of Recommendation.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center max-w-2xl mt-8">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-amber-600" />
          </div>
          <h2 className="text-xl font-semibold text-amber-900 mb-2">Completion Required</h2>
          <p className="text-amber-700">
            Your Letter of Recommendation will be generated and available for download here once you have successfully completed all tasks and have been issued a Certificate of Completion.
          </p>
        </div>
      </div>
    );
  }

  const studentName = certificate.profiles?.full_name || "Student";
  const programTitle = certificate.programs?.title || "Internship Program";
  const dateStr = new Date(certificate.issue_date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <div className="space-y-6">
      <div className="print:hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Letter of Recommendation</h1>
          <p className="text-muted-foreground mt-1">Your official CodeInternX LOR for future endeavors.</p>
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
              <h2 className="text-xl font-bold text-slate-400 tracking-wider uppercase mb-2">Letter of Recommendation</h2>
              <div className="inline-flex items-center gap-1.5 text-sm bg-slate-100 px-3 py-1 rounded text-slate-600 font-medium">
                <Calendar className="w-4 h-4" /> Date: {dateStr}
              </div>
            </div>
          </div>

          {/* Document Body */}
          <div className="space-y-6 text-slate-800 leading-relaxed text-justify">
            <p><strong>To Whom It May Concern,</strong></p>
            
            <p>
              It is my absolute pleasure to strongly recommend <strong>{studentName}</strong>. During their time at CodeInternX, {studentName} served as a <strong>{programTitle} Intern</strong>. They consistently demonstrated a strong work ethic, exceptional problem-solving skills, and a remarkable ability to learn and adapt to new technologies.
            </p>

            <p>
              Throughout the internship, {studentName} was tasked with numerous real-world assignments that required not only technical proficiency but also an understanding of software architecture, clean code practices, and effective collaboration. They successfully completed all milestone tasks, met every deadline, and consistently produced high-quality, production-ready code.
            </p>

            <p>
              What truly sets {studentName} apart is their proactive approach to learning. They did not just fulfill the basic requirements; they often went above and beyond to optimize their solutions and seek constructive feedback from our evaluators. This level of dedication is rare and indicates a highly motivated individual.
            </p>

            <p>
              I am completely confident that {studentName} would be an outstanding addition to any engineering team or academic program. Their combination of technical talent, drive, and professional demeanor makes them an ideal candidate for any future endeavors they pursue.
            </p>

            <p className="pb-8">
              If you require any further information or specific details regarding {studentName}'s performance during their time at CodeInternX, please feel free to reach out to us at verification@codeinternx.com, referencing the certificate ID: <strong>{certificate.certificate_id}</strong>.
            </p>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-8 pt-8 border-t-2 border-slate-100 mt-12">
              <div>
                <p className="text-slate-500 text-sm mb-12">Sincerely,</p>
                <div className="w-48 h-px bg-slate-300 mb-2"></div>
                <p className="font-bold text-slate-900">Shani Bharadwaj</p>
                <p className="text-sm text-slate-500">Founder & CEO, CodeInternX</p>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-indigo-100 bg-indigo-50/50 transform -rotate-12">
                  <span className="text-indigo-300 font-bold tracking-widest uppercase text-sm text-center">Verified<br/>Credential</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
