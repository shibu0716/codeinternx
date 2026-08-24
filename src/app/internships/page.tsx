import { createClient } from "@/utils/supabase/server";
import { InternshipsClient } from "./InternshipsClient";

export const metadata = {
  title: "Internships | CodeInternX",
  description: "Explore our project-based internship programs.",
};

export default async function InternshipsPage() {
  const supabase = await createClient();

  // Fetch only published internships
  const { data: programs, error } = await supabase
    .from("programs")
    .select("*")
    .eq("is_published", true)
    .eq("category", "INTERNSHIP")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching internships:", error);
  }

  return <InternshipsClient initialInternships={programs || []} />;
}
