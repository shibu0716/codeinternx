"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ReactNode } from "react";

interface HomeInternshipCardProps {
  program: {
    title: string;
    level: string;
    mode: string;
    skills: string[];
    slug: string;
    color: string;
    shadow: string;
    icon: ReactNode;
    description: string;
  };
}

export function HomeInternshipCard({ program }: HomeInternshipCardProps) {
  const [duration, setDuration] = useState<number>(1);

  const pricingMap: Record<number, number> = {
    1: 99,
    2: 199,
    3: 299,
    6: 499,
  };

  const currentPrice = pricingMap[duration];

  return (
    <div className={`relative group rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 hover:-translate-y-3 transition-all duration-500 shadow-xl dark:shadow-none ${program.shadow} overflow-hidden flex flex-col h-full`}>
      {/* Top Gradient Line */}
      <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${program.color}`} />
      
      {/* Subtle internal glow */}
      <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl ${program.color} opacity-[0.03] dark:opacity-10 rounded-full blur-3xl group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-700`} />

      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className={`w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 group-hover:scale-110 transition-transform duration-500 shadow-sm shrink-0`}>
          {program.icon}
        </div>
        <div className="flex gap-2 text-[10px] font-black uppercase tracking-widest">
          <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1.5 rounded-full">{program.mode}</span>
        </div>
      </div>

      <div className="mb-4 relative z-10">
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase mb-2">Level: {program.level}</p>
        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight transition-colors mb-3">
          {program.title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4 line-clamp-3">
          {program.description}
        </p>
      </div>

      {/* Dynamic Duration and Pricing Section */}
      <div className="mb-6 relative z-10 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Duration</span>
          <span className="text-xl font-black text-primary">₹{currentPrice}</span>
        </div>
        <select
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-white dark:bg-slate-950 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <option value={1}>1 Month</option>
          <option value={2}>2 Months</option>
          <option value={3}>3 Months</option>
          <option value={6}>6 Months</option>
        </select>
      </div>

      <div className="flex-1 mb-8 relative z-10">
        <div className="flex flex-wrap gap-2">
          {program.skills.map((skill) => (
            <span 
              key={skill} 
              className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-default"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <Link href={`/internships/${program.slug}`} className="relative z-10 w-full mt-auto">
        <Button className="w-full h-14 rounded-2xl font-bold text-[15px] bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-all duration-300 group-hover:scale-[1.02]">
          Review Syllabus 
          <ArrowRight className="w-5 h-5 ml-2 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
        </Button>
      </Link>
    </div>
  );
}
