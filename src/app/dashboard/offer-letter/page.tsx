import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { FileText, Download, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Offer Letter | Dashboard | CodeInternX",
};

export default async function OfferLetterPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check if they have an approved application/enrollment
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("*, applications(internship_id)")
    .eq("user_id", user.id)
    .single();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Offer Letter</h1>
        <p className="text-muted-foreground mt-2">
          View and download your official CodeInternX internship offer letter.
        </p>
      </div>

      {!enrollment ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center max-w-2xl mt-8">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-amber-600" />
          </div>
          <h2 className="text-xl font-semibold text-amber-900 mb-2">No Active Enrollment Found</h2>
          <p className="text-amber-700">
            Your offer letter will be generated and available for download here once your application is approved and you have successfully enrolled in an internship program.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <div className="bg-white border rounded-xl p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center border border-indigo-100">
                <FileText className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-slate-900">Official Offer Letter</h3>
                <p className="text-sm text-slate-500">Issued upon enrollment</p>
              </div>
            </div>
            
            <p className="text-slate-600 mb-8">
              This document serves as your official confirmation of selection for the CodeInternX remote internship program. It includes your role title, duration, and the terms of your internship.
            </p>

            <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700" onClick={() => {}}>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
          
          <div className="hidden md:flex items-center justify-center bg-slate-50 border rounded-xl p-8">
            <div className="w-full max-w-xs aspect-[1/1.4] bg-white shadow-xl shadow-slate-200/50 rounded-lg border flex flex-col p-6 opacity-80 transform rotate-2 hover:rotate-0 transition-transform">
               <div className="w-1/2 h-2 bg-slate-200 rounded mb-4"></div>
               <div className="w-3/4 h-2 bg-slate-200 rounded mb-2"></div>
               <div className="w-full h-2 bg-slate-200 rounded mb-2"></div>
               <div className="w-5/6 h-2 bg-slate-200 rounded mb-8"></div>
               
               <div className="mt-auto flex justify-between items-end">
                  <div className="w-12 h-12 rounded-full border-2 border-indigo-100 bg-indigo-50 flex items-center justify-center">
                    <span className="text-[8px] font-bold text-indigo-300">SEAL</span>
                  </div>
                  <div className="w-1/3 h-4 bg-slate-200 rounded"></div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
