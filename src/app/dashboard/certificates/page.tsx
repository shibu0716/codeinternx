import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, FileText, Download, Share2, ExternalLink } from "lucide-react";
import Link from "next/link";

import { createClient } from "@/utils/supabase/server";
import { QRCodeSVG } from "qrcode.react";

export const metadata = {
  title: "My Certificates | CodeInternX",
};

export default async function CertificatesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let certificates: any[] = [];
  let inProgressApps: any[] = [];

  if (user) {
    const { data: certs } = await supabase
      .from("certificates")
      .select("*, programs(title)")
      .eq("student_id", user.id);
    
    certificates = certs || [];

    const { data: apps } = await supabase
      .from("applications")
      .select("*, programs(title), enrollments(*)")
      .eq("student_id", user.id)
      .in("status", ["ENROLLED", "IN_PROGRESS", "COMPLETED"]);
      
    inProgressApps = apps || [];
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Certificates & LORs</h1>
        <p className="text-muted-foreground mt-1">Access your verifiable credentials and letters of recommendation.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {certificates.map(cert => (
          <Card key={cert.id} className="border-primary/20 shadow-md flex flex-col">
            <CardHeader className="bg-primary/5 pb-4">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <CardTitle className="text-xl">{cert.programs?.title}</CardTitle>
                  <CardDescription>Completed on {new Date(cert.issue_date).toLocaleDateString()}</CardDescription>
                </div>
                <Award className="w-8 h-8 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="pt-6 flex-1">
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg border text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Credential ID:</span>
                    <span className="font-mono font-medium">{cert.certificate_id}</span>
                  </div>
                  <div className="flex justify-center mt-4">
                    <div className="bg-white p-2 rounded-xl shadow-sm border">
                      <QRCodeSVG value={`${process.env.NEXT_PUBLIC_APP_URL || 'https://codeinternx.com'}/verify/certificate/${cert.certificate_id}`} size={100} />
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Scan to verify authenticity
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-3 pt-0">
              <Link href={`/verify/certificate/${cert.certificate_id}?print=true`} target="_blank" className="flex-1 flex">
                <Button className="w-full" variant="default">
                  <Download className="w-4 h-4 mr-2" /> Download PDF
                </Button>
              </Link>
              <Link href={`/verify/certificate/${cert.certificate_id}`} target="_blank" className="flex-1 flex">
                <Button className="w-full" variant="outline">
                  <ExternalLink className="w-4 h-4 mr-2" /> Verify Page
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}

        {inProgressApps.map(app => {
          const isCompleted = app.status === 'COMPLETED';
          const enrollment = app.enrollments?.[0];
          const isPaymentPending = isCompleted && enrollment?.payment_status !== 'SUCCESS' && enrollment?.payment_status !== 'PAID';
          
          return (
            <Card key={app.id} className={`flex flex-col ${isPaymentPending ? 'border-amber-200 bg-amber-50/30' : 'border-dashed bg-muted/20 opacity-70'}`}>
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{app.programs?.title}</CardTitle>
                    <CardDescription>{isCompleted ? 'Internship Completed' : 'Program In Progress'}</CardDescription>
                  </div>
                  <Award className={`w-8 h-8 ${isPaymentPending ? 'text-amber-500' : 'text-muted-foreground'}`} />
                </div>
              </CardHeader>
              <CardContent className="pt-2 flex-1">
                <p className={`text-sm ${isPaymentPending ? 'text-amber-800' : 'text-muted-foreground'}`}>
                  {isPaymentPending 
                    ? "Congratulations on completing your internship! Please complete your payment of ₹99 to instantly unlock your Certificate of Completion, Letter of Recommendation, and Performance Report."
                    : "Complete all mandatory tasks and the final project with an average score above 60% to unlock this certificate."
                  }
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                {isPaymentPending ? (
                  <Link href={`/payment?applicationId=${app.id}`} className="w-full">
                    <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white shadow-sm">
                      Pay ₹99 to Unlock Documents
                    </Button>
                  </Link>
                ) : (
                  <Button className="w-full" variant="secondary" disabled>
                    Certificate Locked
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}

        {certificates.length === 0 && inProgressApps.length === 0 && (
          <div className="col-span-full py-10 text-center text-muted-foreground">
            You don't have any certificates or in-progress programs yet.
          </div>
        )}
      </div>
    </div>
  );
}
