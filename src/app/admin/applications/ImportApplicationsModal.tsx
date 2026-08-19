"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import Papa from "papaparse";
import { importApplications } from "@/actions/admin";

export function ImportApplicationsModal() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ success: number; failed: number; errors: string[] } | null>(null);

  const handleImport = async () => {
    if (!file) {
      toast.error("Please select a CSV file first");
      return;
    }

    setLoading(true);
    setResults(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const res = await importApplications(results.data);
          setResults(res);
          toast.success(`Import complete! ${res.success} imported, ${res.failed} failed.`);
        } catch (error: any) {
          toast.error(error.message || "Failed to process import");
        } finally {
          setLoading(false);
        }
      },
      error: (error) => {
        toast.error(`Error parsing CSV: ${error.message}`);
        setLoading(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" className="bg-white" />}>
        <Upload className="w-4 h-4 mr-2" />
        Import CSV
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Import External Applications</DialogTitle>
          <DialogDescription>
            Upload a CSV file exported from Google Forms or other sources.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>CSV File</Label>
            <Input type="file" accept=".csv" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <p className="text-xs text-muted-foreground mt-2">
              Expected columns: <code>Email</code>, <code>Program Title</code>. The student MUST have signed up on the platform first.
            </p>
          </div>

          {results && (
            <div className={`p-4 rounded-md text-sm ${results.failed > 0 ? 'bg-amber-50 text-amber-900 border border-amber-200' : 'bg-emerald-50 text-emerald-900 border border-emerald-200'}`}>
              <div className="font-semibold mb-2 flex items-center">
                {results.failed > 0 && <AlertCircle className="w-4 h-4 mr-2 text-amber-600" />}
                Import Results
              </div>
              <p>Successfully imported: <strong>{results.success}</strong></p>
              <p>Failed to import: <strong>{results.failed}</strong></p>
              {results.errors.length > 0 && (
                <ul className="mt-2 list-disc pl-5 text-xs space-y-1 text-amber-700 max-h-32 overflow-y-auto">
                  {results.errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
          
          <Button onClick={handleImport} disabled={loading || !file} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
            Start Import
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
