"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2, User, FileText, BookOpen, CreditCard, Award, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { performGlobalSearch } from "@/actions/admin";
import Link from "next/link";

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await performGlobalSearch(query);
        setResults(data);
        setOpen(true);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div className="relative w-full max-w-md" ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input 
          placeholder="Search users, orders, certificates, apps..." 
          className="pl-9 pr-9 bg-white border-slate-200 focus-visible:ring-indigo-500"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (query.trim()) setOpen(true); }}
        />
        {loading ? (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 animate-spin" />
        ) : query ? (
          <button onClick={() => { setQuery(""); setOpen(false); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        ) : null}
      </div>

      {open && (
        <div className="absolute top-full mt-2 w-full max-w-xl bg-white rounded-md shadow-lg border border-slate-200 z-50 max-h-[400px] overflow-y-auto">
          {results.length === 0 ? (
            <div className="p-4 text-sm text-center text-slate-500">No results found for "{query}"</div>
          ) : (
            <div className="py-2 divide-y divide-slate-100">
              {results.map((r, i) => (
                <Link 
                  href={r.url} 
                  key={i} 
                  className="flex items-start p-3 hover:bg-slate-50 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <div className="p-2 bg-slate-100 rounded-md text-slate-500 mr-3 shrink-0">
                    {r.type === 'USER' && <User className="w-4 h-4" />}
                    {r.type === 'APPLICATION' && <FileText className="w-4 h-4" />}
                    {r.type === 'PROGRAM' && <BookOpen className="w-4 h-4" />}
                    {r.type === 'ORDER' && <CreditCard className="w-4 h-4" />}
                    {r.type === 'PAYMENT' && <CreditCard className="w-4 h-4" />}
                    {r.type === 'CERTIFICATE' && <Award className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-900">{r.title}</div>
                    <div className="text-xs text-slate-500 line-clamp-1">{r.subtitle}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
