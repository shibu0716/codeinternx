import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, CreditCard, Download, ExternalLink, IndianRupee } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { PaymentsTableClient } from "./PaymentsTableClient";

export const metadata = {
  title: "Payment Tracking | CodeInternX Admin",
};

export default async function AdminPaymentsPage() {
  const supabase = await createClient();

  // Fetch actual payments table
  const { data: payments, error } = await supabase
    .from("payments")
    .select(`
      id,
      razorpay_payment_id,
      razorpay_order_id,
      amount,
      currency,
      status,
      payment_method,
      created_at,
      profiles ( full_name, email )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching payments:", error);
  }

  const totalRevenue = payments?.filter(p => p.status === 'SUCCESS').reduce((sum, p) => sum + Number(p.amount), 0) || 0;
  const successfulPayments = payments?.filter(p => p.status === 'SUCCESS').length || 0;
  const failedPayments = payments?.filter(p => p.status === 'FAILED').length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Payment Tracking</h1>
        <p className="text-muted-foreground mt-1">Monitor all completed, failed, and refunded transactions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-slate-200 text-sm font-medium">Total Captured Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-center">
              <IndianRupee className="w-6 h-6 mr-1 opacity-80" /> {totalRevenue.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-green-400 mt-2">Based on successful payments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">Successful Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{successfulPayments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">Failed Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">{failedPayments}</div>
            <p className="text-xs text-muted-foreground mt-2">Requires follow-up</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <PaymentsTableClient payments={payments || []} />
        </CardContent>
      </Card>
    </div>
  );
}
