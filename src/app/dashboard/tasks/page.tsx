import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, AlertCircle, FileCode2, Lock } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export const metadata = {
  title: "My Tasks & Submissions | CodeInternX",
};

const mockTasks = [
  {
    id: "uuid-task-1",
    title: "Task 1: HTML & CSS Fundamentals",
    status: "APPROVED",
    dueDate: "2026-08-01",
    score: 92,
    submittedAt: "2026-07-28"
  },
  {
    id: "uuid-task-2",
    title: "Task 2: React Components & Hooks",
    status: "CHANGES_REQUESTED",
    dueDate: "2026-08-15",
    score: null,
    submittedAt: "2026-08-12"
  },
  {
    id: "uuid-task-3",
    title: "Task 3: Backend APIs with Node.js",
    status: "PENDING",
    dueDate: "2026-08-25",
    score: null,
    submittedAt: null
  },
  {
    id: "uuid-task-4",
    title: "Final Project: Full E-Commerce Platform",
    status: "PENDING",
    dueDate: "2026-09-10",
    score: null,
    submittedAt: null
  }
];

export default async function TasksPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null; 
  }

  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("*, programs(title, slug)")
    .eq("student_id", user.id)
    .order("enrolled_at", { ascending: false })
    .limit(1)
    .single();

  if (enrollment && enrollment.payment_status !== "SUCCESS") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
          <Lock className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Payment Required</h1>
        <p className="text-muted-foreground max-w-md">
          You must complete your payment for <strong>{enrollment.programs?.title}</strong> before accessing tasks.
        </p>
        <Link href={`/internships/${enrollment.programs?.slug}`}>
          <Button size="lg" className="mt-4">Complete Payment</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tasks & Submissions</h1>
        <p className="text-muted-foreground mt-1">Manage your assignments and view evaluation feedback.</p>
      </div>

      <div className="grid gap-6">
        {mockTasks.map((task) => (
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
    </div>
  );
}
