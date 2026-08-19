import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle2, AlertCircle, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Evaluator Dashboard | CodeInternX",
};

export default async function EvaluatorDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 1. Fetch total pending submissions
  const { count: pendingCount } = await supabase
    .from("submissions")
    .select("*", { count: "exact", head: true })
    .eq("status", "PENDING");

  // 2. Fetch submissions graded by THIS evaluator
  const { data: myEvaluations } = await supabase
    .from("evaluations")
    .select("id, overall_score, created_at")
    .eq("evaluator_id", user.id);

  const gradedCount = myEvaluations?.length || 0;
  
  // Calculate average score given by this evaluator
  const avgScoreGiven = gradedCount > 0 
    ? Math.round(myEvaluations!.reduce((acc, curr) => acc + curr.overall_score, 0) / gradedCount)
    : 0;

  // 3. Fetch recent submissions needing review
  const { data: recentPending } = await supabase
    .from("submissions")
    .select("id, github_url, submitted_at, profiles(full_name), tasks(title)")
    .eq("status", "PENDING")
    .order("submitted_at", { ascending: true }) // Oldest first for fairness
    .limit(5);

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Evaluator Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back. Here's your grading queue overview.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending in Queue</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{pendingCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Submissions awaiting review</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Graded Tasks</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{gradedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Total lifetime reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Score Given</CardTitle>
            <TrendingUp className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{avgScoreGiven}</div>
            <p className="text-xs text-muted-foreground mt-1">Out of 100 points</p>
          </CardContent>
        </Card>

        <Card className="bg-indigo-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-indigo-100">Action Required</CardTitle>
            <AlertCircle className="h-4 w-4 text-indigo-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount! > 0 ? "Yes" : "No"}</div>
            <p className="text-xs text-indigo-200 mt-1">Check the queue</p>
            {pendingCount! > 0 && (
              <Button size="sm" variant="secondary" className="w-full mt-3 bg-white text-indigo-600 hover:bg-indigo-50" render={<Link href="/evaluator/queue" />}>
                Start Grading
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Up Next in Queue */}
      <Card>
        <CardHeader>
          <CardTitle>Up Next in Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentPending && recentPending.length > 0 ? (
              recentPending.map((sub: any) => {
                // Calculate time waiting
                const submittedDate = new Date(sub.submitted_at);
                const now = new Date();
                const diffHours = Math.floor((now.getTime() - submittedDate.getTime()) / (1000 * 60 * 60));
                
                return (
                  <div key={sub.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                    <div>
                      <p className="font-semibold text-slate-900">{sub.tasks?.title || "Unknown Task"}</p>
                      <p className="text-sm text-slate-500">Submitted by: {sub.profiles?.full_name}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${diffHours > 48 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                          Waiting: {diffHours} hours
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" render={<Link href={`/evaluator/review/${sub.id}`} />}>
                      Review Task
                    </Button>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-slate-500">
                <CheckCircle2 className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                <p>The queue is completely clear. Great job!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
