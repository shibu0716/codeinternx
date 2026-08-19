import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, ArrowRight, Route } from "lucide-react";

export const metadata = {
  title: "Developer Roadmaps | CodeInternX",
  description: "Step-by-step guides and learning paths to become a professional software engineer in 2026.",
};

const ROADMAPS = [
  {
    title: "Frontend Developer Roadmap",
    description: "The modern path to building scalable user interfaces.",
    steps: [
      { name: "Internet Fundamentals & HTML/CSS", completed: true },
      { name: "JavaScript & DOM Manipulation", completed: true },
      { name: "React Ecosystem (Hooks, Context)", completed: false },
      { name: "State Management (Redux/Zustand)", completed: false },
      { name: "Next.js & Server Components", completed: false },
    ]
  },
  {
    title: "Backend Developer Roadmap",
    description: "Learn to build robust APIs, manage databases, and deploy servers.",
    steps: [
      { name: "Node.js & Express Fundamentals", completed: false },
      { name: "Relational Databases (PostgreSQL)", completed: false },
      { name: "Authentication & Authorization (JWT)", completed: false },
      { name: "Caching (Redis) & Performance", completed: false },
      { name: "Docker & Containerization", completed: false },
    ]
  }
];

export default function RoadmapsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 selection:bg-indigo-500/30">
      
      {/* Premium Hero Section */}
      <section className="relative bg-slate-950 pt-24 pb-32 px-4 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/20 blur-[120px] pointer-events-none" />

        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <Badge className="bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border border-purple-500/20 uppercase tracking-widest text-xs px-4 py-1.5 font-semibold rounded-full mb-8 inline-flex items-center gap-2">
            <Route className="w-4 h-4 text-purple-400" />
            Learning Paths
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter mb-6 text-white leading-[1.1]">
            Developer <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Roadmaps 2026</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
            Not sure what to learn next? Follow our industry-vetted roadmaps to guide your self-study before jumping into an internship.
          </p>
        </div>
      </section>

      {/* Roadmaps Grid */}
      <div className="container mx-auto max-w-5xl px-4 py-16 -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {ROADMAPS.map((roadmap) => (
            <div key={roadmap.title} className="space-y-6">
              
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center md:text-left">
                <h2 className="text-2xl font-bold tracking-tight mb-2 text-slate-900">{roadmap.title}</h2>
                <p className="text-slate-500">{roadmap.description}</p>
              </div>
              
              <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
                <div className="divide-y divide-slate-100">
                  {roadmap.steps.map((step, index) => (
                    <div key={index} className="group p-5 md:p-6 flex items-start gap-5 hover:bg-slate-50 transition-colors">
                      <div className="mt-0.5 shrink-0 relative">
                        {step.completed ? (
                          <>
                            <div className="absolute inset-0 bg-green-500/20 rounded-full blur-md"></div>
                            <CheckCircle2 className="w-6 h-6 text-green-500 relative z-10" />
                          </>
                        ) : (
                          <Circle className="w-6 h-6 text-slate-300 group-hover:text-indigo-400 transition-colors" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-semibold text-lg ${step.completed ? 'text-slate-900' : 'text-slate-700'}`}>
                          Step {index + 1}: {step.name}
                        </h4>
                        {!step.completed && (
                          <button className="text-sm text-indigo-600 font-medium mt-2 flex items-center gap-1 hover:text-indigo-700 hover:underline transition-all">
                            View resources <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
