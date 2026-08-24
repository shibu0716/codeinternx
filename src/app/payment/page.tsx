import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { PaymentCheckoutClient } from "./PaymentCheckoutClient";

export const metadata = {
  title: "Secure Checkout | CodeInternX",
};

export default async function PaymentPage({
  searchParams,
}: {
  searchParams: { applicationId: string };
}) {
  const { applicationId } = await searchParams;

  if (!applicationId) {
    redirect("/dashboard/applications");
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirect=/payment?applicationId=${applicationId}`);
  }

  // Fetch the application and verify it belongs to user and is APPROVED
  const { data: application } = await supabase
    .from("applications")
    .select("*, programs(*), profiles(full_name)")
    .eq("id", applicationId)
    .eq("student_id", user.id)
    .single();

  if (!application) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-center px-4">
        <div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">Application Not Found</h1>
          <p className="text-muted-foreground">We couldn't find this application, or you don't have access to it.</p>
        </div>
      </div>
    );
  }

  if (application.status !== 'APPROVED') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-center px-4">
        <div>
          <h1 className="text-2xl font-bold text-amber-600 mb-2">Payment Not Available</h1>
          <p className="text-muted-foreground mt-1">Select your internship duration. You&apos;re applying for <strong className="text-slate-900">{application.programs.title}</strong>. You can only pay for APPROVED applications.</p>
        </div>
      </div>
    );
  }

  const { getPaymentSettings } = await import("@/actions/payments");
  const settings = await getPaymentSettings();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12">
      <PaymentCheckoutClient 
        application={application} 
        userEmail={user.email!} 
        userName={application.profiles?.full_name || "Student"}
        settings={settings}
      />
    </div>
  );
}
