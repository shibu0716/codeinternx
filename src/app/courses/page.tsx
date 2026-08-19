import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlayCircle, Clock, BookOpen, Layers, Zap } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Premium Courses | CodeInternX",
  description: "Level up your engineering skills with deep-dive courses on system design, data structures, and modern frameworks.",
};

const COURSES = [
  {
    title: "System Design for Interviews",
    description: "Learn how to architect scalable distributed systems. Covers load balancing, database sharding, caching strategies, and microservices.",
    level: "Advanced",
    duration: "6 Weeks",
    modules: 12,
    slug: "system-design",
  },
  {
    title: "Data Structures & Algorithms in TypeScript",
    description: "Master the core data structures and algorithms required to crack top-tier technical interviews, taught entirely in TypeScript.",
    level: "Intermediate",
    duration: "8 Weeks",
    modules: 24,
    slug: "data-structures",
  },
  {
    title: "Next.js 15 Masterclass",
    description: "Build a production-ready application using Next.js App Router, Server Actions, React Server Components, and Turbopack.",
    level: "Intermediate",
    duration: "4 Weeks",
    modules: 10,
    slug: "nextjs-masterclass",
  }
];

export default function CoursesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 selection:bg-indigo-500/30">
      
      {/* Premium Hero Section */}
      <section className="relative bg-slate-950 pt-24 pb-32 px-4 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[50%] rounded-full bg-indigo-500/20 blur-[120px] pointer-events-none" />

        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <Badge className="bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20 uppercase tracking-widest text-xs px-4 py-1.5 font-semibold rounded-full mb-8 inline-flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            Premium Courses
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter mb-6 text-white leading-[1.1]">
            Master the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Fundamentals</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
            Deep-dive into specialized topics with our expert-led courses. Designed to complement our project-based internships by providing strong theoretical foundations.
          </p>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-16 md:py-24 px-4 relative -mt-16 z-20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {COURSES.map((course) => (
              <div key={course.slug} className="group flex flex-col bg-white rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl hover:border-indigo-200 transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
                
                <div className="p-6 md:p-8 flex-1">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <Badge variant="outline" className={`font-semibold border-2 ${course.level === "Advanced" ? "text-amber-600 border-amber-200 bg-amber-50" : "text-emerald-600 border-emerald-200 bg-emerald-50"}`}>
                      {course.level}
                    </Badge>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-indigo-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed text-sm md:text-base">
                    {course.description}
                  </p>
                </div>

                <div className="px-6 md:px-8 py-4 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-4 text-sm font-medium text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-indigo-500" /> {course.duration}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-purple-500" /> {course.modules} Modules
                  </div>
                </div>

                <div className="p-6 md:p-8 pt-0 bg-slate-50">
                  <Link href={`/courses/${course.slug}`} className="w-full block">
                    <Button className="w-full rounded-xl h-12 text-base font-semibold bg-slate-900 hover:bg-indigo-600 transition-colors shadow-md hover:shadow-indigo-500/25">
                      View Curriculum <PlayCircle className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </div>

              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
