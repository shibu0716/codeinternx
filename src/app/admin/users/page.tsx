import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, ShieldAlert, User as UserIcon } from "lucide-react";
import { UserRoleClient } from "./UserRoleClient";

export const metadata = {
  title: "User Management | CodeInternX Admin",
};

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "SUPER_ADMIN") {
    return (
      <div className="p-8 text-center text-red-600">
        <ShieldAlert className="w-12 h-12 mx-auto mb-4" />
        <h2 className="text-xl font-bold">Access Denied</h2>
        <p>Only the SUPER_ADMIN can manage user roles.</p>
      </div>
    );
  }

  const { data: users, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) console.error("Error fetching users:", error);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">User Management</h1>
        <p className="text-muted-foreground mt-1">Promote or demote users across the platform.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Platform Users</CardTitle>
          <CardDescription>All registered users and their current roles.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Current Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users && users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                          {u.avatar_url ? (
                            <img src={u.avatar_url} alt="Avatar" className="w-8 h-8 rounded-full" />
                          ) : (
                            <UserIcon className="w-4 h-4 text-slate-500" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{u.full_name}</div>
                          <div className="text-xs text-slate-500">Joined {new Date(u.created_at).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{u.email}</div>
                      {u.phone && <div className="text-xs text-muted-foreground">{u.phone}</div>}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        u.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                        u.role === 'ADMIN' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                        u.role === 'EVALUATOR' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                        'bg-slate-100 text-slate-800 border-slate-200'
                      }>
                        {u.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {u.role !== 'SUPER_ADMIN' && u.id !== user.id && (
                        <UserRoleClient userId={u.id} currentRole={u.role} />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
