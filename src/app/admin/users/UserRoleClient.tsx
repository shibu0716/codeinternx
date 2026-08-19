"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateUserRole } from "@/actions/admin";

export function UserRoleClient({ userId, currentRole }: { userId: string, currentRole: string }) {
  const [loading, setLoading] = useState(false);

  const handleRoleChange = async (newRole: string) => {
    if (newRole === currentRole) return;
    
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;

    setLoading(true);
    try {
      const res = await updateUserRole(userId, newRole);
      if (res.success) {
        toast.success(`User role updated to ${newRole}`);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update user role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      {loading && <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />}
      <Select defaultValue={currentRole} onValueChange={handleRoleChange} disabled={loading}>
        <SelectTrigger className="w-[140px] h-8 text-xs">
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="STUDENT">Student</SelectItem>
          <SelectItem value="EVALUATOR">Evaluator</SelectItem>
          <SelectItem value="ADMIN">Admin</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
