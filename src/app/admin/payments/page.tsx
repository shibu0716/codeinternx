import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, IndianRupee } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { PaymentsTableClient } from "./PaymentsTableClient";

export const metadata = {
  title: "Payment Verification | CodeInternX Admin",
};

export default async function AdminPaymentsPage() {
  const supabase = await createClient();

  // Fetch payments with manual payment schema
  const { data: payments, error } = await supabase
    .from("payments")
    .select(`
      id,
      transaction_id,
      amount,
      currency,
      status,
      payment_method,
      proof_file_url,
      submitted_at,
      profiles ( full_name, email )
    `)
    .order("submitted_at", { ascending: false });

  if (error) {
    console.error("Error fetching payments:", error);
  }

  const pendingPayments = payments?.filter(p => p.status === 'PENDING_VERIFICATION').length || 0;
  const verifiedPayments = payments?.filter(p => p.status === 'VERIFIED').length || 0;
  const rejectedPayments = payments?.filter(p => p.status === 'REJECTED' || p.status === 'RESUBMISSION_REQUIRED').length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Payment Verification</h1>
        <p className="text-muted-foreground mt-1">Review student payment proofs and manually verify transactions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-amber-600 to-amber-500 text-white shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm font-medium">Pending Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-center">
              {pendingPayments}
            </div>
            <p className="text-xs text-amber-100 mt-2">Requires admin action</p>
          </CardContent>
        </Card>
        <Card className="border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-green-700 text-sm font-medium">Verified Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">{verifiedPayments}</div>
          </CardContent>
        </Card>
        <Card className="border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-red-700 text-sm font-medium">Rejected / Resubmissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{rejectedPayments}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle>Submitted Payments</CardTitle>
          <CardDescription>Click to view proof and verify payment.</CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <PaymentsTableClient payments={payments || []} />
        </CardContent>
      </Card>
    </div>
  );
}
