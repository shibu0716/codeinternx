import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Star, User } from "lucide-react";
import Image from "next/image";

export const metadata = {
  title: "Leaderboard | Dashboard | CodeInternX",
};

export default async function LeaderboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Find the student's active program
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("program_id, programs(title)")
    .eq("student_id", user.id)
    .order("enrolled_at", { ascending: false })
    .limit(1)
    .single();

  if (!enrollment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Trophy className="w-16 h-16 text-slate-300 mb-4" />
        <h2 className="text-xl font-bold">No Active Program</h2>
        <p className="text-muted-foreground mt-2">Enroll in a program to see the leaderboard.</p>
      </div>
    );
  }

  // Fetch all students in this program and their evaluations
  // Since we don't have a direct leaderboard endpoint, we construct it:
  // 1. Get all enrollments for this program
  const { data: peerEnrollments } = await supabase
    .from("enrollments")
    .select("student_id, profiles(full_name, avatar_url)")
    .eq("program_id", enrollment.program_id);

  const students: any[] = peerEnrollments || [];
  const studentIds = students.map((s) => s.student_id);

  // 2. Get all evaluations for these students
  const { data: evaluations } = await supabase
    .from("evaluations")
    .select("overall_score, submissions!inner(student_id)")
    .in("submissions.student_id", studentIds);

  const evals = evaluations || [];

  // 3. Aggregate scores
  const leaderboardStats = students.map((s) => {
    const studentEvals = evals.filter(e => (e.submissions as any)?.student_id === s.student_id);
    const completedTasks = studentEvals.length;
    const avgScore = completedTasks > 0 
      ? Math.round(studentEvals.reduce((acc, curr) => acc + curr.overall_score, 0) / completedTasks) 
      : 0;
    
    // Sort logic: Primary by Avg Score, Secondary by Tasks Completed
    const sortScore = (avgScore * 1000) + completedTasks;

    return {
      id: s.student_id,
      name: s.profiles?.full_name || "Unknown Student",
      avatar: s.profiles?.avatar_url,
      avgScore,
      completedTasks,
      sortScore
    };
  }).filter(s => s.completedTasks > 0) // Only show students who have completed at least one task
    .sort((a, b) => b.sortScore - a.sortScore)
    .slice(0, 50);

  const myRank = leaderboardStats.findIndex(s => s.id === user.id) + 1;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Program Leaderboard</h1>
        <p className="text-muted-foreground mt-1">See how you rank against peers in {(enrollment.programs as any)?.title}.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" /> Top Performers
              </CardTitle>
              <CardDescription>Rankings based on average evaluation scores and task completion.</CardDescription>
            </div>
            {myRank > 0 && (
              <div className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2">
                <Star className="w-4 h-4 fill-indigo-500 text-indigo-500" />
                Your Rank: #{myRank}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {leaderboardStats.length > 0 ? (
              leaderboardStats.map((student, index) => {
                const isMe = student.id === user.id;
                const rank = index + 1;
                let rankStyle = "text-slate-500 bg-slate-100";
                if (rank === 1) rankStyle = "text-amber-600 bg-amber-100 border-amber-200";
                else if (rank === 2) rankStyle = "text-slate-600 bg-slate-200 border-slate-300";
                else if (rank === 3) rankStyle = "text-orange-700 bg-orange-100 border-orange-200";

                return (
                  <div key={student.id} className={`flex items-center justify-between py-4 px-2 rounded-lg transition-colors ${isMe ? 'bg-indigo-50/50 -mx-2 px-4' : 'hover:bg-slate-50'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border ${rankStyle}`}>
                        {rank}
                      </div>
                      <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 overflow-hidden shrink-0">
                        {student.avatar ? (
                          <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 flex items-center gap-2">
                          {student.name} {isMe && <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-bold tracking-wider uppercase">You</span>}
                        </p>
                        <p className="text-xs text-slate-500">{student.completedTasks} Tasks Completed</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-emerald-600">{student.avgScore}</div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Avg Score</div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-slate-500">
                No tasks evaluated yet. Be the first to submit!
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
