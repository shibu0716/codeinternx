import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { verifyAdminOTP } from "@/actions/auth";

export const metadata = {
  title: "Admin Security Verification | CodeInternX",
};

export default async function VerifyAdminPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 dark:bg-slate-950 p-4">
      
      {/* Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8 relative z-10 overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

        <div className="flex justify-center mb-8 mt-2">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center border border-blue-100 dark:border-blue-800">
            <ShieldCheck className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">Security Verification</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            We've sent a 6-digit code to your official admin email. Please enter it below to securely access the control panel.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3 text-red-800 dark:text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <form action={verifyAdminOTP} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="code" className="text-slate-700 dark:text-slate-300">6-Digit Verification Code</Label>
            <Input 
              id="code" 
              name="code" 
              type="text" 
              placeholder="000000" 
              maxLength={6}
              required 
              className="py-6 px-4 text-center text-2xl tracking-[0.5em] font-mono font-bold bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl focus-visible:ring-blue-500"
            />
          </div>

          <Button type="submit" className="w-full py-6 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold text-base transition-all flex justify-between items-center px-6 group shadow-lg">
            Verify & Secure Login
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </form>
        
        <div className="mt-8 text-center">
          <Link href="/login" className="text-sm font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
            Cancel and return to login
          </Link>
        </div>
      </div>
    </div>
  );
}
