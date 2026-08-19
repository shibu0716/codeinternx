"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IndianRupee, CreditCard, RefreshCcw, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { initiateRefund } from "@/actions/admin";

export function PaymentsTableClient({ payments }: { payments: any[] }) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleRefund = async (paymentId: string) => {
    if (!confirm("Are you sure you want to initiate a full refund for this payment?")) return;
    
    setLoading(paymentId);
    try {
      const res = await initiateRefund(paymentId);
      if (res.success) {
        toast.success("Refund initiated successfully");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to initiate refund");
    } finally {
      setLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS': return <Badge variant="outline" className="bg-emerald-100 text-emerald-800">SUCCESS</Badge>;
      case 'PENDING': return <Badge variant="outline" className="bg-amber-100 text-amber-800">PENDING</Badge>;
      case 'FAILED': return <Badge variant="outline" className="bg-red-100 text-red-800">FAILED</Badge>;
      case 'REFUNDED': return <Badge variant="outline" className="bg-purple-100 text-purple-800">REFUNDED</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!payments || payments.length === 0) {
    return <div className="text-center py-10 text-muted-foreground">No payments found.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
          <tr>
            <th className="px-4 py-3 font-medium">Txn ID (Razorpay)</th>
            <th className="px-4 py-3 font-medium">Customer</th>
            <th className="px-4 py-3 font-medium">Amount</th>
            <th className="px-4 py-3 font-medium">Method</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {payments.map((payment) => (
            <tr key={payment.id} className="hover:bg-slate-50/50">
              <td className="px-4 py-3">
                <div className="font-mono text-xs text-slate-900">{payment.razorpay_payment_id}</div>
                <div className="font-mono text-[10px] text-muted-foreground mt-1">{payment.razorpay_order_id}</div>
              </td>
              <td className="px-4 py-3">
                <div className="font-medium">{payment.profiles?.full_name}</div>
                <div className="text-xs text-muted-foreground">{payment.profiles?.email}</div>
              </td>
              <td className="px-4 py-3 font-semibold">
                <span className="flex items-center text-slate-900">
                  <IndianRupee className="w-3 h-3 mr-1" />
                  {payment.amount}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-600 capitalize flex items-center">
                <CreditCard className="w-3 h-3 mr-1.5" />
                {payment.payment_method || 'unknown'}
              </td>
              <td className="px-4 py-3">{getStatusBadge(payment.status)}</td>
              <td className="px-4 py-3 text-slate-500">
                {new Date(payment.created_at).toLocaleString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric',
                  hour: '2-digit', minute: '2-digit'
                })}
              </td>
              <td className="px-4 py-3 text-right">
                {payment.status === 'SUCCESS' ? (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleRefund(payment.id)}
                    disabled={loading === payment.id}
                  >
                    {loading === payment.id ? (
                      <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                    ) : (
                      <RefreshCcw className="w-3 h-3 mr-1.5" />
                    )}
                    Refund
                  </Button>
                ) : (
                  <span className="text-xs text-muted-foreground">No actions</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
