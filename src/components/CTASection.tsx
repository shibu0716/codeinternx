"use client";

import { Sparkles, ArrowRight, Mail, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-24 px-4 bg-white dark:bg-slate-950">
      <div className="container mx-auto max-w-6xl">
        <div className="relative rounded-[3rem] bg-[#0A0F1C] overflow-hidden border border-slate-800 shadow-2xl py-20 px-6 md:px-12 text-center">
          
          {/* Subtle Hex/Cube Pattern Background */}
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='104' viewBox='0 0 60 104' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 17.32v34.64L30 69.28 0 51.96V17.32L30 0zM15 25.98v34.64l15 8.66 15-8.66V25.98l-15-8.66-15 8.66z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              backgroundSize: '60px 104px',
            }}
          />
          
          {/* Top Gradient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 mb-8 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-300">Begin Your Journey</span>
            </div>

            {/* Heading */}
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium tracking-tight text-white mb-8">
              Build Skills. <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 font-serif">Create Projects.</span><br className="hidden md:block" /> Grow Your Career.
            </h2>

            {/* Description */}
            <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-12">
              Start your virtual internship journey with CodeInternX. Work on practical projects, improve your skills, and earn a verified certificate to showcase your achievements.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 w-full sm:w-auto">
              <Link 
                href="/login" 
                className="w-full sm:w-auto bg-white hover:bg-slate-100 text-slate-900 font-bold py-4 px-8 rounded-2xl transition-all flex items-center justify-center gap-2 text-base"
              >
                Start Internship
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <Link 
                href="/contact" 
                className="w-full sm:w-auto bg-transparent border border-slate-700 hover:border-slate-500 hover:bg-slate-800/50 text-white font-bold py-4 px-8 rounded-2xl transition-all flex items-center justify-center gap-2 text-base"
              >
                Talk to Support
                <Mail className="w-5 h-5" />
              </Link>
            </div>

            {/* Bottom Features */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-center justify-center pt-8 border-t border-slate-800/60 w-full max-w-4xl opacity-60">
              {[
                "VERIFIED CERTIFICATES",
                "PROJECT-BASED LEARNING",
                "CAREER-FOCUSED SKILLS"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-400 text-sm font-bold tracking-widest uppercase">
                  <CheckCircle2 className="w-4 h-4" />
                  {feature}
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
