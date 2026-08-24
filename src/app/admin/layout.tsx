import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AdminClientLayout from "./admin-client-layout";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Check if user is an ADMIN or their email is in the ADMIN_EMAILS list
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const adminEmails = process.env.ADMIN_EMAILS?.toLowerCase().split(',').map(e => e.replace(/['"]/g, '').trim()) || [];
  const isHardcodedAdmin = user.email && adminEmails.includes(user.email.toLowerCase());

  if (!isHardcodedAdmin && profile?.role !== "SUPER_ADMIN" && profile?.role !== "ADMIN") {
    redirect("/dashboard?error=unauthorized_admin_access");
  }

  return (
    <AdminClientLayout>
      {children}
    </AdminClientLayout>
  );
}
