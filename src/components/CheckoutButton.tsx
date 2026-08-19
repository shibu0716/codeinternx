"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface CheckoutButtonProps {
  programId: string;
  price: number;
  duration: number;
  userEmail?: string;
  userPhone?: string;
  userName?: string;
}

export function CheckoutButton({ programId, price, duration, userEmail, userPhone, userName }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);

    try {
      // 1. Create Order on Backend
      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ programId, duration }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          router.push(`/login?redirect=/internships/${programId}`);
          return;
        }
        throw new Error("Failed to create order");
      }

      const orderData = await res.json();

      // 2. Load Razorpay SDK
      const resLoad = await loadRazorpay();
      if (!resLoad) {
        alert("Razorpay SDK failed to load. Are you online?");
        setLoading(false);
        return;
      }

      // 3. Open Checkout Modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "test_key", // Frontend needs the public key
        amount: orderData.amount,
        currency: orderData.currency,
        name: "CodeInternX",
        description: "Internship Enrollment Fee",
        image: "https://codeinternx.com/codeinternx-logo.png",
        order_id: orderData.id,
        handler: async function (response: any) {
          // 4. Verify Payment Signature on Backend
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              programId: programId,
            }),
          });

          if (verifyRes.ok) {
            router.push("/dashboard?payment=success");
          } else {
            alert("Payment Verification Failed. Please contact support.");
          }
        },
        prefill: {
          name: userName || "",
          email: userEmail || "",
          contact: userPhone || "",
        },
        theme: {
          color: "#0f172a", // Primary brand color
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handlePayment} 
      disabled={loading}
      className="w-full text-md h-12"
    >
      {loading ? "Processing..." : `Pay ₹${price} to Enroll`}
    </Button>
  );
}
