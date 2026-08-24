import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlayCircle, BookOpen, Clock, Award, Shield, CheckCircle2, MonitorPlay, Code2, Users } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export async function generateStaticParams() {
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: programs } = await supabase.from("programs").select("slug").eq("category", "COURSE");
  
  return (programs || []).map((program) => ({
    slug: program.slug,
  }));
}

export default async function CourseSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: course } = await supabase
    .from("programs")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!course) {
    notFound();
  }

  // Fetch tasks to use as modules
  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("program_id", course.id)
    .order("week_number", { ascending: true });

  const taskList = tasks || [];
  
  const modules = taskList.map((task) => ({
    title: task.title,
    duration: "Self-paced",
  }));

  // fallback modules if no tasks
  if (modules.length === 0) {
    for (let i = 1; i <= course.duration_weeks; i++) {
      modules.push({ title: `Module ${i}`, duration: "Self-paced" });
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 selection:bg-indigo-500/30 pb-20">
      
      {/* Premium Dark Hero Section */}
      <section className="relative bg-slate-950 pt-20 pb-32 px-4 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/20 blur-[120px] pointer-events-none" />

        <div className="container mx-auto max-w-6xl relative z-10">
          <Link href="/courses" className="inline-flex items-center text-sm font-semibold text-slate-400 hover:text-indigo-400 mb-8 transition-colors group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to all courses
          </Link>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <Badge className="bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20 uppercase tracking-widest text-xs px-4 py-1.5 font-semibold rounded-full mb-6 inline-flex items-center gap-2">
                <Shield className="w-4 h-4" />
                {course.level} COURSE
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter mb-6 text-white leading-[1.1]">
                {course.title}
              </h1>
              <p className="text-lg text-slate-400 leading-relaxed font-light mb-8 max-w-xl">
                {course.description}
              </p>
              
              <div className="flex flex-wrap gap-4 items-center">
                <Button size="lg" className="h-14 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-base shadow-lg shadow-indigo-900/20 transition-all hover:-translate-y-1 gap-2">
                  <PlayCircle className="w-5 h-5" /> Enroll Now
                </Button>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-300 ml-4">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>2,400+ Students Enrolled</span>
                </div>
              </div>
            </div>

            {/* Video Preview Mockup */}
            <div className="relative group perspective-1000">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/30 to-cyan-500/30 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500 opacity-50"></div>
              <div className="relative bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl aspect-video flex items-center justify-center transform transition-transform duration-500 hover:rotate-y-2 hover:rotate-x-2">
                <MonitorPlay className="w-20 h-20 text-slate-700 group-hover:text-indigo-500 transition-colors duration-500" />
                <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-transparent transition-colors duration-500"></div>
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center px-4 py-2 bg-slate-950/80 backdrop-blur-md rounded-xl border border-slate-800">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-2"><PlayCircle className="w-4 h-4 text-indigo-400" /> Course Preview</span>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Free Preview</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-6xl px-4 mt-[-40px] relative z-20">
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Duration</p>
              <p className="text-lg font-bold text-slate-900">{course.duration_weeks} Weeks</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6 text-cyan-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Content</p>
              <p className="text-lg font-bold text-slate-900">{modules.length} Modules</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Certificate</p>
              <p className="text-lg font-bold text-slate-900">Included</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 items-start">
          {/* Main Curriculum Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Code2 className="w-6 h-6 text-indigo-600" /> What You'll Learn
              </h2>
              <div className="grid sm:grid-cols-2 gap-4 mb-10">
                {["Master core principles", "Ace technical interviews", "Build scalable systems", "Industry best practices"].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-slate-600 font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3 border-t border-slate-100 pt-8">
                <BookOpen className="w-5 h-5 text-indigo-600" /> Course Curriculum
              </h3>
              <div className="space-y-4">
                {modules.map((module, index: number) => (
                  <div key={index} className="group bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-center justify-between hover:bg-white hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm group-hover:bg-indigo-100 group-hover:text-indigo-700 transition-colors">
                        {index + 1}
                      </div>
                      <h4 className="font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">{module.title}</h4>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-slate-500">{module.duration}</span>
                      <PlayCircle className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1 sticky top-24">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Instructor</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-white shadow-md">
                  <span className="text-2xl font-bold text-indigo-700">CI</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">CodeInternX Team</h4>
                  <p className="text-sm text-slate-500">Senior Engineering Leads</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-6 pb-6 border-b border-slate-100">
                Taught by industry veterans who have built scalable systems for millions of users. Get real-world insights, not just theory.
              </p>
              <div className="space-y-4">
                <Button className="w-full h-12 text-base font-bold bg-indigo-600 hover:bg-indigo-700 shadow-md">
                  Enroll for ₹{course.price}
                </Button>
                <p className="text-xs text-center text-slate-500 flex items-center justify-center gap-1">
                  <Shield className="w-3 h-3" /> 30-Day Money-Back Guarantee
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
