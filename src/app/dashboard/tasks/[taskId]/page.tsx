import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileWarning } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { TaskSubmissionClient } from "./TaskSubmissionClient";
import { createClient } from "@/utils/supabase/server";

export default async function TaskSubmissionPage({ params }: { params: Promise<{ taskId: string }> }) {
  const resolvedParams = await params;
  const taskId = resolvedParams.taskId;
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 1. Fetch Task
  const { data: task, error: taskError } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", taskId)
    .single();

  if (taskError || !task) {
    return notFound();
  }

  // 2. Fetch Active Enrollment to ensure user has access
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("*")
    .eq("student_id", user.id)
    .eq("program_id", task.program_id)
    .order("enrolled_at", { ascending: false })
    .limit(1)
    .single();

  if (!enrollment) {
    redirect("/dashboard/tasks");
  }

  // 3. Fetch Submission if exists
  const { data: submission } = await supabase
    .from("submissions")
    .select("*")
    .eq("task_id", taskId)
    .eq("enrollment_id", enrollment.id)
    .single();

  // 4. Fetch Evaluation if exists
  let evaluation = null;
  if (submission) {
    const { data: evalData } = await supabase
      .from("evaluations")
      .select("*, profiles!evaluator_id(full_name)")
      .eq("submission_id", submission.id)
      .single();
    evaluation = evalData;
  }

  const status = submission?.status || 'PENDING_SUBMISSION';
  const isApproved = status === 'APPROVED';
  const isChangesRequested = status === 'CHANGES_REQUESTED';
  const isPendingReview = status === 'PENDING';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <Link href="/dashboard/tasks" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-4 w-fit">
          <ArrowLeft className="w-4 h-4" /> Back to Tasks
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{task.title}</h1>
            <p className="text-muted-foreground mt-1">Week {task.week_number}</p>
          </div>
          <Badge className={`w-fit ${
              isApproved ? 'bg-green-100 text-green-700 border-green-200' :
              isChangesRequested ? 'bg-amber-100 text-amber-700 border-amber-200' :
              isPendingReview ? 'bg-blue-100 text-blue-700 border-blue-200' :
              'bg-slate-100 text-slate-700'
            }`} variant="outline">
            {isApproved ? 'Approved' : 
             isChangesRequested ? 'Changes Requested' : 
             isPendingReview ? 'Pending Review' : 'Not Submitted'}
          </Badge>
        </div>
      </div>

      {/* Evaluator Feedback Section */}
      {(isChangesRequested || isApproved) && evaluation && (
        <Card className={isApproved ? "border-green-200 bg-green-50/50" : "border-amber-200 bg-amber-50/50"}>
          <CardHeader className="pb-3">
            <CardTitle className={`text-lg flex items-center gap-2 ${isApproved ? "text-green-800" : "text-amber-800"}`}>
              <FileWarning className="w-5 h-5" /> Evaluator Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-sm space-y-2 ${isApproved ? "text-green-900/80" : "text-amber-900/80"}`}>
              <p><strong>Reviewer:</strong> {evaluation.profiles?.full_name || 'Evaluator'}</p>
              <p>Score: {evaluation.overall_score}/100</p>
              <p>Feedback: {evaluation.feedback}</p>
              {isChangesRequested && <p className="mt-2 font-medium">Please fix these issues and submit a new GitHub commit URL.</p>}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Task Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 prose prose-sm max-w-none text-muted-foreground">
              <h3>Objective</h3>
              <p>{task.objective || task.description}</p>
              
              <h3>Requirements</h3>
              <ul>
                {(task.requirements?.split('\n') || []).filter(Boolean).map((req: string, i: number) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
              
              <h3>Skills Tested</h3>
              <div className="flex flex-wrap gap-2 not-prose">
                {(task.skills_tested || []).map((skill: string, i: number) => (
                  <Badge key={i} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Submit Your Work</CardTitle>
              <CardDescription>Provide the URLs to your completed code and live deployment.</CardDescription>
            </CardHeader>
            <CardContent>
              <TaskSubmissionClient taskId={task.id} enrollmentId={enrollment.id} initialStatus={status} />
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Evaluation Criteria</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Technical</span>
                  <span className="font-medium">30%</span>
                </li>
                <li className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">UI/UX Quality</span>
                  <span className="font-medium">25%</span>
                </li>
                <li className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Requirements</span>
                  <span className="font-medium">20%</span>
                </li>
                <li className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Code Quality</span>
                  <span className="font-medium">15%</span>
                </li>
                <li className="flex justify-between pb-2">
                  <span className="text-muted-foreground">Professionalism</span>
                  <span className="font-medium">10%</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
