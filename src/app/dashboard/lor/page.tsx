import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Award, Download, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Letter of Recommendation | Dashboard | CodeInternX",
};

export default async function LorPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check if they have a completed internship or just an enrollment
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("*, applications(internship_id)")
    .eq("user_id", user.id)
    .single();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Letter of Recommendation</h1>
        <p className="text-muted-foreground mt-2">
          View and download your official CodeInternX Letter of Recommendation (LOR).
        </p>
      </div>

      {!enrollment ? (
        <div className="bg-slate-50 border rounded-xl p-8 text-center max-w-2xl mt-8">
          <div className="w-16 h-16 bg-slate-200/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-slate-500" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Not Eligible Yet</h2>
          <p className="text-slate-600">
            A Letter of Recommendation is a performance-based credential. You must successfully complete an internship and submit the final project to receive an LOR.
          </p>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center max-w-2xl mt-8">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-amber-600" />
          </div>
          <h2 className="text-xl font-semibold text-amber-900 mb-2">Internship In Progress</h2>
          <p className="text-amber-700 mb-6">
            You are currently enrolled in an internship. To unlock your Letter of Recommendation, you must successfully complete all modules and your final project evaluation.
          </p>
          <div className="inline-flex items-center justify-center px-4 py-2 bg-amber-200/50 text-amber-800 rounded-full text-sm font-medium">
            Status: Awaiting Final Project Submission
          </div>
        </div>
      )}
    </div>
  );
}
