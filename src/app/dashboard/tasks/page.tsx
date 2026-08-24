export const dynamic = 'force-dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, AlertCircle, FileCode2, Lock } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export const metadata = {
  title: "My Tasks & Submissions | CodeInternX",
};



export default async function TasksPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null; 
  }

  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("*, programs(title, slug), applications(status)")
    .eq("student_id", user.id)
    .order("enrolled_at", { ascending: false })
    .limit(1)
    .single();

  if (!enrollment || enrollment.applications?.status !== 'ENROLLED') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">No Active Enrollments</h1>
        <p className="text-muted-foreground max-w-md">
          You haven't enrolled in any internships or courses yet. Browse our catalog to start your journey!
        </p>
        <Link href={`/internships`}>
          <Button size="lg" className="mt-4">Browse Internships</Button>
        </Link>
      </div>
    );
  }

  // Fetch all tasks for the program
  const { data: programTasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("program_id", enrollment.program_id)
    .order("week_number", { ascending: true });

  const tasksData = programTasks || [];
  console.log("Tasks fetched on server:", tasksData);

  // Fetch all submissions for this enrollment
  const { data: submissions } = await supabase
    .from("submissions")
    .select("*")
    .eq("enrollment_id", enrollment.id);

  const subs = submissions || [];

  // Fetch evaluations for scores
  const { data: evaluations } = await supabase
    .from("evaluations")
    .select("*, submissions!inner(task_id)")
    .eq("submissions.student_id", user.id);

  const evals = evaluations || [];

  const mergedTasks = tasksData.map(t => {
    const sub = subs.find(s => s.task_id === t.id);
    const evalResult = evals.find(e => e.submissions.task_id === t.id);
    return {
      ...t,
      status: sub?.status || 'PENDING',
      submittedAt: sub?.submitted_at,
      score: evalResult?.overall_score || null,
      dueDate: new Date(new Date(enrollment.enrolled_at).getTime() + (t.week_number * 7 * 24 * 60 * 60 * 1000)).toISOString() // Mock due date based on enrollment + weeks
    };
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tasks & Submissions</h1>
        <p className="text-muted-foreground mt-1">Manage your assignments and view evaluation feedback.</p>
      </div>

      {mergedTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border rounded-xl bg-slate-50 border-dashed">
          <div className="w-16 h-16 bg-white border rounded-full flex items-center justify-center mb-4 shadow-sm">
            <FileCode2 className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No tasks assigned yet</h2>
          <p className="text-muted-foreground max-w-sm">
            Your manager will assign tasks shortly. Please check back later.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {mergedTasks.map((task) => (
            <Card key={task.id} className="overflow-hidden">
              <div className={`h-2 w-full ${
                task.status === 'APPROVED' ? 'bg-green-500' :
                task.status === 'CHANGES_REQUESTED' ? 'bg-amber-500' :
                'bg-slate-200'
              }`} />
              <div className="p-6 md:flex justify-between items-center gap-6">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-semibold text-lg">{task.title}</h3>
                    {task.status === "APPROVED" && <Badge className="bg-green-100 text-green-700 border-green-200">Approved</Badge>}
                    {task.status === "CHANGES_REQUESTED" && <Badge className="bg-amber-100 text-amber-700 border-amber-200">Changes Requested</Badge>}
                    {task.status === "PENDING" && <Badge variant="outline">Pending</Badge>}
                  </div>
                  
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                    {task.submittedAt && (
                      <div className="flex items-center gap-1.5">
                        <FileCode2 className="w-4 h-4" />
                        <span>Submitted: {new Date(task.submittedAt).toLocaleDateString()}</span>
                      </div>
                    )}
                    {task.score && (
                      <div className="flex items-center gap-1.5 font-medium text-foreground">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span>Score: {task.score}/100</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0 md:min-w-32">
                  <Link href={`/dashboard/tasks/${task.id}`} className="flex w-full">
                    <Button className="w-full" variant={task.status === "APPROVED" ? "outline" : "default"}>
                      {task.status === "APPROVED" ? "View Feedback" : 
                       task.status === "CHANGES_REQUESTED" ? "Resubmit" : "Start Task"}
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
