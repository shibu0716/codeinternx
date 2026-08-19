import { CheckCircle2, ShieldCheck, Award } from "lucide-react";

export const metadata = {
  title: "Trust & Transparency | CodeInternX",
};

export default function TrustPage() {
  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-500/30">
      {/* Header Banner */}
      <div className="bg-slate-950 py-16 md:py-24 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="container mx-auto px-4 max-w-3xl text-center relative z-10">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl mx-auto flex items-center justify-center mb-6">
            <Award className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-white mb-4">Trust & Transparency</h1>
          <p className="text-slate-400">How we verify skills and protect the integrity of our credentials.</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-4xl px-4 py-16 space-y-12">
        
        {/* Core Principles Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <ShieldCheck className="w-10 h-10 text-indigo-500 mb-6" />
            <h3 className="text-xl font-bold mb-3 text-slate-900">Cryptographic Verification</h3>
            <p className="text-slate-600 leading-relaxed">
              Every certificate issued by CodeInternX includes a unique, cryptographically secure hash. Recruiters can verify the exact date of issue, the student's identity, and the exact code repository they submitted.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-6" />
            <h3 className="text-xl font-bold mb-3 text-slate-900">No Pay-to-Pass</h3>
            <p className="text-slate-600 leading-relaxed">
              Paying the enrollment fee guarantees access to our curriculum and mentors, but it does NOT guarantee a certificate. Students must write passing code, verified by human reviewers.
            </p>
          </div>
        </div>

        {/* Prose Details */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200">
          <div className="prose prose-slate md:prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-indigo-600 hover:prose-a:text-indigo-500">
            <h2>Our Commitment to Hiring Managers</h2>
            <p>CodeInternX was built to solve a specific problem: resumes are noisy. Between inflated job titles and AI-generated cover letters, hiring managers struggle to find candidates who can actually write production code.</p>
            
            <p>When you see a CodeInternX certificate on a candidate's profile, it means:</p>
            <ul>
              <li>The candidate independently architected and built a full-stack or specialized project.</li>
              <li>Their code was reviewed for security, scalability, and maintainability.</li>
              <li>They passed plagiarism checks.</li>
            </ul>

            <h2>Anti-Plagiarism Systems</h2>
            <p>We utilize AST (Abstract Syntax Tree) comparisons and MOSS (Measure of Software Similarity) to cross-reference student submissions against known repositories and AI-generated boilerplates. Flagged submissions trigger a mandatory live technical interview to verify the student's understanding of the code.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
