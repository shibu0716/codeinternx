import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Globe } from "lucide-react";
import Link from "next/link";
import { ReviewFormClient } from "./ReviewFormClient";

export const metadata = {
  title: "Grade Submission | Evaluator | CodeInternX",
};

export default async function GradeSubmissionPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 1. Fetch submission details
  const { data: submission } = await supabase
    .from("submissions")
    .select(`
      *,
      profiles:student_id (full_name, email, avatar_url),
      tasks (title, description, requirements, programs(title))
    `)
    .eq("id", id)
    .single();

  if (!submission) {
    notFound();
  }

  // 2. Fetch existing evaluation if it exists (for re-grading)
  const { data: existingEval } = await supabase
    .from("evaluations")
    .select("*")
    .eq("submission_id", submission.id)
    .single();

  const studentName = submission.profiles?.full_name || "Unknown Student";
  const submittedDate = new Date(submission.submitted_at).toLocaleString();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div>
        <Link href="/evaluator/queue" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-4 w-fit">
          <ArrowLeft className="w-4 h-4" /> Back to Queue
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Evaluate Task</h1>
            <p className="text-muted-foreground mt-1">Reviewing submission from <span className="font-medium text-slate-900">{studentName}</span></p>
          </div>
          <Badge className={`w-fit ${submission.status === 'PENDING' ? 'bg-amber-100 text-amber-700 hover:bg-amber-100' : 'bg-slate-100 text-slate-700'}`}>
            Status: {submission.status}
          </Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-8 items-start">
        
        {/* Left Column: Context & Code Links */}
        <div className="lg:col-span-3 space-y-6">
          {/* Submission Links Card */}
          <Card className="border-indigo-100 shadow-sm">
            <CardHeader className="pb-4 bg-indigo-50/50 border-b border-indigo-50">
              <CardTitle className="text-lg flex items-center gap-2 text-indigo-900">
                Student Work
              </CardTitle>
              <CardDescription>Submitted on {submittedDate}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {submission.github_url ? (
                  <Button variant="outline" className="flex-1" render={<a href={submission.github_url} target="_blank" rel="noopener noreferrer" />}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    GitHub Repository
                  </Button>
                ) : (
                  <Button disabled variant="outline" className="flex-1">No GitHub Link</Button>
                )}
                
                {submission.live_url ? (
                  <Button variant="outline" className="flex-1 border-indigo-200 text-indigo-700 hover:bg-indigo-50" render={<a href={submission.live_url} target="_blank" rel="noopener noreferrer" />}>
                    <Globe className="w-4 h-4 mr-2" /> View Live Deploy <ExternalLink className="w-3 h-3 ml-2 opacity-50" />
                  </Button>
                ) : (
                  <Button disabled variant="outline" className="flex-1">No Live Deploy Link</Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Task Details Card */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <Badge variant="secondary" className="mb-2">{submission.tasks?.programs?.title}</Badge>
                  <CardTitle className="text-xl">{submission.tasks?.title}</CardTitle>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-900">100</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Max Points</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 text-sm text-slate-700">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2 uppercase tracking-wider text-xs">Task Description</h3>
                <div className="prose prose-sm max-w-none text-slate-600 bg-slate-50 p-4 rounded-lg border">
                  {submission.tasks?.description || "No description provided."}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-slate-900 mb-2 uppercase tracking-wider text-xs">Requirements & Rubric</h3>
                <div className="prose prose-sm max-w-none text-slate-600 bg-slate-50 p-4 rounded-lg border whitespace-pre-wrap">
                  {submission.tasks?.requirements || "No rubric provided. Grade based on code quality and functionality."}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Grading Form */}
        <div className="lg:col-span-2">
          <div className="sticky top-6">
            <Card className="border-emerald-100 shadow-md">
              <CardHeader className="bg-emerald-50/30 border-b border-emerald-50 pb-4">
                <CardTitle className="text-xl text-emerald-900">Grading Engine</CardTitle>
                <CardDescription>Evaluate the submission and provide feedback.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ReviewFormClient 
                  submissionId={submission.id} 
                  existingEval={existingEval} 
                />
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
}
