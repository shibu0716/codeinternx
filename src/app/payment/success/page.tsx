import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, FileText } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: { orderId: string };
}) {
  const { orderId } = await searchParams;
  const supabase = await createClient();

  // Optionally fetch the order details to display
  let programTitle = "Your Program";
  if (orderId) {
    const { data: order } = await supabase
      .from("orders")
      .select("*, programs(title)")
      .eq("id", orderId)
      .single();
    if (order?.programs?.title) {
      programTitle = order.programs.title;
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Payment Successful!</h1>
        <p className="text-muted-foreground text-lg">
          You are now enrolled in <strong>{programTitle}</strong>.
        </p>

        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm text-left space-y-2 mt-6">
          <p className="font-medium text-slate-700">What happens next?</p>
          <ul className="list-disc pl-5 text-muted-foreground space-y-1">
            <li>You will receive a welcome email with onboarding instructions.</li>
            <li>Your dashboard has been unlocked.</li>
            <li>You can now download your payment receipt.</li>
          </ul>
        </div>

        <div className="flex flex-col gap-3 pt-4 border-t border-slate-100 mt-6">
          <Link href="/dashboard/internships" className="w-full">
            <Button className="w-full h-12">Go to My Internships</Button>
          </Link>
          <Link href={`/dashboard/payments`} className="w-full">
            <Button variant="outline" className="w-full h-12">
              <FileText className="w-4 h-4 mr-2" /> View Receipt
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
