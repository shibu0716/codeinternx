import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AdminClientLayout from "./admin-client-layout";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Check if user is an ADMIN
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "SUPER_ADMIN" && profile?.role !== "ADMIN") {
    redirect("/dashboard?error=unauthorized_admin_access");
  }

  return (
    <AdminClientLayout>
      {children}
    </AdminClientLayout>
  );
}
