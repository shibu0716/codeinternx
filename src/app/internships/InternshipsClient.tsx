"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Briefcase, Zap, Code2, Rocket, ArrowRight } from "lucide-react";

export function InternshipsClient({ initialInternships }: { initialInternships: any[] }) {
  const [selectedCategory, setSelectedCategory] = useState("All Programs");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredInternships = initialInternships.filter((program) => {
    // Difficulty filter
    if (selectedDifficulty.length > 0 && !selectedDifficulty.includes(program.level)) {
      return false;
    }
    // Search filter
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      if (!program.title.toLowerCase().includes(q) && !(program.technologies || []).some((t: string) => t.toLowerCase().includes(q))) {
        return false;
      }
    }
    return true;
  });

  const toggleDifficulty = (level: string) => {
    setSelectedDifficulty(prev => 
      prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 selection:bg-indigo-500/30">
      
      {/* Premium Hero Section */}
      <section className="relative bg-slate-950 pt-24 pb-32 px-4 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-500/20 blur-[120px] pointer-events-none" />

        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <Badge className="bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20 uppercase tracking-widest text-xs px-4 py-1.5 font-semibold rounded-full mb-8 inline-flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Project-Based Programs
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter mb-6 text-white leading-[1.1]">
            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Internships</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light mb-10">
            Real-world projects designed to build your skills and your portfolio. Skip the tutorial hell and start building production-ready applications today.
          </p>
          
          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute inset-0 bg-indigo-500/20 rounded-2xl blur-xl transition-all group-focus-within:bg-indigo-500/30 pointer-events-none"></div>
            <div className="relative flex items-center bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-2 shadow-2xl">
              <Search className="w-6 h-6 text-slate-400 ml-4 shrink-0" />
              <input 
                type="text" 
                placeholder="Search by role, technology, or keywords..." 
                className="w-full bg-transparent border-none text-white px-4 py-3 placeholder:text-slate-500 focus:outline-none text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8 h-12 text-base font-semibold transition-all">
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-16 md:py-24 px-4 relative">
        <div className="container mx-auto max-w-7xl flex flex-col md:flex-row gap-10">
          
          {/* Sidebar Filters */}
          <div className="w-full md:w-72 shrink-0">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm sticky top-24">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <Filter className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="font-bold text-xl text-slate-900">Filters</h2>
              </div>
              
              <div className="space-y-8">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-slate-400" /> Category
                  </h3>
                  <div className="space-y-3">
                    {["All Programs", "Web Development", "Data Science", "App Development", "Cloud & DevOps"].map((cat) => (
                      <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="radio" 
                          name="category" 
                          className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-600 focus:ring-2" 
                          checked={selectedCategory === cat}
                          onChange={() => setSelectedCategory(cat)}
                        />
                        <span className="text-sm font-medium text-slate-600 group-hover:text-indigo-600 transition-colors">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-slate-400" /> Difficulty Level
                  </h3>
                  <div className="space-y-3">
                    {["Beginner Friendly", "Intermediate", "Advanced"].map((level) => (
                      <label key={level} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 focus:ring-2" 
                          checked={selectedDifficulty.includes(level)}
                          onChange={() => toggleDifficulty(level)}
                        />
                        <span className="text-sm font-medium text-slate-600 group-hover:text-indigo-600 transition-colors">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Internship Cards */}
          <div className="flex-1">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Available Programs</h2>
                <p className="text-slate-500 mt-1">Showing {filteredInternships.length} internships</p>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {filteredInternships.length > 0 ? (
                filteredInternships.map((program) => {
                  const isHighlighted = selectedCategory !== "All Programs" && program.category === selectedCategory;
                  const isDimmed = selectedCategory !== "All Programs" && program.category !== selectedCategory;
                  
                  return (
                <div 
                  key={program.id} 
                  className={`group flex flex-col bg-white rounded-3xl border transition-all duration-300 overflow-hidden transform ${
                    isHighlighted 
                      ? 'border-indigo-500 shadow-xl shadow-indigo-500/20 ring-1 ring-indigo-500 scale-[1.02] z-10' 
                      : isDimmed
                        ? 'border-slate-200 shadow-sm opacity-50 grayscale-[50%] hover:opacity-100 hover:grayscale-0'
                        : 'border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-200 hover:-translate-y-1'
                  }`}
                >
                  <div className="p-6 md:p-8 flex-1">
                    <div className="flex justify-between items-start mb-6 gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-indigo-600 border border-slate-100 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shrink-0">
                        <Rocket className="w-7 h-7" />
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant="outline" className="bg-indigo-50/50 text-indigo-700 border-indigo-200 font-semibold px-3 py-1">
                          {program.mode || 'ONLINE'}
                        </Badge>
                        <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200">
                          {program.duration_weeks || 4} Weeks
                        </Badge>
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-indigo-600 transition-colors">
                      {program.title}
                    </h3>
                    <p className="text-slate-500 leading-relaxed text-sm mb-6 line-clamp-2">
                      {program.description}
                    </p>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-900">Required Level:</span>
                        <span className={`font-semibold ${program.level === 'Advanced' ? 'text-rose-500' : 'text-emerald-500'}`}>
                          {program.level || 'BEGINNER'}
                        </span>
                      </div>
                      
                      <div className="pt-4 border-t border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Tech Stack</p>
                        <div className="flex flex-wrap gap-2">
                          {(program.technologies || []).slice(0, 4).map((tech: string) => (
                            <span key={tech} className="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1.5 rounded-lg border border-slate-200/50">
                              {tech}
                            </span>
                          ))}
                          {(program.technologies?.length || 0) > 4 && (
                            <span className="text-xs font-medium bg-indigo-50 text-indigo-600 px-2.5 py-1.5 rounded-lg border border-indigo-100">
                              +{(program.technologies?.length || 0) - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 md:p-8 pt-0 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pricing</span>
                      <span className="text-lg font-bold text-indigo-600">{Number(program.price) > 0 ? `₹${program.price}` : 'Free'}</span>
                    </div>
                    <Link href={`/internships/${program.slug}`} className="w-full sm:w-auto">
                      <Button className="w-full rounded-xl h-12 px-6 text-base font-semibold bg-slate-900 hover:bg-indigo-600 transition-colors shadow-md hover:shadow-indigo-500/25">
                        View Program <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>

                </div>
              );
            })
            ) : (
              <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-slate-200">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No programs found</h3>
                <p className="text-slate-500 max-w-sm mx-auto">
                  Try adjusting your filters or search query to find the perfect internship program for you.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-6 border-slate-200"
                  onClick={() => {
                    setSelectedCategory("All Programs");
                    setSelectedDifficulty([]);
                    setSearchQuery("");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
