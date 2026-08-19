import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, CheckSquare, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export const metadata = {
  title: "Admin Dashboard | CodeInternX",
};

export default async function AdminPage() {
  const supabase = await createClient();

  // Fetch metrics in parallel
  const [
    { count: studentsCount },
    { count: programsCount },
    { count: pendingEvalsCount },
    { data: ordersData },
    { data: recentSubmissions },
    { data: recentEnrollments }
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "STUDENT"),
    supabase.from("programs").select("*", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("submissions").select("*", { count: "exact", head: true }).eq("status", "PENDING"),
    supabase.from("orders").select("amount, created_at").eq("status", "PAID"),
    supabase.from("submissions")
      .select(`
        id,
        submitted_at,
        profiles!inner ( full_name ),
        tasks!inner ( title )
      `)
      .eq("status", "PENDING")
      .order("submitted_at", { ascending: false })
      .limit(5),
    supabase.from("enrollments")
      .select(`
        id,
        enrolled_at,
        profiles!inner ( full_name ),
        programs!inner ( title )
      `)
      .order("enrolled_at", { ascending: false })
      .limit(5)
  ]);

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thisWeek = new Date(today);
  thisWeek.setDate(today.getDate() - today.getDay());
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  let totalRevenue = 0;
  let todayRevenue = 0;
  let weekRevenue = 0;
  let monthRevenue = 0;

  ordersData?.forEach(order => {
    const amount = Number(order.amount);
    totalRevenue += amount;
    
    const orderDate = new Date(order.created_at);
    if (orderDate >= today) todayRevenue += amount;
    if (orderDate >= thisWeek) weekRevenue += amount;
    if (orderDate >= thisMonth) monthRevenue += amount;
  });

  const formatCurrency = (val: number) => new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);

  // Helper to format relative time
  const getRelativeTime = (dateString: string) => {
    const diff = new Date().getTime() - new Date(dateString).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours} hours ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Platform overview and recent activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentsCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Registered users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Programs</CardTitle>
            <BookOpen className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{programsCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Published courses/internships</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Pending Evaluations</CardTitle>
            <CheckSquare className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingEvalsCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Requires immediate attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground mt-1">From successful orders</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-50 border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Today's Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{formatCurrency(todayRevenue)}</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-50 border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">This Week's Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{formatCurrency(weekRevenue)}</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-50 border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">This Month's Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{formatCurrency(monthRevenue)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="col-span-1 flex flex-col">
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
            <CardDescription>Submissions waiting for evaluation</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="space-y-4 flex-1">
              {recentSubmissions && recentSubmissions.length > 0 ? (
                recentSubmissions.map((sub: any, i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium text-sm">{sub.profiles?.full_name || "Unknown Student"}</p>
                      <p className="text-xs text-muted-foreground">{sub.tasks?.title || "Unknown Task"}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-muted-foreground">{getRelativeTime(sub.submitted_at)}</span>
                      <Link href={`/admin/evaluations/${sub.id}`} className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-slate-900 h-9 px-3">
                        Review
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-8">
                  <CheckSquare className="w-8 h-8 text-slate-300 mb-2" />
                  <p className="text-sm text-slate-500">No pending submissions!</p>
                </div>
              )}
            </div>
            <div className="mt-4 pt-4 border-t mt-auto">
              <Link href="/admin/evaluations" className="flex w-full">
                <Button variant="ghost" className="w-full">
                  View All Pending
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 flex flex-col">
          <CardHeader>
            <CardTitle>Recent Enrollments</CardTitle>
            <CardDescription>Latest students who joined programs</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="space-y-4 flex-1">
              {recentEnrollments && recentEnrollments.length > 0 ? (
                recentEnrollments.map((enrollment: any, i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium text-sm">{enrollment.profiles?.full_name || "Unknown Student"}</p>
                      <p className="text-xs text-muted-foreground">{enrollment.programs?.title || "Unknown Program"}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border-emerald-200 uppercase">
                        Active
                      </span>
                      <p className="text-[10px] text-muted-foreground mt-1">{getRelativeTime(enrollment.enrolled_at)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-8">
                  <Users className="w-8 h-8 text-slate-300 mb-2" />
                  <p className="text-sm text-slate-500">No recent enrollments</p>
                </div>
              )}
            </div>
            <div className="mt-4 pt-4 border-t mt-auto">
              <Link href="/admin/students" className="flex w-full">
                <Button variant="ghost" className="w-full">
                  Manage Students
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
