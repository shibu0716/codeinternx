import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";
import StudentsClient from "./StudentsClient";

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
          <StudentsClient initialStudents={students || []} />
        </CardContent>
      </Card>
    </div>
  );
}
