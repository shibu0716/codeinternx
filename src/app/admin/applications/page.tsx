import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { ApplicationsClient } from "./ApplicationsClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import { ImportApplicationsModal } from "./ImportApplicationsModal";
import { SyncGoogleSheetsButton } from "./SyncGoogleSheetsButton";

export const metadata = {
  title: "Application Review | Admin",
};

export default async function AdminApplicationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }


  const { data: applications } = await supabase
    .from("applications")
    .select("*, profiles(full_name, email, phone), programs(title)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
          <p className="text-muted-foreground mt-1">Review student applications, approve them for payment, or reject them.</p>
        </div>
        <div className="flex items-center gap-2">
          <SyncGoogleSheetsButton />
          <ImportApplicationsModal />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Applications</CardTitle>
          <CardDescription>Click approve to allow a student to proceed to payment.</CardDescription>
        </CardHeader>
        <CardContent>
          <ApplicationsClient applications={applications || []} />
        </CardContent>
      </Card>
    </div>
  );
}
