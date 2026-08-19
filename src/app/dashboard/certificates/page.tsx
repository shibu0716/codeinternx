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
      .select("*, programs(title)")
      .eq("student_id", user.id)
      .in("status", ["ENROLLED", "IN_PROGRESS"]);
      
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
                      <QRCodeSVG value={`https://codeinternx.com/verify/${cert.certificate_id}`} size={100} />
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Scan to verify authenticity
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-3 pt-0">
              <Button className="flex-1" variant="default" disabled>
                <Download className="w-4 h-4 mr-2" /> Download PDF
              </Button>
              <Link href={`/verify/${cert.certificate_id}`} target="_blank" className="flex-1 flex">
                <Button className="w-full" variant="outline">
                  <ExternalLink className="w-4 h-4 mr-2" /> Verify Page
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}

        {inProgressApps.map(app => (
          <Card key={app.id} className="border-dashed bg-muted/20 opacity-70 flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <CardTitle className="text-xl">{app.programs?.title}</CardTitle>
                  <CardDescription>Program In Progress</CardDescription>
                </div>
                <Award className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="pt-2 flex-1">
              <p className="text-sm text-muted-foreground">
                Complete all mandatory tasks and the final project with an average score above 60% to unlock this certificate.
              </p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button className="w-full" variant="secondary" disabled>
                Certificate Locked
              </Button>
            </CardFooter>
          </Card>
        ))}

        {certificates.length === 0 && inProgressApps.length === 0 && (
          <div className="col-span-full py-10 text-center text-muted-foreground">
            You don't have any certificates or in-progress programs yet.
          </div>
        )}
      </div>
    </div>
  );
}
