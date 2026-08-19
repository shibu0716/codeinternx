"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export function ApplicationsClient({ applications: initialApplications }: { applications: any[] }) {
  const [apps, setApps] = useState(initialApplications);
  const [loading, setLoading] = useState<string | null>(null);
  const supabase = createClient();

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setLoading(id);
    try {
      const { error } = await supabase
        .from("applications")
        .update({ status: newStatus })
        .eq("id", id);
      
      if (error) throw error;
      
      setApps(apps.map(app => app.id === id ? { ...app, status: newStatus } : app));
      toast.success(`Application marked as ${newStatus}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    } finally {
      setLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <Badge variant="outline" className="bg-amber-100 text-amber-800">PENDING</Badge>;
      case 'APPROVED': return <Badge variant="outline" className="bg-green-100 text-green-800">APPROVED</Badge>;
      case 'PAYMENT_PENDING': return <Badge variant="outline" className="bg-blue-100 text-blue-800">WAITING PAYMENT</Badge>;
      case 'PAID': return <Badge variant="outline" className="bg-emerald-100 text-emerald-800">PAID</Badge>;
      case 'REJECTED': return <Badge variant="outline" className="bg-red-100 text-red-800">REJECTED</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (apps.length === 0) {
    return <div className="text-center py-10 text-muted-foreground">No applications found.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
          <tr>
            <th className="px-4 py-3 font-medium">App ID</th>
            <th className="px-4 py-3 font-medium">Student</th>
            <th className="px-4 py-3 font-medium">Program</th>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {apps.map((app) => (
            <tr key={app.id} className="hover:bg-slate-50/50">
              <td className="px-4 py-3 font-mono text-xs">{app.application_id}</td>
              <td className="px-4 py-3">
                <div className="font-medium">{app.profiles?.full_name}</div>
                <div className="text-xs text-muted-foreground">{app.profiles?.email}</div>
              </td>
              <td className="px-4 py-3">{app.programs?.title}</td>
              <td className="px-4 py-3">{new Date(app.created_at).toLocaleDateString()}</td>
              <td className="px-4 py-3">{getStatusBadge(app.status)}</td>
              <td className="px-4 py-3 text-right">
                {app.status === 'PENDING' || app.status === 'UNDER_REVIEW' ? (
                  <div className="flex justify-end gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      onClick={() => handleUpdateStatus(app.id, 'APPROVED')}
                      disabled={loading === app.id}
                    >
                      {loading === app.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-1" />}
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
                      disabled={loading === app.id}
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>
                ) : app.status === 'APPROVED' ? (
                  <div className="flex justify-end gap-2">
                     <Button 
                      size="sm" 
                      variant="default" 
                      className="bg-indigo-600 hover:bg-indigo-700"
                      onClick={async () => {
                        setLoading(app.id);
                        try {
                          const { issueOfferLetter } = await import("@/actions/admin");
                          await issueOfferLetter(app.id);
                          setApps(apps.map(a => a.id === app.id ? { ...a, status: 'ENROLLED' } : a));
                          toast.success("Offer Letter Issued (Manually Enrolled)");
                        } catch (err: any) {
                          toast.error(err.message || "Failed to issue offer letter");
                        } finally {
                          setLoading(null);
                        }
                      }}
                      disabled={loading === app.id}
                    >
                      {loading === app.id ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Issue Offer Letter
                    </Button>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">No actions</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
