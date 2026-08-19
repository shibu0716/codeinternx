"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Award, CheckCircle2, Loader2, Layers } from "lucide-react";
import { toast } from "sonner";
import { bulkIssueCertificates } from "@/actions/admin";

export function BulkGenerateCertificatesButton({ eligibleEnrollments }: { eligibleEnrollments: any[] }) {
  const [loading, setLoading] = useState(false);

  const handleBulkIssue = async () => {
    if (eligibleEnrollments.length === 0) {
      toast.error("No eligible enrollments found");
      return;
    }

    const confirm = window.confirm(`Are you sure you want to generate certificates for ${eligibleEnrollments.length} eligible students?`);
    if (!confirm) return;

    setLoading(true);
    try {
      const payload = eligibleEnrollments.map(e => ({
        studentId: e.student_id,
        programId: e.program_id,
        enrollmentId: e.id
      }));

      const res = await bulkIssueCertificates(payload);
      if (res.success) {
        toast.success(`Generated ${res.generated} certificates successfully. ${res.failed > 0 ? `(${res.failed} failed)` : ''}`);
      } else {
        toast.error("Failed to generate certificates");
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleBulkIssue} 
      disabled={loading || eligibleEnrollments.length === 0} 
      className="bg-indigo-600 hover:bg-indigo-700 text-white"
    >
      {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Layers className="w-4 h-4 mr-2" />}
      Bulk Generate ({eligibleEnrollments.length})
    </Button>
  );
}
