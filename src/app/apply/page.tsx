import { createClient } from "@/utils/supabase/server";
import { ApplyClient } from "./ApplyClient";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Apply | CodeInternX",
  description: "Apply for internships and courses.",
};

export default async function ApplyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/apply");
  }

  const { data: programs, error } = await supabase
    .from("programs")
    .select("id, title, slug")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching programs:", error);
  }

  return <ApplyClient programs={programs || []} />;
}
