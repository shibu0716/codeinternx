import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Code2, BookOpen, UserCheck, Award, Briefcase, FileCode2, LineChart, ShieldCheck, GraduationCap, FileText, ScrollText, Stamp, Database, LayoutTemplate, BrainCircuit, ArrowRight, Search, Mail, Kanban, GitPullRequest } from "lucide-react";
import { HowItWorks } from "@/components/HowItWorks";
import { Technologies } from "@/components/Technologies";
import { SuccessStories } from "@/components/SuccessStories";
import { ReviewsSection } from "@/components/ReviewsSection";
import { CTASection } from "@/components/CTASection";
import { HomeInternshipCard } from "@/components/HomeInternshipCard";

import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: activePrograms } = await supabase
    .from("programs")
    .select("*")
    .eq("status", "ACTIVE")
    .limit(3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Premium Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 overflow-hidden border-b border-slate-100 dark:border-slate-900">
        {/* Abstract Animated Background */}
        <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950 -z-20" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-10" />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/20 dark:bg-blue-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />
        <div className="absolute right-0 bottom-0 translate-x-1/3 translate-y-1/3 w-[600px] h-[600px] bg-indigo-500/20 dark:bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <Badge className="mb-8 inline-flex items-center gap-2 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 shadow-sm px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            YOUR JOURNEY TO A BETTER CAREER STARTS HERE
          </Badge>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 text-slate-900 dark:text-white leading-[1.1]">
            Build Skills. <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-600 dark:from-slate-500 dark:to-slate-300">Build Projects.</span> <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-400">Build Your Career.</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-slate-600 dark:text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Stop watching tutorials. Start building enterprise-grade applications. 
            Join our project-based engineering tracks designed to bypass resume filters.
          </p>
          
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
              <Link href="/login" className="w-full sm:w-auto">
                <div className="group relative inline-flex items-center justify-center w-full sm:w-auto px-8 h-14 text-[15px] font-bold text-white transition-all duration-200 bg-slate-900 dark:bg-slate-800 font-pj rounded-xl hover:bg-slate-800 dark:hover:bg-slate-700 shadow-md hover:-translate-y-0.5">
                  Start Your Internship
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
              <Link href="/verify" className="w-full sm:w-auto">
                <div className="inline-flex items-center justify-center w-full sm:w-auto px-8 h-14 text-[15px] font-bold text-slate-700 dark:text-slate-200 transition-all duration-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm hover:-translate-y-0.5">
                  Verify Certificate
                  <ShieldCheck className="w-4 h-4 ml-2 text-slate-500" />
                </div>
              </Link>
            </div>
            <Link href="/dashboard/offer-letter" className="w-full sm:w-auto">
              <div className="inline-flex items-center justify-center w-full sm:w-auto px-8 h-14 text-[15px] font-bold text-slate-700 dark:text-slate-200 transition-all duration-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm hover:-translate-y-0.5">
                Download Offer Letter
                <FileText className="w-4 h-4 ml-2 text-slate-500" />
              </div>
            </Link>
          </div>
          
          <div className="mt-16 flex flex-wrap justify-center gap-x-10 gap-y-6 text-sm font-semibold text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2 bg-white/50 dark:bg-slate-900/50 px-4 py-2 rounded-full border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-sm shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Verified Credentials
            </div>
            <div className="flex items-center gap-2 bg-white/50 dark:bg-slate-900/50 px-4 py-2 rounded-full border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-sm shadow-sm">
              <Code2 className="w-4 h-4 text-blue-500" /> Project-Based Learning
            </div>
            <div className="flex items-center gap-2 bg-white/50 dark:bg-slate-900/50 px-4 py-2 rounded-full border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-sm shadow-sm">
              <UserCheck className="w-4 h-4 text-indigo-500" /> Human Evaluation
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Students Section */}
      <section className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden border-b border-slate-100 dark:border-slate-900">
        <div className="container mx-auto max-w-6xl px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-[2.75rem] font-bold text-slate-900 dark:text-white mb-6 font-serif tracking-tight">
            Trusted by <span className="text-[#0084d1] font-sans font-bold">Students Worldwide</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-16 font-medium">
            CodeInternX has helped learners build skills, complete real projects, and grow their careers across multiple countries.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-[0_4px_25px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 relative overflow-hidden group transition-all text-center">
              <div className="absolute top-0 right-0 w-56 h-56 bg-gradient-to-bl from-[#eef2ff] to-transparent dark:from-blue-900/10 rounded-bl-[4rem] -z-10 transition-transform duration-500 group-hover:scale-110"></div>
              <div className="flex items-center justify-center gap-1.5 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Live Platform Metrics</span>
              </div>
              <h3 className="text-5xl font-light mb-5 text-transparent bg-clip-text bg-gradient-to-r from-[#0066ff] via-[#6633ff] to-[#9900ff] font-serif tracking-tighter">12,450+</h3>
              <h4 className="text-[13px] font-bold text-slate-900 dark:text-white mb-3 uppercase tracking-widest leading-relaxed">Students<br/>Joined</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium px-2">From learners across diverse tech backgrounds</p>
            </div>

            {/* Card 2 */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-[0_4px_25px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 relative overflow-hidden group transition-all text-center">
              <div className="absolute top-0 right-0 w-56 h-56 bg-gradient-to-bl from-[#fff0f5] to-transparent dark:from-purple-900/10 rounded-bl-[4rem] -z-10 transition-transform duration-500 group-hover:scale-110"></div>
              <div className="flex items-center justify-center gap-1.5 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Live Platform Metrics</span>
              </div>
              <h3 className="text-5xl font-light mb-5 text-transparent bg-clip-text bg-gradient-to-r from-[#9900ff] to-[#00aaff] font-serif tracking-tighter">8,920+</h3>
              <h4 className="text-[13px] font-bold text-slate-900 dark:text-white mb-3 uppercase tracking-widest leading-relaxed">Certificates<br/>Issued</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium px-2">Issued after verified assignment completion</p>
            </div>

            {/* Card 3 */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-[0_4px_25px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 relative overflow-hidden group transition-all text-center">
              <div className="absolute top-0 right-0 w-56 h-56 bg-gradient-to-bl from-[#f0fff4] to-transparent dark:from-emerald-900/10 rounded-bl-[4rem] -z-10 transition-transform duration-500 group-hover:scale-110"></div>
              <div className="flex items-center justify-center gap-1.5 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Live Platform Metrics</span>
              </div>
              <h3 className="text-5xl font-light mb-5 text-transparent bg-clip-text bg-gradient-to-r from-[#3366ff] to-[#aa33ff] font-serif tracking-tighter">120+</h3>
              <h4 className="text-[13px] font-bold text-slate-900 dark:text-white mb-3 uppercase tracking-widest leading-relaxed">Services</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium px-2">Tools, platforms, and active services combined</p>
            </div>

            {/* Card 4 */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-[0_4px_25px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 relative overflow-hidden group transition-all text-center">
              <div className="absolute top-0 right-0 w-56 h-56 bg-gradient-to-bl from-[#fff8f0] to-transparent dark:from-orange-900/10 rounded-bl-[4rem] -z-10 transition-transform duration-500 group-hover:scale-110"></div>
              <div className="flex items-center justify-center gap-1.5 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Live Platform Metrics</span>
              </div>
              <h3 className="text-5xl font-light mb-5 text-transparent bg-clip-text bg-gradient-to-r from-[#0088ff] to-[#8800ff] font-serif tracking-tighter">15+</h3>
              <h4 className="text-[13px] font-bold text-slate-900 dark:text-white mb-3 uppercase tracking-widest leading-relaxed">Countries</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium px-2">Global participation from learners worldwide</p>
            </div>
          </div>
          
          <div className="mt-16 flex flex-col items-center justify-center">
            <p className="text-xl md:text-2xl font-serif italic text-slate-700 dark:text-slate-300 mb-8 max-w-2xl text-center">
              "The best way to predict the future is to create it. Start building your career today."
            </p>
            <Link href="/login">
              <div className="group relative inline-flex items-center justify-center px-10 h-14 text-[15px] font-bold text-white transition-all duration-200 bg-slate-900 dark:bg-slate-800 font-pj rounded-xl hover:bg-slate-800 dark:hover:bg-slate-700 shadow-xl shadow-slate-200 dark:shadow-none hover:-translate-y-1">
                Start Your Internship
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works (Premium Scroll-Triggered Flow) */}
      <HowItWorks />
      
      <Technologies />

      <SuccessStories />

      <ReviewsSection />

      {/* Featured Internships (Premium Redesign) */}
      <section className="relative py-32 px-4 bg-slate-50 dark:bg-slate-950 border-y border-slate-200 dark:border-slate-900 overflow-hidden">
        {/* Subtle Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <Badge className="mb-4 bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 border-none font-semibold tracking-wider uppercase px-4 py-1">
                Active Programs
              </Badge>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">
                Intensive <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300">Engineering Tracks</span>
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Immersive, industry-aligned curriculums designed to push you beyond tutorial hell. Build production architectures, write scalable code, and deploy.
              </p>
            </div>
            <Link href="/login">
              <Button size="lg" className="h-12 px-8 rounded-full font-bold shadow-lg shadow-slate-200 dark:shadow-none hover:-translate-y-1 transition-transform">
                View All Programs
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {activePrograms && activePrograms.length > 0 ? (
              activePrograms.map((program: any, i: number) => {
                const colorSchemes = [
                  "from-blue-500 to-indigo-500",
                  "from-purple-500 to-pink-500",
                  "from-emerald-500 to-teal-500",
                  "from-orange-500 to-amber-500"
                ];
                
                const mappedProgram = {
                  ...program,
                  color: colorSchemes[i % colorSchemes.length],
                  shadow: `group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)]`,
                  duration: `${program.duration_months} Months`,
                  icon: <Database className="w-7 h-7" />,
                };

                return <HomeInternshipCard key={program.id} program={mappedProgram} />;
              })
            ) : (
              <div className="col-span-3 text-center py-12 text-slate-500">
                <p>New internship programs will be announced soon.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Bento Grid Redesign */}
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">The CodeInternX Difference</Badge>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              Not just another course. <br className="hidden md:block"/> An engineering accelerator.
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              We stripped away the fluff. No multiple-choice quizzes or passive video watching. You learn by building production-grade software and getting reviewed by real humans.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[300px]">
            
            {/* 1. Practical Projects (Large Card) */}
            <div className="col-span-1 md:col-span-4 lg:col-span-2 row-span-2 rounded-3xl bg-slate-950 overflow-hidden relative group border border-slate-800 transition-all duration-500 ease-out hover:scale-[1.03] hover:-translate-y-2 hover:shadow-2xl hover:z-10">
              {/* Background Glow */}
              <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-blue-500/20 blur-[100px] rounded-full pointer-events-none transition-all duration-700 group-hover:bg-blue-500/30" />
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                <Code2 className="w-10 h-10 text-blue-400 mb-4" />
                <h3 className="text-3xl font-bold text-white mb-3">100% Practical Execution</h3>
                <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                  You pass by building functioning applications. No multiple choice tests. You write code, solve bugs, and deploy to production.
                </p>
              </div>

              {/* Mock IDE Window */}
              <div className="absolute top-8 right-[-20%] w-[80%] h-[60%] bg-slate-900 rounded-xl border border-slate-700 shadow-2xl transform rotate-[-5deg] group-hover:rotate-0 group-hover:translate-x-[-20px] transition-all duration-700 overflow-hidden flex flex-col">
                <div className="h-8 bg-slate-950 border-b border-slate-800 flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="p-4 text-xs font-mono text-blue-300 leading-loose opacity-80">
                  <span className="text-purple-400">export default async function</span> <span className="text-blue-200">Checkout()</span> {'{'}<br/>
                  &nbsp;&nbsp;<span className="text-slate-500">// Initialize Stripe</span><br/>
                  &nbsp;&nbsp;<span className="text-purple-400">const</span> session = <span className="text-purple-400">await</span> stripe.checkout.sessions.<span className="text-blue-200">create</span>({'{\n'}
                  &nbsp;&nbsp;&nbsp;&nbsp;payment_method_types: [<span className="text-green-300">'card'</span>],<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;mode: <span className="text-green-300">'payment'</span>,<br/>
                  &nbsp;&nbsp;{'}'});<br/>
                  &nbsp;&nbsp;<span className="text-purple-400">return</span> {'<PaymentClient session={session} />'};<br/>
                  {'}'}
                </div>
              </div>
            </div>

            {/* 2. Human Evaluation (Wide Card) */}
            <div className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 overflow-hidden relative group border border-border transition-all duration-500 ease-out hover:scale-[1.03] hover:-translate-y-2 hover:shadow-2xl hover:z-10">
              <div className="absolute inset-0 p-8 flex flex-col justify-center z-10 w-[60%]">
                <UserCheck className="w-8 h-8 text-indigo-500 mb-3" />
                <h3 className="text-2xl font-bold mb-2">Senior Dev Code Reviews</h3>
                <p className="text-muted-foreground">
                  Your PRs are reviewed line-by-line by experienced engineers who provide actionable, real-world feedback.
                </p>
              </div>

              {/* Mock PR Review */}
              <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-[50%] bg-background rounded-xl shadow-xl border p-4 transform rotate-[-2deg] group-hover:rotate-[2deg] group-hover:scale-105 transition-all duration-500">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">SC</div>
                  <div>
                    <p className="text-sm font-bold leading-none">Sarah Chen</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Left a comment</p>
                  </div>
                </div>
                <div className="text-xs text-foreground bg-muted p-3 rounded-lg border-l-2 border-indigo-500">
                  "Great use of Redis here, but we should probably handle the cache invalidation on the webhook route."
                </div>
              </div>
            </div>

            {/* 3. Verified Certificates (Small Card) */}
            <div className="col-span-1 lg:col-span-1 row-span-1 rounded-3xl bg-emerald-500/10 overflow-hidden relative group border border-emerald-500/20 transition-all duration-500 ease-out hover:scale-[1.03] hover:-translate-y-2 hover:shadow-2xl hover:z-10">
              <div className="absolute inset-0 p-8 flex flex-col items-start justify-between z-10">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Verified Instantly</h3>
                  <p className="text-sm text-muted-foreground">
                    Unique URLs for employers to instantly verify your credential.
                  </p>
                </div>
              </div>
              <div className="absolute right-[-20%] bottom-[-20%] w-48 h-48 bg-emerald-500/20 rounded-full blur-[40px] pointer-events-none group-hover:bg-emerald-500/40 transition-colors" />
            </div>

            {/* 4. Portfolio Development (Small Card) */}
            <div className="col-span-1 lg:col-span-1 row-span-1 rounded-3xl bg-orange-500/10 overflow-hidden relative group border border-orange-500/20 transition-all duration-500 ease-out hover:scale-[1.03] hover:-translate-y-2 hover:shadow-2xl hover:z-10">
              <div className="absolute inset-0 p-8 flex flex-col items-start justify-between z-10">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Live Portfolio</h3>
                  <p className="text-sm text-muted-foreground">
                    Deploy actual apps that act as your interactive resume.
                  </p>
                </div>
              </div>
              <div className="absolute right-[-20%] top-[-20%] w-48 h-48 bg-orange-500/20 rounded-full blur-[40px] pointer-events-none group-hover:bg-orange-500/40 transition-colors" />
            </div>

          </div>
        </div>
      </section>

      {/* Skill Evaluation System - Premium Redesign */}
      <section className="py-32 px-4 bg-background text-foreground relative overflow-hidden border-t border-slate-100 dark:border-slate-900">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-20">
            <Badge className="mb-4 bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">
              Performance Analytics
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              Transparent <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500 dark:from-blue-400 dark:to-emerald-400">Skill Evaluation</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              No more black-box grading. Every line of code you write is evaluated against 50+ enterprise metrics to generate a comprehensive skill report.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Card 1: Overall Score (Large) */}
            <div className="lg:col-span-1 rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-none p-8 flex flex-col items-center justify-center relative overflow-hidden group hover:border-blue-300 dark:hover:border-blue-500/50 transition-colors duration-500">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <h3 className="text-slate-500 dark:text-slate-400 font-semibold mb-8 tracking-wide uppercase text-sm">Overall Candidate Score</h3>
              
              <div className="relative w-48 h-48 flex items-center justify-center mb-8 group-hover:scale-105 transition-transform duration-700">
                {/* SVG Donut Chart */}
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle cx="96" cy="96" r="88" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="12" fill="none" />
                  <circle cx="96" cy="96" r="88" className="stroke-blue-600 dark:stroke-blue-500" strokeWidth="12" fill="none" strokeDasharray="552.92" strokeDashoffset="60" strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease-out" }} />
                </svg>
                <div className="absolute inset-0 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/10 dark:group-hover:bg-blue-500/20 transition-colors duration-500" />
                <div className="text-center relative z-10">
                  <span className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter">89</span>
                  <span className="text-blue-600 dark:text-blue-400 text-xl font-bold">/100</span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-full font-semibold">
                <Award className="w-4 h-4" /> Top 15% of Cohort
              </div>
            </div>

            {/* Sub-grid for right side cards */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
              
              {/* Card 2: Skill Radar / Dimension Breakdown */}
              <div className="rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-none p-8 relative overflow-hidden group hover:border-purple-300 dark:hover:border-purple-500/50 transition-colors duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <h3 className="text-slate-900 dark:text-white font-bold text-xl mb-6 flex items-center gap-2 relative z-10">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 dark:text-purple-400" /> Evaluation Metrics
                </h3>
                
                <div className="space-y-5 relative z-10">
                  {[
                    { label: "Technical Implementation", score: 27, max: 30, color: "bg-blue-500" },
                    { label: "Project Quality (UI/UX)", score: 22, max: 25, color: "bg-purple-500" },
                    { label: "Requirements Fulfilled", score: 18, max: 20, color: "bg-emerald-500" },
                    { label: "Code Quality & Structure", score: 14, max: 15, color: "bg-amber-500" },
                    { label: "Professionalism & Commits", score: 8, max: 10, color: "bg-pink-500" },
                  ].map((item, i) => (
                    <div key={i} className="group/bar cursor-default">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{item.label}</span>
                        <span className="text-slate-900 dark:text-slate-400 font-bold group-hover/bar:text-slate-900 dark:group-hover/bar:text-white transition-colors">{item.score}/{item.max}</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                        <div className={`h-full rounded-full ${item.color} relative overflow-hidden`} style={{ width: `${(item.score / item.max) * 100}%` }}>
                          <div className="absolute inset-0 bg-white/30 translate-x-[-100%] group-hover/bar:animate-[shimmer_1s_infinite]" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 3: Senior Reviewer Feedback */}
              <div className="rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-none p-8 relative overflow-hidden group hover:border-emerald-300 dark:hover:border-emerald-500/50 transition-colors duration-500 flex flex-col">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-500/30">
                    SC
                  </div>
                  <div>
                    <h3 className="text-slate-900 dark:text-white font-bold">Sarah Chen</h3>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Senior Staff Engineer</p>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 mb-4 relative z-10 shadow-inner group-hover:border-slate-300 dark:group-hover:border-slate-700 transition-colors">
                  <div className="flex gap-2 mb-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400 dark:bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400 dark:bg-amber-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400 dark:bg-green-500/80" />
                  </div>
                  <pre className="text-[10px] sm:text-xs font-mono text-slate-700 dark:text-slate-300 overflow-x-auto leading-relaxed">
<span className="text-pink-600 dark:text-pink-400">export const</span> <span className="text-blue-600 dark:text-blue-400">authOptions</span> = {'{'}
  providers: [
    <span className="text-emerald-600 dark:text-emerald-400">GithubProvider</span>({'{'}
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
    {'}'})
  ]
{'}'};
                  </pre>
                </div>

                <div className="mt-auto relative z-10">
                  <p className="text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed border-l-2 border-emerald-400 dark:border-emerald-500/50 pl-4 py-1">
                    "Excellent use of NextAuth for the authentication layer. Your abstraction of the provider logic is very clean. For production, ensure you're validating the scopes being requested."
                  </p>
                </div>

              </div>

            </div>
          </div>
        </div>
      </section>

      {/* What You Get / Deliverables (Premium Redesign) */}
      <section className="relative py-16 md:py-24 px-4 bg-slate-950 text-slate-50 overflow-hidden border-b border-slate-900">
        {/* Animated Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[120px] pointer-events-none" />

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-12 lg:mb-16">
            <Badge className="mb-4 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border-indigo-500/30 font-medium tracking-wide uppercase px-4 py-1">
              Your Deliverables
            </Badge>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-purple-400">
              Proof of Work. <br className="hidden md:block" /> Not Just a Certificate.
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
              Walk away with a comprehensive, verifiable portfolio of your technical capabilities, designed specifically to bypass resume filters and impress engineering managers.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* The Deliverables List - Left Side */}
            <div className="lg:col-span-5 space-y-4 order-2 lg:order-1">
              {[
                {
                  icon: ScrollText,
                  title: "Official Offer & Completion Letter",
                  desc: "A professionally formatted document detailing your specific engineering role, project scope, and a verified reference signature."
                },
                {
                  icon: FileText,
                  title: "Granular Performance Report",
                  desc: "A detailed breakdown of your technical skills, code quality, and architectural decisions, reviewed manually by senior developers."
                },
                {
                  icon: Award,
                  title: "Cryptographically Verified Certificate",
                  desc: "A unique credential with a permanent verification URL that integrates directly into your LinkedIn 'Licenses & Certifications' section."
                },
                {
                  icon: Briefcase,
                  title: "Hosted Developer Portfolio",
                  desc: "A stunning, live portfolio page automatically generated to showcase the source code and live deployments of the apps you built."
                }
              ].map((item, i) => (
                <div 
                  key={i} 
                  className="group relative p-4 md:p-5 rounded-2xl bg-slate-900/50 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/50 transition-all duration-500 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/0 to-indigo-500/0 group-hover:from-indigo-500/10 transition-all duration-500" />
                  <div className="flex gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:border-indigo-500 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all duration-500">
                      <item.icon className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-1 text-slate-200 group-hover:text-white transition-colors">{item.title}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Visual Mockups - Right Side (Premium 3D Stack) */}
            <div className="lg:col-span-7 relative h-[500px] lg:h-[550px] w-full order-1 lg:order-2 perspective-[2000px] flex items-center justify-center lg:justify-end group/stack transform scale-90 lg:scale-100 origin-center lg:origin-right">
              
              {/* Glow Behind Mockups */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-indigo-500/30 blur-[100px] rounded-full pointer-events-none" />

              {/* 1. Offer Letter Mockup (Back Card) */}
              <div className="absolute right-0 md:right-8 top-8 w-[85%] sm:w-[75%] lg:w-[400px] h-[480px] bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6 md:p-8 transform rotate-y-[-15deg] rotate-x-[8deg] rotate-z-[6deg] hover:rotate-y-[-5deg] hover:rotate-x-[2deg] hover:rotate-z-[2deg] hover:translate-y-[-20px] transition-all duration-700 ease-out z-10 origin-bottom-right opacity-90 hover:z-50 group-hover/stack:opacity-40 group-hover/stack:scale-95 hover:!opacity-100 hover:!scale-[1.05]">
                
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                <div className="flex justify-between items-start mb-6 border-b border-slate-200 pb-4 relative z-10">
                  <div className="font-extrabold text-xl text-slate-900 tracking-tighter flex items-center gap-2">
                    <div className="w-5 h-5 bg-slate-900 rounded-md"></div>
                    CodeInternX
                  </div>
                  <div className="text-right text-[9px] text-slate-500 font-mono tracking-wider">
                    <p>DATE: AUG 24, 2026</p>
                  </div>
                </div>

                <h4 className="font-bold text-xs tracking-widest uppercase text-slate-800 mb-4">To Whomsoever It May Concern</h4>
                
                <div className="space-y-3 text-xs text-slate-700 font-serif leading-[1.8] text-justify relative z-10">
                  <p>
                    This letter certifies that <strong className="text-slate-900 border-b border-slate-300">Alex Student</strong> successfully completed a remote internship as a <strong className="text-slate-900">Backend Engineer</strong> at CodeInternX.
                  </p>
                  <p>
                    During this tenure, Alex exhibited exceptional technical acuity, architecting and deploying a highly scalable microservices backend.
                  </p>
                  <p>
                    We highly recommend them for any senior engineering role.
                  </p>
                </div>
                
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pt-4 border-t border-slate-200 z-10">
                  <div>
                    <div className="font-[signature] italic text-3xl mb-0 text-slate-800" style={{ fontFamily: "'Brush Script MT', cursive" }}>Sarah Chen</div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mt-1">VP of Engineering</p>
                  </div>
                </div>
              </div>

              {/* 2. Certificate of Completion (Middle Card) */}
              <div className="absolute right-4 md:right-16 top-24 w-[90%] sm:w-[85%] lg:w-[480px] h-[340px] bg-slate-50 rounded-lg shadow-[0_30px_60px_rgba(0,0,0,0.6)] border-[8px] border-double border-slate-300 p-8 transform rotate-y-[-5deg] rotate-x-[2deg] rotate-z-[-2deg] hover:rotate-y-0 hover:rotate-x-0 hover:rotate-z-0 hover:translate-y-[-15px] hover:translate-x-[-10px] transition-all duration-700 ease-out z-20 origin-center text-center overflow-hidden flex flex-col justify-center items-center hover:z-50 group-hover/stack:opacity-40 group-hover/stack:scale-95 hover:!opacity-100 hover:!scale-[1.08]">
                
                {/* Certificate Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                  <div className="absolute top-[-50px] left-[-50px] w-[150px] h-[150px] border-[20px] border-indigo-900 rounded-full"></div>
                  <div className="absolute bottom-[-50px] right-[-50px] w-[150px] h-[150px] border-[20px] border-indigo-900 rounded-full"></div>
                </div>

                <h3 className="font-serif text-slate-500 uppercase tracking-[0.3em] text-xs mb-2 relative z-10">Certificate of Excellence</h3>
                <h2 className="font-extrabold text-3xl text-slate-900 tracking-tight mb-4 relative z-10">CodeInternX Global</h2>
                <p className="text-xs text-slate-500 mb-2 relative z-10">This certifies that</p>
                <p className="text-2xl font-[signature] text-indigo-900 mb-2 relative z-10" style={{ fontFamily: "'Brush Script MT', cursive" }}>Alex Student</p>
                <p className="text-xs text-slate-600 max-w-[80%] mx-auto leading-relaxed mb-6 relative z-10">
                  has successfully completed the <strong>Full Stack Engineering</strong> intensive program and has demonstrated outstanding proficiency in modern web architecture.
                </p>

                <div className="w-full flex justify-between items-end mt-auto px-4 relative z-10">
                  <div className="text-center">
                    <div className="w-24 border-b border-slate-400 mb-1"></div>
                    <p className="text-[8px] uppercase tracking-wider text-slate-500">Date Issued</p>
                  </div>
                  <Stamp className="w-16 h-16 text-indigo-700/80 rotate-[15deg] opacity-90 mix-blend-multiply mb-[-10px]" />
                  <div className="text-center">
                    <div className="w-24 border-b border-slate-400 mb-1"></div>
                    <p className="text-[8px] uppercase tracking-wider text-slate-500">Program Director</p>
                  </div>
                </div>
              </div>

              {/* 3. Performance Report Mockup (Front Card - Glassmorphism) */}
              <div className="absolute bottom-12 lg:bottom-4 left-0 md:left-4 w-[95%] sm:w-[85%] lg:w-[420px] bg-slate-900/70 backdrop-blur-2xl rounded-2xl border border-slate-700/50 shadow-[0_40px_80px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.1)] p-6 md:p-8 transform rotate-y-[12deg] rotate-x-[-8deg] rotate-z-[4deg] hover:rotate-y-[5deg] hover:rotate-x-[-2deg] hover:rotate-z-[2deg] hover:translate-y-[-10px] hover:translate-x-[15px] transition-all duration-700 ease-out z-30 origin-bottom-left hover:z-50 group-hover/stack:opacity-40 group-hover/stack:scale-95 hover:!opacity-100 hover:!scale-[1.05]">
                
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-t-2xl" />

                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h4 className="font-bold text-xl text-white mb-1">Performance Report</h4>
                    <p className="text-xs text-slate-400 font-mono">ID: PERF-2026-X892</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                    <LineChart className="w-6 h-6 text-indigo-400" />
                  </div>
                </div>
                
                <div className="mb-6 pb-6 border-b border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Overall Score</p>
                    <div className="text-4xl font-black text-white">92<span className="text-xl text-slate-500 font-medium">/100</span></div>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 text-xs">
                    Top 5% of Cohort
                  </Badge>
                </div>

                <div className="space-y-4">
                  {[
                    { label: "Systems Architecture", score: 96, color: "bg-indigo-500" },
                    { label: "API Design & REST", score: 92, color: "bg-purple-500" },
                    { label: "Code Maintainability", score: 91, color: "bg-blue-500" }
                  ].map((metric, idx) => (
                    <div key={idx} className="group/metric">
                      <div className="flex justify-between text-sm font-medium mb-1.5">
                        <span className="text-slate-300">{metric.label}</span>
                        <span className="text-white">{metric.score}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${metric.color} rounded-full relative group-hover/metric:shadow-[0_0_10px_currentColor] transition-all duration-300`} 
                          style={{ width: `${metric.score}%` }} 
                        >
                          <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]" style={{ transform: 'translateX(-100%)' }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </section>

      {/* College Partnerships Premium Redesign */}
      <section className="py-32 px-4 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-900 relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 lg:p-16 overflow-hidden relative shadow-2xl dark:shadow-none hover:border-blue-500/30 transition-colors duration-500 group">
            {/* Soft Glow */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3 group-hover:bg-blue-500/20 transition-colors duration-700" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
              
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-widest">
                  <GraduationCap className="w-4 h-4" /> B2B Institutional Partnerships
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                  Supercharge Your <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-400">Computer Science</span> Dept.
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg">
                  Provide your students with structured, industry-aligned internship programs. Track cohort progress, review deep-dive technical evaluations, and issue cryptographically verifiable credentials via our Institutional Dashboard.
                </p>
                
                <ul className="space-y-4">
                  {[
                    "Live Cohort Tracking & Analytics",
                    "Automated Technical Evaluations",
                    "Verified Skill Credentials for Placements"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium">
                      <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="pt-4">
                  <Link href="/colleges">
                    <Button size="lg" className="h-14 px-8 text-base font-bold bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
                      Partner With Us
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right Side UI Mockup */}
              <div className="relative w-full h-[400px] rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-hidden group/mockup hover:-translate-y-2 hover:shadow-[0_20px_50px_-12px_rgba(59,130,246,0.3)] transition-all duration-500">
                <div className="absolute top-0 left-0 w-full h-12 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 gap-4">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400 dark:bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-400 dark:bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-400 dark:bg-green-500/80" />
                  </div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">University Admin Portal</div>
                </div>
                
                <div className="mt-10 space-y-4">
                  <div className="flex justify-between items-end mb-6">
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Winter 2026 Cohort</div>
                      <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">Student Progress</div>
                    </div>
                    <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-md border border-emerald-200 dark:border-emerald-500/20">
                      84% Completion
                    </div>
                  </div>

                  {/* Mock Student Rows */}
                  {[
                    { name: "Alex Jenkins", track: "Backend Eng.", progress: 100, status: "Certified", color: "bg-emerald-500" },
                    { name: "Sarah Chen", track: "Full-Stack Eng.", progress: 85, status: "In Progress", color: "bg-blue-500" },
                    { name: "Michael Ross", track: "Frontend Eng.", progress: 40, status: "In Progress", color: "bg-amber-500" },
                  ].map((student, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer group/row">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover/row:text-blue-600 dark:group-hover/row:text-blue-400 transition-colors">{student.name}</div>
                          <div className="text-[10px] font-medium text-slate-500">{student.track}</div>
                        </div>
                      </div>
                      <div className="flex-1 max-w-[120px] mx-4 hidden sm:block">
                        <div className="flex justify-between text-[10px] mb-1 text-slate-500">
                          <span>Progress</span>
                          <span>{student.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className={`h-full ${student.color} rounded-full relative overflow-hidden`} style={{ width: `${student.progress}%` }}>
                             {student.progress < 100 && <div className="absolute inset-0 bg-white/30 translate-x-[-100%] group-hover/row:animate-[shimmer_1s_infinite]" />}
                          </div>
                        </div>
                      </div>
                      <div className={`text-[10px] font-bold px-2 py-1 rounded border ${student.progress === 100 ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'}`}>
                        {student.status}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Fade Out Gradient at bottom */}
                <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white dark:from-slate-950 to-transparent pointer-events-none" />
              </div>

            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
