"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { syncGoogleSheets } from "@/actions/google-sheets";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function SyncGoogleSheetsButton() {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<{ imported: number; skipped: number; errors: number; errorDetails: string[] } | null>(null);

  const handleSync = async () => {
    setLoading(true);
    setResults(null);
    try {
      const res = await syncGoogleSheets();
      if (res.success) {
        setResults({
          imported: res.imported || 0,
          skipped: res.skipped || 0,
          errors: res.errors || 0,
          errorDetails: res.errorDetails || []
        });
        setOpen(true);
        if (res.imported && res.imported > 0) {
           toast.success(`Successfully imported ${res.imported} new applications.`);
        } else {
           toast.success("Sync complete. No new applications to import.");
        }
      } else {
        toast.error(res.message || "Failed to sync Google Sheets");
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred during sync");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button 
        onClick={handleSync} 
        disabled={loading} 
        variant="outline" 
        className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200"
      >
        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
        Sync Google Form
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Google Sheets Sync Complete</DialogTitle>
            <DialogDescription>
              Here are the results from the latest synchronization.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-between p-3 border rounded-md bg-emerald-50 text-emerald-900 border-emerald-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="font-semibold">Successfully Imported</span>
              </div>
              <span className="font-bold text-lg">{results?.imported}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-md bg-slate-50 text-slate-900 border-slate-100">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-slate-500" />
                <span className="font-semibold">Duplicates Skipped</span>
              </div>
              <span className="font-bold text-lg">{results?.skipped}</span>
            </div>

            <div className={`flex items-center justify-between p-3 border rounded-md ${results?.errors && results.errors > 0 ? 'bg-amber-50 text-amber-900 border-amber-100' : 'bg-slate-50 text-slate-900 border-slate-100'}`}>
              <div className="flex items-center gap-2">
                <AlertCircle className={`w-5 h-5 ${results?.errors && results.errors > 0 ? 'text-amber-500' : 'text-slate-400'}`} />
                <span className="font-semibold">Errors Encountered</span>
              </div>
              <span className="font-bold text-lg">{results?.errors}</span>
            </div>

            {results?.errorDetails && results.errorDetails.length > 0 && (
              <div className="mt-2">
                <h4 className="text-sm font-semibold mb-2">Error Details</h4>
                <div className="max-h-32 overflow-y-auto text-xs text-amber-800 bg-amber-50 p-2 rounded border border-amber-100 space-y-1">
                  {results.errorDetails.map((err, idx) => (
                    <div key={idx} className="break-words">• {err}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
