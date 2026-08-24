"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import { acceptOfferLetter } from "@/actions/student";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function AcceptOfferButton({ applicationId }: { applicationId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAccept = async () => {
    setLoading(true);
    try {
      await acceptOfferLetter(applicationId);
      toast.success("Offer Accepted successfully! Welcome to CodeInternX.");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to accept offer letter.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleAccept} 
      disabled={loading}
      className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-medium px-8"
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
      ) : (
        <CheckCircle2 className="w-5 h-5 mr-2" />
      )}
      Accept Offer & Enroll
    </Button>
  );
}
