import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, CreditCard, Download, ExternalLink, IndianRupee } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Payments & Enrollments | Admin",
};

export default async function AdminPaymentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "SUPER_ADMIN" && profile?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Fetch orders
  const { data: orders } = await supabase
    .from("orders")
    .select("*, profiles(full_name), programs(title)")
    .order("created_at", { ascending: false });

  const totalRevenue = orders?.filter(o => o.status === 'PAID').reduce((sum, o) => sum + Number(o.amount), 0) || 0;
  const successfulEnrollments = orders?.filter(o => o.status === 'PAID').length || 0;
  const failedTransactions = orders?.filter(o => o.status === 'FAILED').length || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Payments</h1>
          <p className="text-muted-foreground mt-1">Track Razorpay transactions and student enrollments.</p>
        </div>
        <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Export CSV</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-slate-200 text-sm font-medium">Total Revenue (30d)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-center">
              <IndianRupee className="w-6 h-6 mr-1 opacity-80" /> {totalRevenue.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-green-400 mt-2">Based on paid orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">Successful Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{successfulEnrollments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">Failed Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">{failedTransactions}</div>
            <p className="text-xs text-muted-foreground mt-2">Requires follow-up</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Live feed of Razorpay payments.</CardDescription>
          <div className="pt-4 max-w-md relative">
            <Search className="absolute left-3 top-7 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search by Order ID or email..." className="pl-9" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md divide-y">
            {orders && orders.length > 0 ? orders.map((tx) => (
              <div key={tx.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-md shrink-0 mt-1 ${tx.status === 'PAID' ? 'bg-green-100 text-green-700' : tx.status === 'FAILED' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-slate-900">{tx.profiles?.full_name || 'Unknown User'}</span>
                      {tx.status === "PAID" ? (
                        <Badge className="bg-green-100 text-green-700 border-green-200" variant="outline">PAID</Badge>
                      ) : tx.status === "FAILED" ? (
                        <Badge variant="destructive" className="text-xs">FAILED</Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs bg-slate-100">{tx.status}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-700">{tx.programs?.title}</p>
                    <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                      <span className="font-mono">{tx.razorpay_order_id}</span>
                      <span>{new Date(tx.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <span className="font-bold text-lg flex items-center">
                    <IndianRupee className="w-4 h-4 mr-0.5" /> {Number(tx.amount).toLocaleString('en-IN')}
                  </span>
                  <a href={`https://dashboard.razorpay.com/app/orders/${tx.razorpay_order_id}`} target="_blank" rel="noreferrer">
                    <Button variant="ghost" size="sm" className="text-xs text-blue-600 hover:text-blue-700">
                      View in Razorpay <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </a>
                </div>
              </div>
            )) : (
              <div className="p-8 text-center text-muted-foreground">No transactions found.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
