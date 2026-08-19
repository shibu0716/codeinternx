"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Loader2 } from "lucide-react";
import Script from "next/script";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentCheckoutProps {
  application: any;
  userEmail: string;
  userName: string;
}

export function PaymentCheckoutClient({ application, userEmail, userName }: PaymentCheckoutProps) {
  const router = useRouter();
  const [duration, setDuration] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const pricingMap: Record<number, number> = {
    1: 99,
    2: 199,
    3: 299,
    6: 499,
  };

  const currentPrice = pricingMap[duration];

  const handlePayment = async () => {
    setLoading(true);
    try {
      // 1. Create Order via Backend API
      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          applicationId: application.id,
          programId: application.program_id,
          duration: duration 
        }),
      });

      const orderData = await res.json();
      if (!res.ok) throw new Error(orderData.error || "Failed to create order");

      // 2. Initialize Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_YourKeyIdHere",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "CodeInternX",
        description: `Enrollment: ${application.programs?.title}`,
        order_id: orderData.id,
        handler: async function (response: any) {
          // 3. Verify Payment
          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                applicationId: application.id,
              }),
            });
            const verifyData = await verifyRes.json();
            
            if (verifyRes.ok && verifyData.success) {
              router.push(`/payment/success?orderId=${orderData.id}`);
            } else {
              router.push(`/payment/failed?reason=verification_failed`);
            }
          } catch (err) {
      console.error("Verification error:", err);
            router.push(`/payment/failed?reason=verification_error`);
          }
        },
        prefill: {
          name: userName,
          email: userEmail,
        },
        theme: {
          color: "#0f172a", // slate-900
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp = new (window as any).Razorpay(options);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rzp.on("payment.failed", function (response: any) {
        setLoading(false);
        router.push(`/payment/failed?reason=${response.error.reason}`);
      });
      rzp.open();

    } catch (error: any) {
      alert(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Complete Your Enrollment</h1>
        <p className="text-muted-foreground">Review your program details and securely complete your payment.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Col: Order Summary */}
        <Card className="border-slate-200">
          <CardHeader className="bg-slate-50 border-b pb-4">
            <CardDescription className="uppercase tracking-wider text-xs font-bold text-slate-500 mb-1">Application Summary</CardDescription>
            <CardTitle className="text-xl">{application.programs?.title}</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex justify-between items-center text-sm border-b pb-4">
              <span className="text-muted-foreground">Application ID</span>
              <span className="font-mono font-medium">{application.application_id}</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b pb-4">
              <span className="text-muted-foreground">Student Name</span>
              <span className="font-medium">{userName}</span>
            </div>
            
            <div className="pt-2">
              <label className="text-sm font-medium mb-2 block">Select Internship Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value={1}>1 Month</option>
                <option value={2}>2 Months</option>
                <option value={3}>3 Months</option>
                <option value={6}>6 Months</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Right Col: Price Breakdown & CTA */}
        <Card className="border-slate-200 bg-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg">Payment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Program Fee</span>
                <span>₹{currentPrice}</span>
              </div>
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span>- ₹0</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Taxes & Fees</span>
                <span>₹0</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-slate-200 font-bold text-lg">
                <span>Total Payable</span>
                <span>₹{currentPrice}</span>
              </div>
            </div>

            <Button onClick={handlePayment} disabled={loading} className="w-full h-12 text-md" size="lg">
              {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <ShieldCheck className="w-5 h-5 mr-2" />}
              {loading ? "Initializing..." : `Pay ₹${currentPrice} Securely`}
            </Button>

            <div className="text-center text-xs text-muted-foreground space-y-2 mt-4">
              <p>Secure payment powered by Razorpay.</p>
              <p>By continuing, you agree to our <a href="#" className="underline">Terms & Conditions</a> and <a href="#" className="underline">Refund Policy</a>.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
