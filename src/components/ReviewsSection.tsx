"use client";

import { Star, CheckCircle2, Quote } from "lucide-react";

const reviews = [
  {
    category: "CYBER SECURITY",
    categoryColor: "text-orange-600 dark:text-orange-400",
    categoryBg: "bg-orange-50 dark:bg-orange-500/10",
    text: "The way tasks were assigned helped me gain hands-on experience in cyber security. It was a great learning journey.",
    initial: "P",
    avatarColor: "bg-purple-600",
    name: "PRIYANKA DUBAKULA",
    role: "PYTHON PROGRAMMING INTERN"
  },
  {
    category: "WEB DEV",
    categoryColor: "text-blue-600 dark:text-blue-400",
    categoryBg: "bg-blue-50 dark:bg-blue-500/10",
    text: "Working on real-time projects helped me understand the complete lifecycle of frontend development. Highly recommended!",
    initial: "S",
    avatarColor: "bg-blue-600",
    name: "SAQLAIN HASSAN",
    role: "FRONTEND DEVELOPMENT INTERN"
  },
  {
    category: "JAVA",
    categoryColor: "text-amber-600 dark:text-amber-400",
    categoryBg: "bg-amber-50 dark:bg-amber-500/10",
    text: "The hands-on experience helped me bridge the gap between academic theory and industry expectations.",
    initial: "Y",
    avatarColor: "bg-[#b800e6]",
    name: "YOGESHWARAN SS",
    role: "JAVA PROGRAMMING INTERN"
  },
  {
    category: "MACHINE LEARNING",
    categoryColor: "text-emerald-600 dark:text-emerald-400",
    categoryBg: "bg-emerald-50 dark:bg-emerald-500/10",
    text: "Building actual AI models gave me the confidence to ace my technical interviews. The mentor feedback was invaluable.",
    initial: "A",
    avatarColor: "bg-emerald-600",
    name: "ARUN KUMAR",
    role: "DATA SCIENCE INTERN"
  },
  {
    category: "APP DEV",
    categoryColor: "text-rose-600 dark:text-rose-400",
    categoryBg: "bg-rose-50 dark:bg-rose-500/10",
    text: "I deployed my first full-stack application to the App Store during this internship. A completely transformative experience.",
    initial: "M",
    avatarColor: "bg-rose-500",
    name: "MEERA SHARMA",
    role: "MOBILE DEV INTERN"
  }
];

const ReviewCard = ({ review }: { review: any }) => (
  <div className="mx-4 w-[400px] shrink-0 bg-white dark:bg-slate-900 rounded-[2rem] p-8 relative overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] border border-slate-100 dark:border-slate-800 flex flex-col justify-between hover:-translate-y-2 transition-transform duration-300">
    {/* Background Quote Icon */}
    <div className="absolute top-6 right-6 text-slate-100 dark:text-slate-800/50">
      <Quote className="w-20 h-20 rotate-180 fill-current opacity-50" strokeWidth={0} />
    </div>

    <div className="relative z-10">
      <div className="flex justify-between items-start mb-6">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
          ))}
        </div>
        <div className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${review.categoryBg} ${review.categoryColor}`}>
          {review.category}
        </div>
      </div>

      <p className="text-slate-700 dark:text-slate-300 text-lg font-medium italic leading-relaxed mb-8">
        "{review.text}"
      </p>
    </div>

    <div className="flex items-center gap-4 relative z-10">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-xl ${review.avatarColor} shadow-md`}>
        {review.initial}
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wide text-sm">{review.name}</h4>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-100 dark:fill-emerald-900" />
        </div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
          {review.role}
        </p>
      </div>
    </div>
  </div>
);

export function ReviewsSection() {
  return (
    <section className="py-24 px-4 bg-slate-50/50 dark:bg-slate-950/50 overflow-hidden relative border-t border-slate-100 dark:border-slate-900">
      <div className="container mx-auto max-w-7xl relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-[10px] uppercase tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-400 dark:bg-blue-500 mr-2 animate-pulse" />
            SOCIAL PROOF
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
            Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Thousands</span><br />
            of Future Engineers
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Join a growing community of learners gaining practical experience through real-world projects and industry-focused internship programs.
          </p>
        </div>

        {/* Marquee Container */}
        <div className="relative flex flex-col gap-8 -mx-4 lg:-mx-20 overflow-hidden pb-8">
          {/* Fading Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-40 bg-gradient-to-r from-slate-50/50 dark:from-slate-950/50 to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-40 bg-gradient-to-l from-slate-50/50 dark:from-slate-950/50 to-transparent z-20 pointer-events-none" />

          {/* Scrolling Left */}
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
            <div className="flex shrink-0">
              {reviews.map((review, i) => <ReviewCard key={i} review={review} />)}
            </div>
            <div className="flex shrink-0">
              {reviews.map((review, i) => <ReviewCard key={`dup-${i}`} review={review} />)}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
