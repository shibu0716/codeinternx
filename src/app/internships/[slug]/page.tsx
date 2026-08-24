import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, Clock, MapPin, BarChart, FileCode2, Target, Briefcase, Zap, Check } from "lucide-react";
import { EnrollmentCard } from "@/components/EnrollmentCard";
import { createClient } from "@/utils/supabase/server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export async function generateStaticParams() {
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: programs } = await supabase.from("programs").select("slug").eq("category", "INTERNSHIP");
  
  return (programs || []).map((program) => ({
    slug: program.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: program } = await supabase.from("programs").select("title, description").eq("slug", slug).single();
  
  if (!program) return { title: "Not Found" };

  return {
    title: `${program.title} Internship | CodeInternX`,
    description: program.description,
  };
}

export default async function InternshipDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const supabase = await createClient();
  
  const { data: internship } = await supabase
    .from("programs")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!internship) {
    notFound();
  }

  const { data: { user } } = await supabase.auth.getUser();

  // Fetch tasks to build the curriculum and stats
  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("program_id", internship.id)
    .order("week_number", { ascending: true });
    
  const taskList = tasks || [];
  const numberOfTasks = taskList.length;
  const finalProjectTask = taskList.find(t => t.is_final_project) || taskList[taskList.length - 1];
  const finalProjectTitle = finalProjectTask ? finalProjectTask.title : "Comprehensive Final Project";
  const expectedWorkload = "10-15 hours/week";

  // Build curriculum from tasks
  const curriculum = taskList.map((task) => ({
    week: task.week_number,
    title: task.title
  }));
  
  // fallback curriculum if no tasks
  if (curriculum.length === 0) {
    for (let i = 1; i <= internship.duration_weeks; i++) {
      curriculum.push({ week: i, title: `Week ${i} Curriculum` });
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 selection:bg-indigo-500/30">
      {/* Hero Header - Premium Dark Theme */}
      <section className="relative bg-slate-950 pt-24 pb-32 px-4 overflow-hidden border-b border-slate-800">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Hero Content */}
            <div className="lg:col-span-7 lg:pr-8">
              <div className="flex items-center gap-3 mb-6">
                <Badge className="bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20 uppercase tracking-widest text-[10px] px-3 py-1 font-semibold rounded-full">
                  {internship.category}
                </Badge>
                <Badge className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 uppercase tracking-widest text-[10px] px-3 py-1 font-semibold rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Admissions Open
                </Badge>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tighter mb-6 text-white leading-[1.1]">
                {internship.title} <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Internship</span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed font-light">
                {internship.description} Build production-grade features, get your code reviewed by senior engineers, and earn a verifiable credential that bypasses resume filters.
              </p>
              
              <div className="flex flex-wrap items-center gap-4 md:gap-8 bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-xl w-fit">
                <div className="flex flex-col gap-1">
                  <span className="text-slate-500 text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Duration</span>
                  <span className="text-white font-medium">{internship.duration_weeks} Weeks</span>
                </div>
                <div className="w-px h-10 bg-slate-800 hidden md:block"></div>
                <div className="flex flex-col gap-1">
                  <span className="text-slate-500 text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Location</span>
                  <span className="text-white font-medium">{internship.mode}</span>
                </div>
                <div className="w-px h-10 bg-slate-800 hidden md:block"></div>
                <div className="flex flex-col gap-1">
                  <span className="text-slate-500 text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5"><BarChart className="w-3.5 h-3.5" /> Level</span>
                  <span className="text-white font-medium">{internship.level}</span>
                </div>
              </div>
            </div>

            {/* Desktop Quick Enrollment Card (Floating right) */}
            <div className="hidden lg:block lg:col-span-5 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-3xl blur-2xl transform scale-95" />
              <div className="relative transform hover:-translate-y-2 transition-transform duration-500">
                <EnrollmentCard internship={internship} user={user} />
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-16 md:py-24 px-4 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column: Details */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-16">
              
              {/* Scope & Impact */}
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center border border-indigo-200 shadow-inner">
                    <Target className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight text-slate-900">Scope & Impact</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <Zap className="w-6 h-6 text-amber-500 mb-4" />
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Workload</p>
                    <p className="text-xl font-bold text-slate-900">{expectedWorkload}</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <Briefcase className="w-6 h-6 text-emerald-500 mb-4" />
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Tasks</p>
                    <p className="text-xl font-bold text-slate-900">{numberOfTasks}</p>
                  </div>
                  <div className="bg-indigo-950 p-6 rounded-2xl border border-indigo-900 shadow-lg text-white">
                    <FileCode2 className="w-6 h-6 text-indigo-400 mb-4" />
                    <p className="text-sm font-semibold text-indigo-300 uppercase tracking-wider mb-2">Final Project</p>
                    <p className="text-lg font-bold leading-tight">{finalProjectTitle}</p>
                  </div>
                </div>
              </div>

              {/* Technologies */}
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-6 flex items-center gap-3">
                  <div className="w-2 h-6 bg-indigo-500 rounded-full"></div>
                  Tech Stack You Will Master
                </h2>
                <div className="flex flex-wrap gap-3">
                  {(internship.technologies || []).map((tech: string) => (
                    <div key={tech} className="px-5 py-2.5 bg-white border border-slate-200 shadow-sm rounded-xl text-sm font-semibold text-slate-700 flex items-center gap-2 hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
                      <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                      {tech}
                    </div>
                  ))}
                </div>
              </div>

              {/* Curriculum */}
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-6 flex items-center gap-3">
                  <div className="w-2 h-6 bg-purple-500 rounded-full"></div>
                  Execution Roadmap
                </h2>
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-2">
                  <Accordion className="w-full">
                    {curriculum.map((item) => (
                      <AccordionItem key={item.week} value={`week-${item.week}`} className="border-b-slate-100 last:border-0 px-4">
                        <AccordionTrigger className="text-lg font-semibold hover:no-underline py-6">
                          <span className="flex items-center gap-4 text-left">
                            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-50 text-purple-600 border border-purple-100 text-sm font-bold shrink-0">
                              {item.week}
                            </span>
                            <span className="text-slate-800">{item.title}</span>
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-600 text-base leading-relaxed pl-[3.5rem] pb-6">
                          <p className="mb-3">During this phase, you will complete production-grade tasks based on standard industry workflows. You will submit your code via Pull Requests for asynchronous evaluation.</p>
                          <ul className="space-y-2 mt-4">
                            <li className="flex items-start gap-2"><Check className="w-4 h-4 text-emerald-500 mt-1 shrink-0"/> Write robust code following best practices.</li>
                            <li className="flex items-start gap-2"><Check className="w-4 h-4 text-emerald-500 mt-1 shrink-0"/> Handle edge cases and optimize performance.</li>
                            <li className="flex items-start gap-2"><Check className="w-4 h-4 text-emerald-500 mt-1 shrink-0"/> Receive feedback from senior developers.</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
              
              {/* What You Receive */}
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-6 flex items-center gap-3">
                  <div className="w-2 h-6 bg-emerald-500 rounded-full"></div>
                  What You Receive
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    "Detailed Project Evaluation",
                    "Verified Certificate of Completion",
                    "Comprehensive Skill Report",
                    "Letter of Recommendation",
                    "Hosted Portfolio Page",
                    "Lifetime Access to Resources"
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="font-semibold text-slate-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile / Sticky Right Column: Enrollment Card */}
            <div className="lg:col-span-5 xl:col-span-4 relative">
              <div className="lg:sticky lg:top-24 mt-8 lg:mt-0 block lg:hidden">
                <EnrollmentCard internship={internship} user={user} />
              </div>
              <div className="hidden lg:block lg:sticky lg:top-24">
                <div className="opacity-0 translate-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-forwards" style={{ animationDelay: '500ms' }}>
                  <EnrollmentCard internship={internship} user={user} />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
