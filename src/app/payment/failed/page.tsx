"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { XCircle, RefreshCcw } from "lucide-react";
import { Suspense } from "react";

function FailedContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason") || "An unknown error occurred.";

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10" />
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Payment Failed</h1>
        <p className="text-muted-foreground mt-2 text-sm max-w-sm mx-auto">We couldn&apos;t process your payment. This might be due to a network issue, insufficient funds, or a bank decline.</p>
        
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm text-center text-red-600 font-medium">
          {reason.replace(/_/g, ' ')}
        </div>

        <div className="flex flex-col gap-3 pt-4 border-t border-slate-100 mt-6">
          <Link href="/dashboard/applications" className="w-full">
            <Button className="w-full h-12">
              <RefreshCcw className="w-4 h-4 mr-2" /> Try Again
            </Button>
          </Link>
          <Link href={`/support`} className="w-full">
            <Button variant="outline" className="w-full h-12">
              Contact Support
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center">Loading...</div>}>
      <FailedContent />
    </Suspense>
  );
}
