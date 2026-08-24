import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export const metadata = {
  title: "My Evaluations | CodeInternX",
};

export default async function EvaluationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Fetch Evaluations for the user
  const { data: evaluations } = await supabase
    .from("evaluations")
    .select("*, submissions!inner(*, tasks(title, week_number))")
    .eq("submissions.student_id", user.id)
    .order("evaluated_at", { ascending: false });

  const evals = evaluations || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Evaluations</h1>
        <p className="text-muted-foreground mt-1">Review your task scores and evaluator feedback.</p>
      </div>

      {evals.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">No Evaluations Yet</h1>
          <p className="text-muted-foreground max-w-md">
            You haven't received any task evaluations yet. Submit your assignments to receive feedback!
          </p>
          <Link href={`/dashboard/tasks`}>
            <Button size="lg" className="mt-4">View Tasks</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {evals.map((evaluation) => (
            <Card key={evaluation.id} className="overflow-hidden">
              <div className="bg-green-500 h-2 w-full" />
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Badge className="mb-2" variant="outline">
                      Week {evaluation.submissions?.tasks?.week_number}
                    </Badge>
                    <h3 className="font-semibold text-lg">{evaluation.submissions?.tasks?.title}</h3>
                    <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3" />
                      Evaluated on {new Date(evaluation.evaluated_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-green-50 text-green-700 flex flex-col items-center justify-center font-bold border border-green-200">
                    <span className="text-xl leading-none">{evaluation.total_score || evaluation.overall_score || 0}</span>
                    <span className="text-[10px] text-green-600/70 uppercase">Score</span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 mb-4 text-sm border border-slate-100">
                  <h4 className="font-semibold mb-1 text-slate-700">Feedback</h4>
                  <p className="text-slate-600 italic whitespace-pre-wrap">"{evaluation.feedback}"</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-6 pt-4 border-t border-slate-100">
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase mb-1">Technical</span>
                    <span className="font-medium">{evaluation.technical_score || 0}/20</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase mb-1">UI/UX</span>
                    <span className="font-medium">{evaluation.ui_ux_score || 0}/20</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase mb-1">Requirements</span>
                    <span className="font-medium">{evaluation.requirements_score || 0}/20</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase mb-1">Code Quality</span>
                    <span className="font-medium">{evaluation.code_quality_score || 0}/20</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
