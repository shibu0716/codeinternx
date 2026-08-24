"use client";

import { useState } from "react";
import { generateAdminOTP } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle2, Loader2 } from "lucide-react";

export function ResendOTPButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleResend = async () => {
    setStatus("loading");
    try {
      const result = await generateAdminOTP();
      if (result.error) {
        setStatus("error");
        setMessage(result.error);
      } else {
        setStatus("sent");
        setMessage("Code sent to your email!");
        setTimeout(() => setStatus("idle"), 5000);
      }
    } catch (e) {
      setStatus("error");
      setMessage("An unexpected error occurred.");
    }
  };

  return (
    <div className="mt-6 flex flex-col items-center">
      <Button
        type="button"
        variant="outline"
        onClick={handleResend}
        disabled={status === "loading" || status === "sent"}
        className="text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        {status === "loading" ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</>
        ) : status === "sent" ? (
          <><CheckCircle2 className="w-4 h-4 mr-2 text-green-500" /> Sent</>
        ) : (
          <><Mail className="w-4 h-4 mr-2" /> Resend Code</>
        )}
      </Button>
      {message && (
        <p className={`text-xs mt-2 ${status === "error" ? "text-red-500" : "text-green-500"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
