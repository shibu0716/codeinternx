"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Award, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { issueCertificate } from "@/actions/admin";

interface Enrollment {
  id: string;
  student_id: string;
  program_id: string;
  profiles: { full_name: string; email: string };
  programs: { title: string };
}

export function IssueCertificateModal({ enrollments }: { enrollments: Enrollment[] }) {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedId) {
      toast.error("Please select a student enrollment");
      return;
    }

    const enrollment = enrollments.find(e => e.id === selectedId);
    if (!enrollment) return;

    setLoading(true);
    try {
      const res = await issueCertificate(enrollment.student_id, enrollment.program_id, enrollment.id);
      if (res.success) {
        toast.success(`Certificate Issued: ${res.certificateId}`);
        setOpen(false);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to issue certificate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2">
          <Award className="w-4 h-4 mr-2" />
          Issue New Certificate
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Issue Certificate</DialogTitle>
          <DialogDescription>
            Select a student to officially issue a completion certificate.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Select Enrolled Student</Label>
            <Select value={selectedId} onValueChange={(val) => { if (val) setSelectedId(val); }}>
              <SelectTrigger>
                <SelectValue placeholder="Select student & program..." />
              </SelectTrigger>
              <SelectContent>
                {enrollments.length === 0 ? (
                  <div className="p-2 text-sm text-slate-500">No eligible enrollments found.</div>
                ) : (
                  enrollments.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.profiles?.full_name} - {e.programs?.title}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500 mt-2">
              Only active enrollments without an existing certificate are shown.
            </p>
          </div>
          
          <Button onClick={handleSubmit} disabled={loading || !selectedId} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Award className="w-4 h-4 mr-2" />}
            Generate & Issue Certificate
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
