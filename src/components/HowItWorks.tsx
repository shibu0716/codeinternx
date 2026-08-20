"use client";

import { useState } from "react";
import { UserPlus, Search, Mail, BookOpen, Code2, UploadCloud, ShieldCheck, Award, CheckCircle2, ChevronRight, Terminal } from "lucide-react";
import Link from "next/link";

const unifiedStyle = {
  color: "from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-400",
  bgLight: "bg-blue-50 dark:bg-blue-500/10",
  textLight: "text-blue-600 dark:text-blue-400",
  borderColor: "border-blue-200 dark:border-blue-500/30",
  shadow: "shadow-blue-500/10 dark:shadow-blue-500/20",
  terminalColor: "text-blue-600 dark:text-blue-400"
};

const pipelinePhases = [
  {
    id: "apply",
    title: "Apply",
    icon: UserPlus,
    heading: "Begin Your Internship Journey",
    description: "Submit your profile and choose a domain. Bypass generic algorithms; we review your actual potential.",
    highlights: ["Domain selection", "Profile submission", "Instant confirmation"],
    terminal: [
      "> internx apply --domain=fullstack",
      "[SYS] Validating candidate... OK",
      "[SYS] Registration... SUCCESS",
      "[SYS] Entering review queue..."
    ],
    ...unifiedStyle
  },
  {
    id: "review",
    title: "Review",
    icon: Search,
    heading: "Our Team Reviews Your Profile",
    description: "Our team checks your domain eligibility and finalizes selection within 24-48 hours.",
    highlights: ["Profile screening", "Eligibility check", "Selection finalized"],
    terminal: [
      "> internx status --id=APP-8291",
      "[SYS] Status: UNDER REVIEW",
      "[SYS] Domain allocated.",
      "[SYS] Finalizing decision..."
    ],
    ...unifiedStyle
  },
  {
    id: "offer-letter",
    title: "Offer Letter",
    icon: Mail,
    heading: "Get Selected & Start",
    description: "Receive your official offer letter confirming selection, complete with onboarding instructions.",
    highlights: ["Offer confirmed", "Letter generated", "Onboarding instructions"],
    terminal: [
      "> internx onboarding start",
      "[SYS] Downloading offer letter...",
      "[SYS] Parsing instructions...",
      "[SYS] Ready for workspace."
    ],
    ...unifiedStyle
  },
  {
    id: "get-tasks",
    title: "Get Tasks",
    icon: BookOpen,
    heading: "Receive Industry Tasks",
    description: "Internship tasks are assigned via your dashboard. Prepare for real-world project work.",
    highlights: ["Tasks assigned", "Requirements shared", "Timeline activated"],
    terminal: [
      "> git clone project/task-1",
      "[SYS] Resolving dependencies...",
      "[SYS] Reading requirements...",
      "[SYS] Environment READY"
    ],
    ...unifiedStyle
  },
  {
    id: "code-project",
    title: "Code/Project",
    icon: Code2,
    heading: "Build Real Solutions",
    description: "Apply your skills. Write code, design systems, and build functional applications.",
    highlights: ["Local setup", "Write clean code", "Testing & debugging"],
    terminal: [
      "> npm run dev",
      "[SYS] Starting dev server...",
      "[SYS] Compiling... SUCCESS",
      "[SYS] Live on port 3000"
    ],
    ...unifiedStyle
  },
  {
    id: "submit",
    title: "Submit",
    icon: UploadCloud,
    heading: "Submit Your Work",
    description: "Complete your task and submit your codebase via GitHub for evaluation.",
    highlights: ["Code committed", "Pull request created", "Submission confirmed"],
    terminal: [
      "> git push origin main",
      "[SYS] Enumerating objects...",
      "[SYS] Writing objects: 100%",
      "[SYS] Project SUBMITTED"
    ],
    ...unifiedStyle
  },
  {
    id: "evaluate",
    title: "Evaluate",
    icon: ShieldCheck,
    heading: "Expert Evaluation",
    description: "Our senior developers review your code for quality, functionality, and best practices.",
    highlights: ["Code review", "Functionality tested", "Feedback provided"],
    terminal: [
      "[EVAL] Running tests... PASS",
      "[EVAL] Analyzing code... A+",
      "[SYS] Status: EVAL COMPLETE",
      "[SYS] Feedback sent."
    ],
    ...unifiedStyle
  },
  {
    id: "certify",
    title: "Certify",
    icon: Award,
    heading: "Earn Your Certification",
    description: "Successfully complete your internship to receive an industry-recognized certificate.",
    highlights: ["Final evaluation", "Certificate issued", "Alumni network"],
    terminal: [
      "> internx generate-cert",
      "[SYS] Verifying completion...",
      "[SYS] Minting credential...",
      "[SYS] Certificate READY for download."
    ],
    ...unifiedStyle
  }
];

export function HowItWorks() {
  const [activePhase, setActivePhase] = useState(0);

  return (
    <section className="min-h-screen w-full flex flex-col justify-center bg-slate-50 dark:bg-slate-950 relative overflow-hidden py-24 px-4 lg:px-8">
      {/* Deep Space Background Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      <div className="container mx-auto max-w-7xl relative z-10 flex flex-col h-full max-h-[850px]">
        
        {/* Minimal Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 shrink-0 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-3 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
              SYSTEM ARCHITECTURE
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              The Internship <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Process</span>
            </h2>
          </div>
          <Link href="/internships">
            <button className="hidden md:inline-flex bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-2.5 px-6 rounded-full text-xs items-center gap-2 transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)]">
              Initialize Sequence
              <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
        </div>

        {/* Main HUD Interface */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 h-full min-h-[600px] mt-6">
          
          {/* Left: Circular Dial Navigation */}
          <div className="w-full lg:w-[45%] flex items-center justify-center shrink-0 min-h-[450px] lg:min-h-0 relative py-8 lg:py-0">
            
            {/* The outer circular track */}
            <div className="relative w-[300px] h-[300px] md:w-[380px] md:h-[380px] lg:w-[420px] lg:h-[420px] rounded-full border border-slate-200 dark:border-slate-800 border-dashed animate-[spin_120s_linear_infinite]">
              <div className="absolute inset-0 rounded-full border border-indigo-500/10 shadow-[0_0_50px_rgba(99,102,241,0.05)_inset]" />
            </div>

            {/* The nodes positioned around the circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[380px] md:h-[380px] lg:w-[420px] lg:h-[420px]">
              {pipelinePhases.map((phase, index) => {
                const isActive = activePhase === index;
                const Icon = phase.icon;
                
                // Calculate position on the circle (0 is top: -90deg)
                const angle = (index * 45 - 90) * (Math.PI / 180);
                const radius = 50; // percentage
                const x = 50 + radius * Math.cos(angle);
                const y = 50 + radius * Math.sin(angle);

                return (
                  <button
                    key={phase.id}
                    onClick={() => setActivePhase(index)}
                    className={`absolute flex flex-col items-center justify-center transition-all duration-500 ease-out -translate-x-1/2 -translate-y-1/2 group z-20 ${isActive ? 'scale-[1.4] z-30' : 'hover:scale-110'}`}
                    style={{ left: `${x}%`, top: `${y}%` }}
                  >
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center mb-2 transition-all duration-500 relative ${
                      isActive 
                        ? `bg-slate-50 dark:bg-slate-900 border-2 ${phase.borderColor} shadow-[0_0_30px_rgba(var(--tw-shadow-color),0.8)]` 
                        : `bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 backdrop-blur-md`
                    }`}>
                      {isActive && (
                        <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${phase.color} opacity-30 animate-pulse`} />
                      )}
                      <Icon className={`w-5 h-5 md:w-6 md:h-6 relative z-10 transition-colors duration-500 ${isActive ? phase.textLight : 'text-slate-500 group-hover:text-slate-400'}`} />
                    </div>
                    
                    <span className={`text-[10px] md:text-xs font-bold tracking-widest uppercase transition-all duration-500 whitespace-nowrap absolute top-[110%] ${isActive ? `${phase.textLight} drop-shadow-md` : 'text-slate-500 opacity-0 group-hover:opacity-100'}`}>
                      {phase.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Central Core / Hub */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-40 md:h-40 rounded-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center shadow-2xl z-10">
              <div className="absolute inset-0 rounded-full border border-slate-700/50 scale-[1.15] border-dashed animate-[spin_60s_linear_infinite_reverse]" />
              
              {/* Active Connection Line */}
              <div 
                className="absolute top-1/2 left-1/2 w-[150px] md:w-[190px] lg:w-[210px] h-[2px] origin-left transition-all duration-500 pointer-events-none"
                style={{ 
                  transform: `translateY(-50%) rotate(${activePhase * 45 - 90}deg)`,
                  zIndex: -1
                }}
              >
                <div className={`w-full h-full bg-gradient-to-r ${pipelinePhases[activePhase].color} opacity-40`} />
              </div>
              
              <span className="text-[10px] text-slate-500 tracking-[0.2em] mb-1">STEP</span>
              <span className={`text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br ${pipelinePhases[activePhase].color}`}>
                0{activePhase + 1}
              </span>
              
              <div className={`mt-2 w-2 h-2 rounded-full bg-gradient-to-br ${pipelinePhases[activePhase].color} animate-pulse`} />
            </div>

          </div>

          {/* Right: Holographic Display Pane */}
          <div className="w-full lg:w-[55%] flex-1 relative min-h-[400px] lg:min-h-0 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 overflow-hidden shadow-2xl" style={{ backdropFilter: 'blur(20px)' }}>
            
            {/* The active content layer */}
            {pipelinePhases.map((phase, index) => {
              const isActive = activePhase === index;
              if (!isActive) return null;
              
              return (
                <div 
                  key={phase.id}
                  className="absolute inset-0 p-6 md:p-10 flex flex-col h-full animate-in fade-in zoom-in-95 duration-300"
                >
                  {/* Intense Holographic Glow */}
                  <div className={`absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br ${phase.color} opacity-20 blur-[100px] rounded-full`} />
                  
                  {/* Content Header */}
                  <div className="flex items-center gap-3 mb-6 relative z-10 shrink-0">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${phase.color} shadow-lg`}>
                      <phase.icon className="w-6 h-6 text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <div className={`text-xs font-black tracking-widest uppercase mb-1 ${phase.textLight}`}>
                        Step 0{index + 1} — {phase.title}
                      </div>
                      <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                        {phase.heading}
                      </h3>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6 relative z-10 shrink-0">
                    {phase.description}
                  </p>
                  
                  {/* Highlights Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 relative z-10 shrink-0">
                    {phase.highlights.map((highlight, idx) => (
                      <div key={idx} className={`flex items-center gap-2 p-3 rounded-lg ${phase.bgLight} border ${phase.borderColor}`}>
                        <CheckCircle2 className={`w-4 h-4 shrink-0 ${phase.textLight}`} />
                        <span className="text-slate-700 dark:text-white text-xs font-bold leading-tight">{highlight}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Hacker Terminal */}
                  <div className="mt-auto relative z-10 shrink-0 bg-slate-100 dark:bg-[#02040a] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                    <div className="flex items-center justify-between px-4 py-2 bg-slate-200 dark:bg-slate-900 border-b border-slate-300 dark:border-slate-800">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Terminal className="w-3 h-3 text-slate-500" />
                        <span className="text-[10px] font-mono text-slate-500">zsh — sys_admin</span>
                      </div>
                    </div>
                    <div className={`p-4 font-mono text-xs md:text-sm ${phase.terminalColor} leading-relaxed`}>
                      {phase.terminal.map((line, i) => (
                        <div key={i} className="mb-1 opacity-90 animate-in fade-in slide-in-from-left-2" style={{ animationDelay: `${i * 150}ms`, animationFillMode: 'both' }}>
                          {line}
                        </div>
                      ))}
                      <div className="w-2 h-4 bg-white/70 animate-pulse mt-1 inline-block" />
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
          
        </div>
        
        {/* Mobile action button */}
        <div className="mt-6 md:hidden text-center shrink-0">
          <Link href="/internships">
            <button className="bg-white text-black font-bold py-3 px-8 rounded-full text-sm inline-flex items-center gap-2">
              Initialize Sequence
              <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
}
