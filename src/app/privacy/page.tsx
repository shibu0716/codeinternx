import { ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | CodeInternX",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-500/30">
      {/* Header Banner */}
      <div className="bg-slate-950 py-16 md:py-24 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="container mx-auto px-4 max-w-3xl text-center relative z-10">
          <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl mx-auto flex items-center justify-center mb-6">
            <ShieldCheck className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-white mb-4">Privacy Policy</h1>
          <p className="text-slate-400">Last updated: August 2026</p>
        </div>
      </div>

      {/* Prose Content */}
      <div className="container mx-auto max-w-3xl px-4 py-16">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200">
          <div className="prose prose-slate md:prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-indigo-600 hover:prose-a:text-indigo-500">
            <h2>1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create or modify your account, request support, or enroll in an internship. This includes your name, email address, educational background, and GitHub profile links.</p>
            
            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to provide, maintain, and improve our services, to process transactions, to send you related information, and to monitor and analyze trends, usage, and activities in connection with our platform.</p>
            
            <h2>3. Information Sharing</h2>
            <p>We do not share your personal information with third parties except as described in this privacy policy. We may share information with vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
