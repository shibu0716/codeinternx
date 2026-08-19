import { FileText } from "lucide-react";

export const metadata = {
  title: "Terms of Service | CodeInternX",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-500/30">
      {/* Header Banner */}
      <div className="bg-slate-950 py-16 md:py-24 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="container mx-auto px-4 max-w-3xl text-center relative z-10">
          <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl mx-auto flex items-center justify-center mb-6">
            <FileText className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-white mb-4">Terms of Service</h1>
          <p className="text-slate-400">Last updated: August 2026</p>
        </div>
      </div>

      {/* Prose Content */}
      <div className="container mx-auto max-w-3xl px-4 py-16">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200">
          <div className="prose prose-slate md:prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-indigo-600 hover:prose-a:text-indigo-500">
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing and using CodeInternX, you accept and agree to be bound by the terms and provision of this agreement. Our platform provides educational resources, project-based internships, and verifiable credentials designed to accelerate software engineering careers.</p>
            
            <h2>2. User Accounts</h2>
            <p>You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account and password. CodeInternX reserves the right to refuse service, terminate accounts, or remove content at our sole discretion.</p>
            
            <h2>3. Code of Conduct</h2>
            <p>We maintain a strict zero-tolerance policy for academic dishonesty. Plagiarism, using AI to entirely generate submissions without understanding, or submitting code that is not your own will result in immediate termination of your account and revocation of any issued credentials without refund.</p>

            <h2>4. Intellectual Property</h2>
            <p>The CodeInternX platform, including its original content, features, and functionality, are owned by CodeInternX Technologies and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
