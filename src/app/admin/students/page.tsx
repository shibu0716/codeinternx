import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/utils/supabase/server";

export const metadata = {
  title: "Manage Students | CodeInternX Admin",
};

export default async function AdminStudentsPage() {
  const supabase = await createClient();

  const { data: students, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, college, degree, graduation_year, created_at, role")
    .eq("role", "STUDENT")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching students:", error);
  }

  // Formatting date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Manage Students</h1>
        <p className="text-muted-foreground mt-1">View and manage all registered students on the platform.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registered Students</CardTitle>
          <CardDescription>
            A list of all students who have signed up.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-slate-200">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-semibold text-slate-900">Name</TableHead>
                  <TableHead className="font-semibold text-slate-900">Email</TableHead>
                  <TableHead className="font-semibold text-slate-900 hidden md:table-cell">College</TableHead>
                  <TableHead className="font-semibold text-slate-900">Joined</TableHead>
                  <TableHead className="font-semibold text-slate-900 text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students && students.length > 0 ? (
                  students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium text-slate-900">{student.full_name}</TableCell>
                      <TableCell className="text-slate-600">{student.email}</TableCell>
                      <TableCell className="text-slate-600 hidden md:table-cell">
                        {student.college || <span className="text-slate-400 italic">Not provided</span>}
                        {student.graduation_year && <span className="text-xs text-slate-500 ml-1">({student.graduation_year})</span>}
                      </TableCell>
                      <TableCell className="text-slate-600">{formatDate(student.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                          Active
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                      No students found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
