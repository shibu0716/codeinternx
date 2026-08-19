import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const metadata = {
  title: "My Applications | CodeInternX",
};

export default async function StudentApplicationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch all applications for the user
  const { data: applications } = await supabase
    .from("applications")
    .select("*, programs(*)")
    .eq("student_id", user.id)
    .order("created_at", { ascending: false });

  if (!applications || applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
          <FileText className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">No Applications Found</h1>
        <p className="text-muted-foreground max-w-md">
          You haven't applied to any programs yet. Browse our catalog to find the right track for you.
        </p>
        <Link href={`/internships`}>
          <Button size="lg" className="mt-4">Browse Internships</Button>
        </Link>
      </div>
    );
  }

  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'PENDING':
      case 'UNDER_REVIEW':
        return { color: 'bg-amber-100 text-amber-800 border-amber-200', icon: Clock, label: 'Under Review' };
      case 'APPROVED':
        return { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle2, label: 'Approved - Action Required' };
      case 'REJECTED':
        return { color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle, label: 'Not Accepted' };
      case 'PAID':
      case 'ENROLLED':
        return { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: CheckCircle2, label: 'Enrolled' };
      default:
        return { color: 'bg-slate-100 text-slate-800 border-slate-200', icon: AlertCircle, label: status };
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Applications</h1>
        <p className="text-muted-foreground mt-1">Track the status of your internship applications.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {applications.map((app) => {
          const config = getStatusConfig(app.status);
          const Icon = config.icon;

          return (
            <Card key={app.id} className="flex flex-col h-full border-slate-200 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-3">
                  <Badge className={`${config.color}`} variant="outline">
                    <Icon className="w-3 h-3 mr-1" /> {config.label}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">{app.application_id}</span>
                </div>
                <CardTitle className="text-xl leading-tight mb-1">{app.programs?.title}</CardTitle>
                <CardDescription>Submitted on {new Date(app.created_at).toLocaleDateString()}</CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 space-y-4">
                <div className="bg-slate-50 rounded-lg p-4 text-sm border border-slate-100">
                  {app.status === 'PENDING' || app.status === 'UNDER_REVIEW' ? (
                    <p className="text-slate-600">Your application is currently being reviewed by our admissions team. We usually respond within 24-48 hours.</p>
                  ) : app.status === 'APPROVED' ? (
                    <p className="text-slate-900 font-medium">Congratulations! Your application has been approved. Please complete your enrollment by submitting the program fee.</p>
                  ) : app.status === 'REJECTED' ? (
                    <p className="text-slate-600">Unfortunately, we could not proceed with your application at this time. We encourage you to apply again in the next cohort.</p>
                  ) : (
                    <p className="text-slate-600">You are fully enrolled in this program. Check your dashboard for tasks and progress.</p>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="pt-4 border-t">
                {app.status === 'APPROVED' ? (
                  <Link href={`/payment?applicationId=${app.id}`} className="w-full">
                    <Button className="w-full bg-slate-900 text-white hover:bg-slate-800">
                      Proceed to Payment
                    </Button>
                  </Link>
                ) : app.status === 'PAID' || app.status === 'ENROLLED' ? (
                  <Link href={`/dashboard/internships`} className="w-full">
                    <Button className="w-full" variant="outline">
                      Go to Internships
                    </Button>
                  </Link>
                ) : null}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
