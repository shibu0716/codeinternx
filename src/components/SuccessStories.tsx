"use client";

import { Briefcase, ArrowRight } from "lucide-react";
import Link from "next/link";

const row1 = [
  { name: "Amazon", color: "text-[#FF9900]", glow: "shadow-[0_10px_40px_-10px_rgba(255,153,0,0.3)]" },
  { name: "Meta", color: "text-[#0668E1]", glow: "shadow-[0_10px_40px_-10px_rgba(6,104,225,0.3)]" },
  { name: "Netflix", color: "text-[#E50914]", glow: "shadow-[0_10px_40px_-10px_rgba(229,9,20,0.3)]" },
  { name: "Apple", color: "text-slate-900 dark:text-white", glow: "shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_-10px_rgba(255,255,255,0.1)]" },
  { name: "Google", color: "text-[#4285F4]", glow: "shadow-[0_10px_40px_-10px_rgba(66,133,244,0.3)]" },
  { name: "Microsoft", color: "text-[#00A4EF]", glow: "shadow-[0_10px_40px_-10px_rgba(0,164,239,0.3)]" },
];

const row2 = [
  { name: "Oracle", color: "text-[#F80000]", glow: "shadow-[0_10px_40px_-10px_rgba(248,0,0,0.3)]" },
  { name: "Adobe", color: "text-[#FF0000]", glow: "shadow-[0_10px_40px_-10px_rgba(255,0,0,0.3)]" },
  { name: "Intel", color: "text-[#0071C5]", glow: "shadow-[0_10px_40px_-10px_rgba(0,113,197,0.3)]" },
  { name: "Samsung", color: "text-[#1428A0]", glow: "shadow-[0_10px_40px_-10px_rgba(20,40,160,0.3)]" },
  { name: "Uber", color: "text-slate-900 dark:text-white", glow: "shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_-10px_rgba(255,255,255,0.1)]" },
  { name: "IBM", color: "text-[#0530AD]", glow: "shadow-[0_10px_40px_-10px_rgba(5,48,173,0.3)]" },
];

const CompanyCard = ({ company }: { company: any }) => (
  <div className={`mx-4 flex items-center gap-3 px-8 py-4 bg-white dark:bg-slate-900 rounded-3xl ${company.glow} border border-slate-100 dark:border-slate-800 shrink-0 hover:scale-105 transition-transform duration-300`}>
    <Briefcase className={`w-6 h-6 ${company.color}`} strokeWidth={2} />
    <span className={`text-xl font-black tracking-wide ${company.color}`}>
      {company.name}
    </span>
  </div>
);

export function SuccessStories() {
  return (
    <section className="py-24 px-4 bg-[#f8fafc] dark:bg-slate-950 overflow-hidden relative border-t border-slate-100 dark:border-slate-900">
      <div className="container mx-auto max-w-7xl relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 font-bold text-[10px] uppercase tracking-widest mb-6">
            SUCCESS STORIES
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-serif font-medium text-slate-900 dark:text-white mb-6 tracking-tight">
            Companies Where Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 font-serif">Learners Have Progressed</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Our programs focus on building real skills that align with industry requirements across leading technology companies.
          </p>
        </div>

        {/* Marquee Grids */}
        <div className="relative flex flex-col gap-8 mb-20 -mx-4 lg:-mx-20 overflow-hidden">
          {/* Fading Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-40 bg-gradient-to-r from-[#f8fafc] dark:from-slate-950 to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-40 bg-gradient-to-l from-[#f8fafc] dark:from-slate-950 to-transparent z-20 pointer-events-none" />

          {/* Row 1: Scrolling Left */}
          <div className="flex w-max animate-marquee">
            <div className="flex shrink-0">
              {row1.map((company, i) => <CompanyCard key={i} company={company} />)}
            </div>
            <div className="flex shrink-0">
              {row1.map((company, i) => <CompanyCard key={`dup-${i}`} company={company} />)}
            </div>
          </div>

          {/* Row 2: Scrolling Right */}
          <div className="flex w-max animate-marquee-reverse">
            <div className="flex shrink-0">
              {row2.map((company, i) => <CompanyCard key={i} company={company} />)}
            </div>
            <div className="flex shrink-0">
              {row2.map((company, i) => <CompanyCard key={`dup-${i}`} company={company} />)}
            </div>
          </div>
        </div>

        {/* Bottom Quote & Button */}
        <div className="text-center">
          <p className="text-sm md:text-base font-serif italic text-slate-400 dark:text-slate-500 mb-8 max-w-2xl mx-auto">
            "Logos represent companies in the broader tech ecosystem. Individual outcomes may vary."
          </p>
          <Link href="/internships">
            <button className="bg-[#0084d1] hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-xl text-sm inline-flex items-center gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
              Explore Internship Tracks
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
}
