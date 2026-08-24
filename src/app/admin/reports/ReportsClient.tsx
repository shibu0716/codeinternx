"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FileText, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function ReportsClient({ enrollments, existingReports }: { enrollments: any[], existingReports: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const filteredEnrollments = enrollments.filter((e) => {
    const query = searchQuery.toLowerCase();
    return (
      e.profiles?.full_name?.toLowerCase().includes(query) ||
      e.profiles?.email?.toLowerCase().includes(query) ||
      e.programs?.title?.toLowerCase().includes(query)
    );
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const hasReport = (enrollmentId: string) => {
    return existingReports.some(r => r.enrollment_id === enrollmentId);
  };

  const handleGenerateReport = async (enrollmentId: string) => {
    setGeneratingId(enrollmentId);
    // Mocking generation for now, this will eventually call a Server Action
    setTimeout(() => {
      toast.success("Performance report generated successfully (Mock)");
      setGeneratingId(null);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            type="search"
            placeholder="Search by student or program..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border border-slate-200">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-semibold text-slate-900">Student</TableHead>
              <TableHead className="font-semibold text-slate-900">Program</TableHead>
              <TableHead className="font-semibold text-slate-900">Enrolled At</TableHead>
              <TableHead className="font-semibold text-slate-900">Status</TableHead>
              <TableHead className="font-semibold text-slate-900 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEnrollments.length > 0 ? (
              filteredEnrollments.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium text-slate-900">
                    {e.profiles?.full_name}
                    <div className="text-xs text-slate-500 font-normal">{e.profiles?.email}</div>
                  </TableCell>
                  <TableCell className="text-slate-600">{e.programs?.title}</TableCell>
                  <TableCell className="text-slate-600">{formatDate(e.enrolled_at)}</TableCell>
                  <TableCell>
                    {e.is_completed ? (
                      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Completed</Badge>
                    ) : (
                      <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">In Progress</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {hasReport(e.id) ? (
                      <Button variant="outline" size="sm" className="text-emerald-600 border-emerald-200">
                        <CheckCircle className="w-4 h-4 mr-1.5" /> View Report
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        onClick={() => handleGenerateReport(e.id)}
                        disabled={!e.is_completed || generatingId === e.id}
                      >
                        <FileText className="w-4 h-4 mr-1.5" /> 
                        {generatingId === e.id ? "Generating..." : "Generate Report"}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                  No enrollments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
