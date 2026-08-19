import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { login } from "@/actions/auth";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Portal | CodeInternX",
  description: "Secure login for CodeInternX administrators.",
};

export default function AdminLoginPage({ searchParams }: { searchParams: { message?: string, error?: string, redirect?: string } }) {
  const error = searchParams?.error;
  const message = searchParams?.message;
  const redirect = searchParams?.redirect || '/admin';

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950">
      
      {/* Left Side - Brand & Graphics */}
      <div className="hidden md:flex flex-1 relative bg-[#0A0F1C] overflow-hidden flex-col justify-between p-12 lg:p-20 border-r border-slate-800">
        {/* Abstract Background Elements */}
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-md mx-auto text-center md:text-left mt-12 md:mt-0">
          <Link href="/" className="inline-flex items-center gap-2 mb-12">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-bold text-slate-900 text-xl shadow-lg">C</div>
            <span className="font-bold text-2xl tracking-tight text-white">CodeInternX</span>
            <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full font-medium ml-2">ADMIN</span>
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Secure Admin Portal
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed mb-8">
            This area is restricted to authorized CodeInternX staff and administrators only. All access is logged.
          </p>
          
          <div className="space-y-4">
            {[
              "Earn verified certificates"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
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
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">Admin Login</h2>
            <p className="text-slate-500 dark:text-slate-400">Enter your credentials to access the admin portal.</p>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3 text-red-800 dark:text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{error === 'unauthorized_admin_access' ? 'You do not have permission to access the admin portal.' : error}</p>
            </div>
          )}
          
          {message && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl flex items-start gap-3 text-blue-800 dark:text-blue-400 text-sm animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{message}</p>
            </div>
          )}

          <form action={login} className="space-y-5">
            {redirect && <input type="hidden" name="redirect" value={redirect} />}
            
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
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-700 dark:text-slate-300">Password</Label>
                <Link href="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                placeholder="••••••••"
                required 
                className="py-6 px-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl focus-visible:ring-blue-500"
              />
            </div>

            <Button type="submit" className="w-full py-6 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 dark:text-slate-900 text-white font-bold text-base mt-2 shadow-[0_0_20px_rgba(0,0,0,0.1)] transition-all flex justify-between items-center px-6 group">
              Authenticate
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
            Student login?{" "}
            <Link href="/login" className="font-semibold text-slate-900 dark:text-white hover:underline transition-colors">
              Return here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
