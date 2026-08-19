import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Search, CheckCircle2, XCircle, LockKeyhole } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export const metadata = {
  title: "Verify Certificate | CodeInternX",
  description: "Verify the authenticity of a CodeInternX certificate.",
};

export default async function VerifyCertificatePage({ params }: { params: { id: string } }) {
  const certId = params.id;
  const supabase = await createClient();

  const { data: certificate, error } = await supabase
    .from("certificates")
    .select("*, profiles(full_name), programs(title)")
    .eq("certificate_id", certId)
    .single();

  const isVerified = !!certificate && !error;
  const issueDate = certificate ? new Date(certificate.issue_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : null;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 selection:bg-indigo-500/30 pb-20">
      
      {/* Premium Dark Hero */}
      <div className="bg-slate-950 pt-24 pb-32 px-4 relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto max-w-3xl text-center relative z-10">
          <div className="w-20 h-20 bg-slate-900/80 border border-slate-700/50 shadow-[0_0_40px_rgba(99,102,241,0.3)] rounded-3xl mx-auto flex items-center justify-center mb-8">
            <LockKeyhole className="w-10 h-10 text-indigo-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-white mb-6">
            Credential <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Verification</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            CodeInternX certificates are cryptographically secure. Instantly verify authenticity and view the candidate's performance report.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-3xl px-4 -mt-16 relative z-20">
        <div className="mt-8 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-forwards">
          {isVerified ? (
            <div className="bg-white border border-emerald-200 rounded-3xl shadow-lg shadow-emerald-100/50 overflow-hidden">
              <div className="bg-emerald-500 h-2 w-full" />
              <div className="p-8 md:p-10 bg-emerald-50/30 border-b border-emerald-100">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-emerald-900 tracking-tight">Verified Authentic</h2>
                </div>
                <p className="text-emerald-700/80 ml-16 text-lg">
                  This credential was issued by CodeInternX and has not been revoked.
                </p>
              </div>
              
              <div className="p-8 md:p-10">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
                  <div>
                    <dt className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Recipient Name</dt>
                    <dd className="text-xl font-bold text-slate-900">{certificate.profiles?.full_name || "Unknown"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Program Completed</dt>
                    <dd className="text-xl font-bold text-slate-900">{certificate.programs?.title || "Unknown"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Issue Date</dt>
                    <dd className="text-lg font-medium text-slate-700">{issueDate}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Credential ID</dt>
                    <dd className="text-lg font-mono font-medium text-slate-700 bg-slate-100 px-3 py-1 rounded-md inline-block">{certId}</dd>
                  </div>
                  
                  <div className="sm:col-span-2 border-t border-slate-100 pt-8 mt-2">
                    <dt className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Verification Organization</dt>
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-900 text-lg">CodeInternX</p>
                        <p className="text-sm text-slate-500">Official Internship & Certification Platform.</p>
                      </div>
                      <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200 border-indigo-200 text-base py-2 px-4 rounded-xl shrink-0">
                        Authorized Issuer
                      </Badge>
                    </div>
                  </div>
                </dl>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-red-200 rounded-3xl shadow-lg shadow-red-100/50 overflow-hidden">
              <div className="bg-red-500 h-2 w-full" />
              <div className="p-8 md:p-10 bg-red-50/50">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                    <XCircle className="w-7 h-7 text-red-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-red-900 tracking-tight">Record Not Found</h2>
                </div>
                <p className="text-red-700/80 ml-16 text-lg">
                  We could not find a valid credential matching ID <span className="font-mono bg-red-100 px-2 py-0.5 rounded">{certId}</span>. Please check for typos and try again.
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <Button render={<a href="/verify" />} variant="outline" className="h-[50px] px-8 rounded-xl bg-white hover:bg-slate-50 text-base shadow-sm">
              Verify Another Credential
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
