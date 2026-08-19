import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SettingsClient } from "./SettingsClient";

export const metadata = {
  title: "Settings | Dashboard | CodeInternX",
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, is_public, github_url, linkedin_url")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return <div>Profile not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences and public profile.</p>
      </div>

      <SettingsClient profile={profile} />
    </div>
  );
}
