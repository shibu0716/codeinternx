import { createClient } from "@/utils/supabase/server";
import { ProgramForm } from "../ProgramForm";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Edit Program | CodeInternX Admin",
};

export default async function EditProgramPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data: program, error } = await supabase
    .from("programs")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !program) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Edit Program</h1>
        <p className="text-muted-foreground mt-1">Update the configuration of an existing program.</p>
      </div>

      <ProgramForm initialData={program} />
    </div>
  );
}
