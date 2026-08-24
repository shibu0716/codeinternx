import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, Clock, Trophy } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const metadata = {
  title: "My Internships | CodeInternX",
};

export default async function MyInternshipsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch all enrollments for the user
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("*, programs(*), applications(status)")
    .eq("student_id", user.id)
    .order("enrolled_at", { ascending: false });

  // Only show internships where the application has been explicitly ENROLLED (Offer Accepted)
  const activeEnrollments = enrollments?.filter((e: any) => e.applications?.status === 'ENROLLED') || [];

  if (activeEnrollments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
          <BookOpen className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">No Internships Yet</h1>
        <p className="text-muted-foreground max-w-md">
          You haven't enrolled in any internships or courses yet. Browse our catalog to start your journey!
        </p>
        <Link href={`/internships`}>
          <Button size="lg" className="mt-4">Browse Catalog</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Internships</h1>
        <p className="text-muted-foreground mt-1">Manage and track all your enrolled programs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeEnrollments.map((enrollment) => (
          <Card key={enrollment.id} className="flex flex-col h-full border-primary/10 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="default">
                  Active
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(enrollment.enrolled_at).toLocaleDateString()}
                </span>
              </div>
              <CardTitle className="text-xl leading-tight mb-1">{enrollment.programs?.title}</CardTitle>
              <CardDescription className="line-clamp-2">{enrollment.programs?.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>{enrollment.duration_months} Months</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span className="capitalize">{enrollment.programs?.level.toLowerCase()}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs font-medium">
                  <span>Progress</span>
                  <span>{enrollment.progress_percentage}%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all" style={{ width: `${enrollment.progress_percentage}%` }}></div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-4 border-t">
              <Link href={`/dashboard/tasks`} className="w-full">
                <Button className="w-full" variant="outline">View Tasks</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
