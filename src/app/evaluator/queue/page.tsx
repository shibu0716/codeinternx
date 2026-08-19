import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Clock } from "lucide-react";

export const metadata = {
  title: "Submission Queue | Evaluator | CodeInternX",
};

export default async function EvaluatorQueuePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch all pending submissions
  const { data: queue } = await supabase
    .from("submissions")
    .select(`
      id, 
      status, 
      submitted_at,
      profiles (full_name),
      tasks (title, programs (title))
    `)
    .eq("status", "PENDING")
    .order("submitted_at", { ascending: true }); // Oldest first

  const pendingSubmissions = queue || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Submission Queue</h1>
        <p className="text-muted-foreground mt-1">Review and grade pending student task submissions.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" /> Pending Review ({pendingSubmissions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead>Student</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Task Title</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingSubmissions.length > 0 ? (
                  pendingSubmissions.map((sub: any) => {
                    const submittedDate = new Date(sub.submitted_at);
                    const now = new Date();
                    const diffHours = Math.floor((now.getTime() - submittedDate.getTime()) / (1000 * 60 * 60));
                    
                    return (
                      <TableRow key={sub.id}>
                        <TableCell className="font-medium">{sub.profiles?.full_name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-normal text-xs">
                            {sub.tasks?.programs?.title || "Unknown Program"}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate" title={sub.tasks?.title}>
                          {sub.tasks?.title}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm">{submittedDate.toLocaleDateString()}</span>
                            <span className={`text-xs ${diffHours > 48 ? 'text-red-500 font-semibold' : 'text-slate-500'}`}>
                              {diffHours}h ago
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700" asChild>
                            <Link href={`/evaluator/review/${sub.id}`}>Review</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                      The queue is completely empty. No pending submissions to review.
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
