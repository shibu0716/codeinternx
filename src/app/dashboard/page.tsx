import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Code2, AlertCircle, Lock, Trophy } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Dashboard Overview | CodeInternX",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch the active enrollment
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("*, programs(title, slug)")
    .eq("student_id", user.id)
    .order("enrolled_at", { ascending: false })
    .limit(1)
    .single();

  if (!enrollment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
          <Code2 className="w-10 h-10 text-muted-foreground" />
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

  if (enrollment.payment_status !== "SUCCESS") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
          <Lock className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Payment Required</h1>
        <p className="text-muted-foreground max-w-md">
          You have initiated enrollment for <strong>{enrollment.programs?.title}</strong>, but we haven't received your payment yet.
        </p>
        <Link href={`/internships/${enrollment.programs?.slug}`}>
          <Button size="lg" className="mt-4">Complete Payment</Button>
        </Link>
      </div>
    );
  }

  // 1. Fetch all tasks for the program
  const { data: allTasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("program_id", enrollment.program_id)
    .order("week_number", { ascending: true });

  const tasks = allTasks || [];
  const totalTasks = tasks.length;

  // 2. Fetch all submissions for this enrollment
  const { data: submissions } = await supabase
    .from("submissions")
    .select("*, tasks(week_number, title)")
    .eq("enrollment_id", enrollment.id);

  const subs = submissions || [];
  
  // Progress calculations
  const approvedSubs = subs.filter(s => s.status === 'APPROVED');
  const pendingSubs = subs.filter(s => s.status === 'PENDING');
  const tasksCompletedCount = approvedSubs.length;
  const pendingReviewCount = pendingSubs.length;
  const progressPercentage = totalTasks > 0 ? Math.round((tasksCompletedCount / totalTasks) * 100) : 0;
  const remainingTasks = totalTasks - tasksCompletedCount;

  // 3. Find Current Task (First task that doesn't have an APPROVED or PENDING submission)
  const completedOrPendingTaskIds = new Set([...approvedSubs, ...pendingSubs].map(s => s.task_id));
  const currentTask = tasks.find(t => !completedOrPendingTaskIds.has(t.id));

  // Determine current week based on completed tasks
  const currentWeek = currentTask ? currentTask.week_number : (enrollment.duration_months * 4);

  // 4. Fetch Recent Evaluations
  const { data: evaluations } = await supabase
    .from("evaluations")
    .select("*, submissions!inner(*, tasks(title))")
    .eq("submissions.student_id", user.id)
    .order("evaluated_at", { ascending: false })
    .limit(3);

  const evals = evaluations || [];
  
  // Average Score Calculation
  const avgScore = evals.length > 0 
    ? Math.round(evals.reduce((acc, curr) => acc + curr.overall_score, 0) / evals.length)
    : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
        <p className="text-muted-foreground mt-1">Here is an overview of your progress and upcoming tasks.</p>
      </div>

      {/* Active Program Progress */}
      <Card className="border-primary/20 shadow-sm">
        <CardHeader className="bg-primary/5 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardDescription className="text-primary font-medium mb-1">Active Program</CardDescription>
              <CardTitle className="text-2xl">{enrollment.programs?.title}</CardTitle>
            </div>
            <Badge variant="outline" className="w-fit bg-background text-sm">
              {progressPercentage === 100 ? "Completed" : `Week ${currentWeek} of ${(enrollment.duration_months * 4) || totalTasks}`}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>Overall Progress</span>
              <span>{progressPercentage}%</span>
            </div>
            <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all duration-1000 ease-in-out" style={{ width: `${progressPercentage}%` }}></div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">{tasksCompletedCount}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Tasks Completed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">{pendingReviewCount}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Pending Review</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{avgScore > 0 ? avgScore : '-'}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Avg Score</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">{remainingTasks}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Remaining</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Next Task */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" /> Current Task
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentTask ? (
              <div className="p-4 bg-muted/50 rounded-lg border">
                <div className="flex justify-between items-start mb-2 gap-4">
                  <h3 className="font-semibold text-lg leading-tight">{currentTask.title}</h3>
                  <Badge variant="secondary" className="shrink-0">Week {currentTask.week_number}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {currentTask.description || "No description provided."}
                </p>
                <Link href={`/dashboard/tasks/${currentTask.id}`} className="flex w-full">
                  <Button className="w-full">
                    Start Working
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="p-8 bg-muted/30 rounded-lg border flex flex-col items-center justify-center text-center h-[180px]">
                <Trophy className="w-10 h-10 text-amber-500 mb-3" />
                <h3 className="font-semibold text-lg">All Tasks Completed!</h3>
                <p className="text-sm text-muted-foreground">You have finished all assignments for this program.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Evaluations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" /> Recent Evaluations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {evals.length > 0 ? (
              <>
                {evals.map((evaluation) => (
                  <div key={evaluation.id} className="flex items-start gap-4 p-3 rounded-md hover:bg-muted/50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 flex items-center justify-center font-bold text-sm shrink-0 border border-green-200 dark:border-green-800">
                      {evaluation.overall_score}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm line-clamp-1">{evaluation.submissions?.tasks?.title || "Task Evaluation"}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">"{evaluation.feedback}"</p>
                    </div>
                  </div>
                ))}
                <Link href="/dashboard/evaluations" className="flex w-full pt-2">
                  <Button variant="outline" className="w-full">
                    View All Evaluations
                  </Button>
                </Link>
              </>
            ) : (
              <div className="p-8 bg-muted/30 rounded-lg border flex flex-col items-center justify-center text-center h-[180px]">
                <AlertCircle className="w-10 h-10 text-muted-foreground/50 mb-3" />
                <h3 className="font-semibold text-lg text-muted-foreground">No Evaluations Yet</h3>
                <p className="text-sm text-muted-foreground">Submit tasks to receive feedback and scores.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
