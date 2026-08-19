import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

export default function PaymentPendingPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="w-10 h-10" />
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Payment Pending</h1>
        <p className="text-muted-foreground text-lg">
          We are waiting for confirmation from your bank.
        </p>

        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm text-center text-amber-700 font-medium">
          This usually takes a few minutes. If the amount was deducted from your account, please do not pay again.
        </div>

        <div className="flex flex-col gap-3 pt-4 border-t border-slate-100 mt-6">
          <Link href="/dashboard/payments" className="w-full">
            <Button className="w-full h-12">Check Status</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
