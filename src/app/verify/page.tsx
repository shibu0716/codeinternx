import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, LockKeyhole } from "lucide-react";

export const metadata = {
  title: "Verify Certificate | CodeInternX",
  description: "Verify the authenticity of a CodeInternX certificate.",
};

export default function VerifyPage() {

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
            CodeInternX certificates are cryptographically secure. Enter a credential ID below to instantly verify its authenticity and view the candidate&apos;s performance report.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-3xl px-4 -mt-16 relative z-20">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Verify a Credential</h2>
            <p className="text-slate-500">The Credential ID is located at the bottom of the certificate.</p>
          </div>
          
          <form action={async (formData) => { "use server"; const { redirect } = await import('next/navigation'); redirect(`/verify/certificate/${formData.get('id')}`); }} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                name="id" 
                placeholder="e.g. CIX-2026-000001" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-4 text-slate-900 text-lg placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" 
                required
              />
            </div>
            <Button type="submit" className="h-[60px] px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-base font-semibold shadow-md hover:shadow-indigo-500/25 transition-all">
              Verify Authenticity
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
