import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";
import ReportsClient from "./ReportsClient";

export const metadata = {
  title: "Performance Reports | Admin Dashboard",
};

export default async function ReportsPage() {
  const supabase = await createClient();

  const { data: enrollments, error } = await supabase
    .from("enrollments")
    .select(`
      id,
      student_id,
      program_id,
      is_completed,
      enrolled_at,
      profiles(full_name, email),
      programs(title)
    `)
    .order("enrolled_at", { ascending: false });

  if (error) {
    console.error("Error fetching enrollments:", error);
  }

  // Also fetch existing documents to know which reports are already generated
  const { data: documents } = await supabase
    .from("internship_documents")
    .select("document_id, type, status, enrollment_id")
    .eq("type", "PERFORMANCE_REPORT");

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Performance Reports</h1>
        <p className="text-slate-500 mt-1">Generate and issue performance reports for students.</p>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader>
          <CardTitle>Generate Reports</CardTitle>
          <CardDescription>
            Select a student enrollment to generate their final performance report.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ReportsClient 
            enrollments={enrollments || []} 
            existingReports={documents || []}
          />
        </CardContent>
      </Card>
    </div>
  );
}
