"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Search, Eye, CheckCircle, XCircle, Clock, ExternalLink } from "lucide-react";
import { verifyPayment, rejectPayment, requestResubmission } from "@/actions/payments";
import { toast } from "sonner";

export function PaymentsTableClient({ payments }: { payments: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<any | null>(null);
  const [actionModal, setActionModal] = useState<"verify" | "reject" | "resubmit" | null>(null);
  const [reason, setReason] = useState("");

  const filteredPayments = payments.filter((payment) => {
    const query = searchQuery.toLowerCase();
    return (
      payment.transaction_id?.toLowerCase().includes(query) ||
      payment.profiles?.full_name?.toLowerCase().includes(query) ||
      payment.profiles?.email?.toLowerCase().includes(query)
    );
  });

  const handleAction = async () => {
    if (!selectedPayment || !actionModal) return;
    
    if ((actionModal === "reject" || actionModal === "resubmit") && !reason.trim()) {
      toast.error("Please provide a reason.");
      return;
    }

    setLoading(selectedPayment.id);
    try {
      if (actionModal === "verify") {
        await verifyPayment(selectedPayment.id);
        toast.success("Payment verified successfully.");
      } else if (actionModal === "reject") {
        await rejectPayment(selectedPayment.id, reason);
        toast.success("Payment rejected.");
      } else if (actionModal === "resubmit") {
        await requestResubmission(selectedPayment.id, reason);
        toast.success("Resubmission requested.");
      }
      setSelectedPayment(null);
      setActionModal(null);
      setReason("");
    } catch (error: any) {
      toast.error(error.message || "Action failed.");
    } finally {
      setLoading(null);
    }
  };

  const openModal = (payment: any, action: "verify" | "reject" | "resubmit") => {
    setSelectedPayment(payment);
    setActionModal(action);
    setReason("");
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING_VERIFICATION":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300"><Clock className="w-3 h-3 mr-1"/> PENDING</Badge>;
      case "VERIFIED":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300"><CheckCircle className="w-3 h-3 mr-1"/> VERIFIED</Badge>;
      case "REJECTED":
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300"><XCircle className="w-3 h-3 mr-1"/> REJECTED</Badge>;
      case "RESUBMISSION_REQUIRED":
        return <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">RESUBMIT</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            type="search"
            placeholder="Search by transaction ID, name..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-semibold text-slate-900">Student</TableHead>
              <TableHead className="font-semibold text-slate-900">Transaction ID</TableHead>
              <TableHead className="font-semibold text-slate-900">Amount</TableHead>
              <TableHead className="font-semibold text-slate-900 hidden md:table-cell">Submitted At</TableHead>
              <TableHead className="font-semibold text-slate-900">Status</TableHead>
              <TableHead className="font-semibold text-slate-900 text-right">Proof</TableHead>
              <TableHead className="font-semibold text-slate-900 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.length > 0 ? (
              filteredPayments.map((payment) => (
                <TableRow key={payment.id} className="hover:bg-slate-50/50">
                  <TableCell>
                    <div className="font-medium text-slate-900">{payment.profiles?.full_name}</div>
                    <div className="text-xs text-muted-foreground">{payment.profiles?.email}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-mono text-xs font-semibold text-slate-900">{payment.transaction_id}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{payment.payment_method}</div>
                  </TableCell>
                  <TableCell className="font-medium">
                    ₹{payment.amount}
                  </TableCell>
                  <TableCell className="text-slate-600 text-sm hidden md:table-cell">
                    {formatDate(payment.submitted_at)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(payment.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    {payment.proof_file_url ? (
                      <a href={payment.proof_file_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs font-medium text-blue-600 hover:underline bg-blue-50 px-2 py-1 rounded-md">
                        <ExternalLink className="w-3 h-3 mr-1" /> View
                      </a>
                    ) : (
                      <span className="text-xs text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {payment.status === 'PENDING_VERIFICATION' && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-green-600 border-green-200 hover:bg-green-50"
                          onClick={() => openModal(payment, 'verify')}
                          disabled={loading === payment.id}
                        >
                          Verify
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => openModal(payment, 'reject')}
                          disabled={loading === payment.id}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                  No payment records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!actionModal} onOpenChange={(open) => !open && setActionModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionModal === 'verify' && "Verify Payment"}
              {actionModal === 'reject' && "Reject Payment"}
              {actionModal === 'resubmit' && "Request Resubmission"}
            </DialogTitle>
            <DialogDescription>
              {actionModal === 'verify' 
                ? `You are about to verify the payment of ₹${selectedPayment?.amount} for ${selectedPayment?.profiles?.full_name}. This will approve their enrollment step.`
                : `You are about to ${actionModal} this payment. Please provide a reason to the student.`}
            </DialogDescription>
          </DialogHeader>

          {(actionModal === 'reject' || actionModal === 'resubmit') && (
            <div className="mt-4">
              <label className="text-sm font-medium mb-2 block">Reason <span className="text-red-500">*</span></label>
              <Textarea 
                placeholder="e.g., The screenshot is blurry, or we could not find this transaction ID."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          )}

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setActionModal(null)}>Cancel</Button>
            <Button 
              onClick={handleAction} 
              disabled={loading === selectedPayment?.id}
              className={
                actionModal === 'verify' ? "bg-green-600 hover:bg-green-700" :
                actionModal === 'reject' ? "bg-red-600 hover:bg-red-700" : ""
              }
            >
              {loading === selectedPayment?.id ? "Processing..." : "Confirm Action"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
