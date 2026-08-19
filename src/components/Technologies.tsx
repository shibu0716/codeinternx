"use client";

import { Monitor, Server, Cloud, Brain, ArrowRight } from "lucide-react";
import Link from "next/link";

const techCategories = [
  {
    id: "frontend",
    title: "Frontend Development",
    subtitle: "Building interactive user interfaces",
    icon: Monitor,
    iconBg: "bg-blue-50 dark:bg-blue-900/30",
    iconColor: "text-blue-500",
    tags: [
      { name: "HTML", dot: "bg-[#E34F26]" },
      { name: "CSS", dot: "bg-[#1572B6]" },
      { name: "REACT", dot: "bg-[#61DAFB]" },
      { name: "ANGULAR", dot: "bg-[#DD0031]" },
      { name: "VUE", dot: "bg-[#4FC08D]" },
      { name: "JAVASCRIPT", dot: "bg-[#F7DF1E]" },
      { name: "TYPESCRIPT", dot: "bg-[#3178C6]" },
    ]
  },
  {
    id: "backend",
    title: "Backend Systems",
    subtitle: "Powering robust server-side logic",
    icon: Server,
    iconBg: "bg-emerald-50 dark:bg-emerald-900/30",
    iconColor: "text-emerald-500",
    tags: [
      { name: "PYTHON", dot: "bg-[#3776AB]" },
      { name: "JAVA", dot: "bg-[#007396]" },
      { name: "C++", dot: "bg-[#00599C]" },
      { name: "NODE.JS", dot: "bg-[#339933]" },
    ]
  },
  {
    id: "devops",
    title: "DevOps & Cloud",
    subtitle: "Deploying scalable infrastructure",
    icon: Cloud,
    iconBg: "bg-purple-50 dark:bg-purple-900/30",
    iconColor: "text-purple-500",
    tags: [
      { name: "AWS", dot: "bg-[#FF9900]" },
      { name: "KUBERNETES", dot: "bg-[#326CE5]" },
      { name: "DOCKER", dot: "bg-[#2496ED]" },
      { name: "GIT", dot: "bg-[#F05032]" },
      { name: "LINUX", dot: "bg-[#FCC624]" },
    ]
  },
  {
    id: "ai",
    title: "AI & Data Science",
    subtitle: "Innovating with machine learning",
    icon: Brain,
    iconBg: "bg-orange-50 dark:bg-orange-900/30",
    iconColor: "text-orange-500",
    tags: [
      { name: "TENSORFLOW", dot: "bg-[#FF6F00]" },
      { name: "PYTORCH", dot: "bg-[#EE4C2C]" },
      { name: "JUPYTER", dot: "bg-[#F37626]" },
    ]
  }
];

export function Technologies() {
  return (
    <section className="py-24 px-4 bg-white dark:bg-slate-950 relative">
      <div className="container mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-[10px] uppercase tracking-widest mb-6">
            SKILLS & TOOLS
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-serif font-medium text-slate-900 dark:text-white mb-6 tracking-tight">
            Technologies You'll <span className="text-[#0084d1]">Work With</span> During Your Internship
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-medium">
            You'll apply these technologies while completing real assignments and portfolio projects.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {techCategories.map((category) => {
            const Icon = category.icon;
            return (
              <div 
                key={category.id} 
                className="bg-slate-50/50 dark:bg-slate-900/50 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-8">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${category.iconBg} ${category.iconColor}`}>
                    <Icon className="w-7 h-7" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-1">
                      {category.title}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium">
                      {category.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {category.tags.map((tag) => (
                    <div 
                      key={tag.name}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm"
                    >
                      <div className={`w-2 h-2 rounded-full ${tag.dot}`} />
                      <span className="text-[11px] font-black tracking-widest text-slate-700 dark:text-slate-300">
                        {tag.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Quote & Button */}
        <div className="text-center">
          <p className="text-lg md:text-xl font-serif italic text-slate-500 mb-8 max-w-2xl mx-auto">
            "Projects are designed to reflect real development workflows used in companies."
          </p>
          <Link href="/internships">
            <button className="bg-[#0f172a] hover:bg-black dark:bg-white dark:hover:bg-slate-200 text-white dark:text-black font-bold py-4 px-8 rounded-xl text-sm inline-flex items-center gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
              View Internship Tracks
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
}
