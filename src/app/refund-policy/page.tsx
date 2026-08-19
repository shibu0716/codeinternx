import { BadgeDollarSign } from "lucide-react";

export const metadata = {
  title: "Refund Policy | CodeInternX",
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-500/30">
      {/* Header Banner */}
      <div className="bg-slate-950 py-16 md:py-24 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="container mx-auto px-4 max-w-3xl text-center relative z-10">
          <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl mx-auto flex items-center justify-center mb-6">
            <BadgeDollarSign className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-white mb-4">Refund Policy</h1>
          <p className="text-slate-400">Last updated: August 2026</p>
        </div>
      </div>

      {/* Prose Content */}
      <div className="container mx-auto max-w-3xl px-4 py-16">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200">
          <div className="prose prose-slate md:prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-indigo-600 hover:prose-a:text-indigo-500">
            <h2>1. Satisfaction Guarantee</h2>
            <p>If you are not entirely satisfied with your purchase, we're here to help. We offer a conditional 7-day money-back guarantee for all our internship programs and courses.</p>
            
            <h2>2. Conditions for Refund</h2>
            <p>To be eligible for a refund, you must initiate the request within 7 days of your enrollment date. Furthermore, you must not have submitted the final project or generated the completion certificate. If a certificate has been cryptographically generated, the enrollment is considered fulfilled and non-refundable.</p>
            
            <h2>3. Processing</h2>
            <p>If your return is approved, we will initiate a refund to your credit card (or original method of payment). You will receive the credit within a certain amount of days, depending on your card issuer's policies. Administrative or processing fees from payment gateways may be non-refundable.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
