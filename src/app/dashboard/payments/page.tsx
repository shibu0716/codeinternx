import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Receipt, FileText, Download, CheckCircle2, Clock, XCircle } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "My Payments | CodeInternX",
};

export default async function StudentPaymentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch payments/orders
  const { data: orders } = await supabase
    .from("orders")
    .select("*, programs(title)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
          <Receipt className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">No Payments Found</h1>
        <p className="text-muted-foreground max-w-md">
          You haven't made any payments yet. Once you enroll in a program, your receipts will appear here.
        </p>
        <Link href={`/dashboard/applications`}>
          <Button size="lg" className="mt-4">Check Applications</Button>
        </Link>
      </div>
    );
  }

  const getStatusDisplay = (status: string) => {
    switch(status) {
      case 'PAID':
        return <Badge className="bg-green-100 text-green-800 border-green-200" variant="outline"><CheckCircle2 className="w-3 h-3 mr-1"/> Paid</Badge>;
      case 'FAILED':
        return <Badge className="bg-red-100 text-red-800 border-red-200" variant="outline"><XCircle className="w-3 h-3 mr-1"/> Failed</Badge>;
      case 'PENDING':
      case 'CREATED':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200" variant="outline"><Clock className="w-3 h-3 mr-1"/> Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payment History</h1>
        <p className="text-muted-foreground mt-1">View your transactions and download receipts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <Card key={order.id} className="flex flex-col h-full border-slate-200 shadow-sm relative overflow-hidden">
            {order.status === 'PAID' && (
              <div className="absolute top-0 right-0 w-16 h-16 bg-green-50 rounded-bl-full z-0 flex items-start justify-end p-2 border-b border-l border-green-100">
                <CheckCircle2 className="w-5 h-5 text-green-600 relative top-1 right-1" />
              </div>
            )}
            
            <CardHeader className="pb-4 relative z-10">
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-xs text-muted-foreground truncate w-2/3">
                  {order.razorpay_order_id}
                </span>
                {getStatusDisplay(order.status)}
              </div>
              <CardTitle className="text-lg leading-tight mb-1">{order.programs?.title}</CardTitle>
              <CardDescription>{new Date(order.created_at).toLocaleString()}</CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-slate-900">₹{Number(order.amount).toLocaleString('en-IN')}</span>
                <span className="text-sm font-medium text-slate-500">{order.currency}</span>
              </div>
              
              <div className="pt-4 border-t border-slate-100 text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Application</span>
                  <span className="font-mono text-xs">{order.application_id.substring(0,8)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Method</span>
                  <span className="font-medium">Razorpay</span>
                </div>
              </div>
            </CardContent>
            
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
              {order.status === 'PAID' ? (
                <>
                  <Link href={`/dashboard/internships`}>
                    <Button variant="outline" className="w-full text-xs" size="sm">
                      View Course
                    </Button>
                  </Link>
                  <Button variant="secondary" className="w-full text-xs" size="sm" onClick={() => {
                    // This would ideally generate a PDF receipt, but a browser print works for a basic version
                    alert('Receipt generation will be available soon.');
                  }}>
                    <Download className="w-3 h-3 mr-1" /> Receipt
                  </Button>
                </>
              ) : (
                <Link href={`/payment?applicationId=${order.application_id}`}>
                  <Button variant="outline" className="w-full text-xs" size="sm">
                    Retry Payment
                  </Button>
                </Link>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
