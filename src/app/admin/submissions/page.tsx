import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ClipboardList, ExternalLink } from "lucide-react";

export const metadata = {
  title: "Submissions | Admin Dashboard",
};

export default async function SubmissionsPage() {
  const supabase = await createClient();

  const { data: submissions, error } = await supabase
    .from("submissions")
    .select("*, profiles(full_name, email)")
    .order("submitted_at", { ascending: false });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Task Submissions</h1>
          <p className="text-slate-500 mt-1">Review student task submissions and evaluation status.</p>
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-indigo-500" />
            Recent Submissions
          </CardTitle>
          <CardDescription>A list of all tasks submitted by enrolled students.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {error ? (
            <div className="p-8 text-center text-red-500">Failed to load submissions.</div>
          ) : !submissions || submissions.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center text-slate-500">
              <ClipboardList className="w-12 h-12 text-slate-300 mb-4" />
              <p className="text-lg font-medium text-slate-900">No submissions found</p>
              <p>Student task submissions will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/80">
                  <TableRow>
                    <TableHead className="font-semibold text-slate-600">Student</TableHead>
                    <TableHead className="font-semibold text-slate-600">Task</TableHead>
                    <TableHead className="font-semibold text-slate-600">Submitted At</TableHead>
                    <TableHead className="font-semibold text-slate-600">Link</TableHead>
                    <TableHead className="font-semibold text-slate-600">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((sub: any) => (
                    <TableRow key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell>
                        <div className="font-medium text-slate-900">{sub.profiles?.full_name || "Unknown"}</div>
                        <div className="text-sm text-slate-500">{sub.profiles?.email || "No email"}</div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-slate-700">Task #{sub.task_id}</span>
                      </TableCell>
                      <TableCell className="text-slate-500">
                        {new Date(sub.submitted_at || sub.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {sub.submission_url ? (
                          <a href={sub.submission_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 hover:underline">
                            View <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-slate-400">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {sub.status === 'EVALUATED' ? (
                          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Evaluated</Badge>
                        ) : sub.status === 'REJECTED' ? (
                          <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>
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
