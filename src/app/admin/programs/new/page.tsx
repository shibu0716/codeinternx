import { ProgramForm } from "../ProgramForm";

export const metadata = {
  title: "Create Program | CodeInternX Admin",
};

export default function NewProgramPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">New Program</h1>
        <p className="text-muted-foreground mt-1">Configure a new internship or course offering.</p>
      </div>

      <ProgramForm />
    </div>
  );
}
