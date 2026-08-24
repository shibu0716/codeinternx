import { getPaymentSettings } from "@/actions/payments";
import { PaymentSettingsForm } from "./PaymentSettingsForm";
import { checkIsAdminAction } from "@/actions/auth";
import { redirect } from "next/navigation";
import { ShieldCheck, Receipt } from "lucide-react";

export const metadata = {
  title: "Payment Settings | CodeInternX Admin",
};

export default async function AdminPaymentSettingsPage() {
  const isAdmin = await checkIsAdminAction();
  if (!isAdmin) {
    redirect("/admin/login");
  }

  const settings = await getPaymentSettings();

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Receipt className="w-8 h-8 text-blue-500" />
            Official Payment Details
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Configure the bank and UPI details displayed to students during checkout.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-800 text-sm font-medium">
          <ShieldCheck className="w-4 h-4" />
          Secure Configuration
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
        <PaymentSettingsForm initialSettings={settings} />
      </div>
    </div>
  );
}
