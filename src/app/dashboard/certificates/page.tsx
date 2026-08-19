import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, FileText, Download, Share2, ExternalLink } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "My Certificates | CodeInternX",
};

export default function CertificatesPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Certificates & LORs</h1>
        <p className="text-muted-foreground mt-1">Access your verifiable credentials and letters of recommendation.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Certificate Card */}
        <Card className="border-primary/20 shadow-md flex flex-col">
          <CardHeader className="bg-primary/5 pb-4">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1">
                <CardTitle className="text-xl">Full Stack Development</CardTitle>
                <CardDescription>Completed on August 10, 2026</CardDescription>
              </div>
              <Award className="w-8 h-8 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="pt-6 flex-1">
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg border text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Credential ID:</span>
                  <span className="font-mono font-medium">SKF-9823-XYZ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Overall Score:</span>
                  <span className="font-bold text-green-600">92/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Evaluation Grade:</span>
                  <span className="font-medium">Excellent (A+)</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                This certificate is cryptographically verifiable by employers via our verification portal.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-3 pt-0">
            <Button className="flex-1" variant="default">
              <Download className="w-4 h-4 mr-2" /> Download PDF
            </Button>
            <Link href="/verify?id=SKF-9823-XYZ" target="_blank" className="flex-1 flex">
              <Button className="w-full" variant="outline">
                <ExternalLink className="w-4 h-4 mr-2" /> Verify Page
              </Button>
            </Link>
            <Button size="icon" variant="secondary" title="Share on LinkedIn">
              <Share2 className="w-4 h-4" />
            </Button>
          </CardFooter>
        </Card>

        {/* LOR Card */}
        <Card className="flex flex-col">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1">
                <CardTitle className="text-xl">Letter of Recommendation</CardTitle>
                <CardDescription>Issued by CodeInternX Engineering Team</CardDescription>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent className="pt-2 flex-1">
            <div className="space-y-4">
              <Badge className="bg-blue-100 text-blue-700 border-blue-200" variant="outline">
                Performance-Based LOR
              </Badge>
              <p className="text-sm text-muted-foreground">
                Based on your outstanding performance (Top 10% of cohort) and consistent code quality, you have been awarded a personalized Letter of Recommendation.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex gap-3 pt-0">
            <Button className="w-full" variant="outline">
              <Download className="w-4 h-4 mr-2" /> Download LOR
            </Button>
          </CardFooter>
        </Card>

        {/* Locked Certificate (In Progress Program) */}
        <Card className="border-dashed bg-muted/20 opacity-70 flex flex-col">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1">
                <CardTitle className="text-xl">Data Science & Python</CardTitle>
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
      </div>
    </div>
  );
}
