import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Award, ShieldAlert, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Manage Certificates | Admin",
};

export default function AdminCertificatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Certificates & LORs</h1>
          <p className="text-muted-foreground mt-1">Manage issued credentials and revoke access if necessary.</p>
        </div>
        <Button>Issue Custom Credential</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Issued Credentials</CardTitle>
          <CardDescription>Search by student name or credential ID.</CardDescription>
          <div className="pt-4 max-w-md relative">
            <Search className="absolute left-3 top-7 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search certificates..." className="pl-9" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md divide-y">
            {[
              { id: "SKF-9823-XYZ", student: "Student User", program: "Full Stack Development", date: "Aug 10, 2026", status: "VALID", score: 92 },
              { id: "SKF-7441-ABC", student: "Priya Sharma", program: "React Ecosystem", date: "Aug 12, 2026", status: "VALID", score: 85 },
              { id: "SKF-1002-REV", student: "Suspicious User", program: "Backend APIs", date: "Aug 15, 2026", status: "REVOKED", score: 40 },
            ].map((cert, i) => (
              <div key={i} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-md shrink-0 mt-1 ${cert.status === 'VALID' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-slate-900">{cert.student}</span>
                      {cert.status === "VALID" ? (
                        <Badge className="bg-green-100 text-green-700 border-green-200" variant="outline">Valid</Badge>
                      ) : (
                        <Badge variant="destructive" className="text-xs">Revoked</Badge>
                      )}
                    </div>
                    <p className="text-sm font-medium text-slate-700">{cert.program}</p>
                    <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                      <span>ID: {cert.id}</span>
                      <span>Issued: {cert.date}</span>
                      <span>Score: {cert.score}/100</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">View PDF</Button>
                  {cert.status === "VALID" ? (
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" title="Revoke Certificate">
                      <ShieldAlert className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button variant="ghost" size="icon" className="text-green-500 hover:text-green-600 hover:bg-green-50" title="Reinstate Certificate">
                      <CheckCircle2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
