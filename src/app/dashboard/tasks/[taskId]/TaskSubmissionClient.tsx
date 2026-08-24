"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Globe, MessageSquare, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { submitTask } from "@/actions/submissions";

export function TaskSubmissionClient({ taskId, enrollmentId, initialStatus }: { taskId: string, enrollmentId: string, initialStatus: string }) {
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isApproved = initialStatus === 'APPROVED';

  const validateGithubUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.hostname === "github.com" && parsed.pathname.length > 1;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateGithubUrl(githubUrl)) {
      setError("Please provide a valid GitHub repository URL (e.g., https://github.com/username/repo)");
      return;
    }

    if (liveUrl && !liveUrl.startsWith("http")) {
      setError("Please provide a complete Live URL starting with http:// or https://");
      return;
    }

    setLoading(true);

    const result = await submitTask(taskId, enrollmentId, githubUrl, liveUrl, notes);
    
    if (result.success) {
      toast.success("Task revision submitted successfully! Evaluator will review it shortly.");
      setGithubUrl("");
      setLiveUrl("");
      setNotes("");
    } else {
      setError(result.error || "Failed to submit task.");
    }
    
    setLoading(false);
  };

  if (isApproved) {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-md text-green-800 text-sm">
        <CheckCircle2 className="w-5 h-5 inline-block mr-2" />
        This task has been approved. You cannot submit further revisions.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm flex items-start gap-2 border border-red-100">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="githubUrl" className="flex items-center gap-2">
          <GitHubLogoIcon className="w-4 h-4" /> GitHub Repository URL <span className="text-red-500">*</span>
        </Label>
        <Input 
          id="githubUrl" 
          placeholder="https://github.com/username/repo-name" 
          value={githubUrl}
          onChange={(e) => {
            setGithubUrl(e.target.value);
            if (error) setError(null);
          }}
          required 
          className={error && !validateGithubUrl(githubUrl) ? "border-red-300 focus-visible:ring-red-500" : ""}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="liveUrl" className="flex items-center gap-2">
          <Globe className="w-4 h-4" /> Live Deployment URL
        </Label>
        <Input 
          id="liveUrl" 
          placeholder="https://your-app.vercel.app" 
          value={liveUrl}
          onChange={(e) => setLiveUrl(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes" className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" /> Submission Notes
        </Label>
        <Textarea 
          id="notes" 
          placeholder="Any comments for the evaluator? (e.g. 'I fixed the re-render issue')" 
          className="min-h-24"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t mt-6">
        <Button type="button" variant="outline" disabled={loading} onClick={() => toast.info("Draft saved locally.")}>
          Save Draft
        </Button>
        <Button type="submit" disabled={loading} className="min-w-[140px]">
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          {loading ? "Submitting..." : "Submit Revision"}
        </Button>
      </div>
    </form>
  );
}
