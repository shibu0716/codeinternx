import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { resetPassword } from "@/actions/auth";

export const metadata = {
  title: "Forgot Password | CodeInternX",
};

export default async function ForgotPasswordPage({ searchParams }: { searchParams: Promise<{ error?: string, message?: string }> }) {
  const { error, message } = await searchParams;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950">
      
      {/* Left Side - Brand & Graphics */}
      <div className="hidden md:flex flex-1 relative bg-[#0A0F1C] overflow-hidden flex-col justify-between p-12 lg:p-20 border-r border-slate-800">
        {/* Abstract Background Elements */}
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
        
        {/* Brand Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2">
            <Image src="/codeinternx-logo.png" alt="CodeInternX" width={280} height={70} className="object-contain h-16 w-auto invert brightness-0" />
          </Link>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-lg mt-auto mb-auto">
          <h1 className="text-4xl lg:text-5xl font-serif font-medium text-white leading-tight mb-6">
            Regain access to your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">career hub.</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed mb-8">
            Don't worry if you forgot your password. We'll send you a secure link to reset it and get you back on track with your internships.
          </p>
        </div>

        {/* Footer info */}
        <div className="relative z-10">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} CodeInternX. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 relative">
        
        {/* Mobile Logo (only visible on small screens) */}
        <div className="md:hidden absolute top-8 left-6">
          <Link href="/" className="inline-flex items-center gap-2">
            <Image src="/codeinternx-logo.png" alt="CodeInternX" width={200} height={50} className="object-contain h-12 w-auto dark:invert dark:brightness-0" />
          </Link>
        </div>

        <div className="w-full max-w-[420px] mx-auto">
          
          <Link href="/login" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors mb-8 group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to log in
          </Link>

          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">Forgot Password</h2>
            <p className="text-slate-500 dark:text-slate-400">Enter your email address and we'll send you a link to reset your password.</p>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3 text-red-800 dark:text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}
          
          {message && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl flex items-start gap-3 text-blue-800 dark:text-blue-400 text-sm animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{message}</p>
            </div>
          )}

          <form action={resetPassword} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">Email Address</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="name@example.com" 
                required 
                className="py-6 px-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl focus-visible:ring-blue-500"
              />
            </div>

            <Button type="submit" className="w-full py-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all flex justify-between items-center px-6 group">
              Send Reset Link
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
