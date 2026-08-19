import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GraduationCap } from "lucide-react";

export const metadata = {
  title: "Enrollments | Admin Dashboard",
};

export default async function EnrollmentsPage() {
  const supabase = await createClient();

  const { data: enrollments, error } = await supabase
    .from("enrollments")
    .select("*, profiles(full_name, email), programs(title)")
    .order("enrolled_at", { ascending: false });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Enrollments</h1>
          <p className="text-slate-500 mt-1">View and manage all student program enrollments.</p>
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-500" />
            Active Enrollments
          </CardTitle>
          <CardDescription>A list of all students currently enrolled in programs.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {error ? (
            <div className="p-8 text-center text-red-500">Failed to load enrollments.</div>
          ) : !enrollments || enrollments.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center text-slate-500">
              <GraduationCap className="w-12 h-12 text-slate-300 mb-4" />
              <p className="text-lg font-medium text-slate-900">No enrollments found</p>
              <p>Students will appear here once they are enrolled in a program.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/80">
                  <TableRow>
                    <TableHead className="font-semibold text-slate-600">Student</TableHead>
                    <TableHead className="font-semibold text-slate-600">Program</TableHead>
                    <TableHead className="font-semibold text-slate-600">Enrolled At</TableHead>
                    <TableHead className="font-semibold text-slate-600">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enrollments.map((enrollment: any) => (
                    <TableRow key={enrollment.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell>
                        <div className="font-medium text-slate-900">{enrollment.profiles?.full_name || "Unknown"}</div>
                        <div className="text-sm text-slate-500">{enrollment.profiles?.email || "No email"}</div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-slate-700">{enrollment.programs?.title || "Unknown Program"}</span>
                      </TableCell>
                      <TableCell className="text-slate-500">
                        {new Date(enrollment.enrolled_at || enrollment.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {enrollment.is_completed ? (
                          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Completed</Badge>
                        ) : (
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200">Active</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
