"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { gradeSubmission } from "@/actions/evaluator";
import { toast } from "sonner";
import { Loader2, CheckCircle2, FileWarning } from "lucide-react";

export function ReviewFormClient({ submissionId, existingEval }: { submissionId: string, existingEval?: any }) {
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(existingEval?.total_score || 85);
  const [status, setStatus] = useState(existingEval ? "APPROVED" : "APPROVED"); // Default to approved

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    formData.append("submissionId", submissionId);
    formData.append("score", score.toString());
    formData.append("status", status);

    try {
      await gradeSubmission(formData);
      // Action redirects on success, but just in case:
      toast.success("Submission graded successfully");
    } catch (error) {
      toast.error("Failed to submit grade");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Score Slider */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Overall Score</Label>
          <span className={`text-2xl font-bold ${score >= 80 ? 'text-emerald-600' : score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
            {score}
          </span>
        </div>
        <Slider 
          defaultValue={[score]} 
          max={100} 
          step={1} 
          onValueChange={(vals) => setScore(Array.isArray(vals) ? vals[0] : (vals as number))}
          className="py-4"
        />
        <div className="flex justify-between text-xs text-slate-500">
          <span>0 (Fail)</span>
          <span>50 (Pass)</span>
          <span>100 (Perfect)</span>
        </div>
      </div>

      {/* Decision */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Final Decision</Label>
        <Select value={status} onValueChange={(val) => { if (val) setStatus(val); }} required>
          <SelectTrigger className={`border-2 ${status === 'APPROVED' ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-amber-200 bg-amber-50 text-amber-900'}`}>
            <SelectValue placeholder="Select Decision" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="APPROVED">
              <div className="flex items-center gap-2 font-medium text-emerald-700">
                <CheckCircle2 className="w-4 h-4" /> Approve Submission
              </div>
            </SelectItem>
            <SelectItem value="CHANGES_REQUESTED">
              <div className="flex items-center gap-2 font-medium text-amber-700">
                <FileWarning className="w-4 h-4" /> Request Changes
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          {status === 'APPROVED' 
            ? "Student will pass this task and receive their score." 
            : "Student will be required to fix issues and resubmit before proceeding."}
        </p>
      </div>

      {/* Feedback Textarea */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Constructive Feedback <span className="text-red-500">*</span></Label>
        <Textarea 
          name="feedback"
          placeholder="Provide detailed feedback on their code, architecture, and UI. Highlight what they did well and what needs improvement."
          required
          className="min-h-[200px] resize-y"
          defaultValue={existingEval?.feedback || ""}
        />
      </div>

      {/* Submit */}
      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
        {loading ? "Saving Evaluation..." : "Submit Final Grade"}
      </Button>

    </form>
  );
}
