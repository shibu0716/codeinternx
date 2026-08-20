import Link from "next/link";
import Image from "next/image";
import { GitHubLogoIcon, TwitterLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import { ArrowRight, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-200 relative overflow-hidden">
      {/* Subtle top gradient border */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
      
      {/* Decorative background blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-8 py-16 md:py-24 relative z-10">
        
        {/* Newsletter Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pb-16 border-b border-slate-800/50 mb-16">
          <div className="max-w-xl text-center lg:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">Level up your coding career.</h2>
            <p className="text-slate-400">Join 10,000+ developers getting weekly insights on internships, system design, and tech interviews.</p>
          </div>
          <div className="w-full max-w-md relative flex items-center group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-amber-500 transition-colors">
              <Mail className="h-5 w-5" />
            </div>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="w-full bg-slate-900 border border-slate-800 rounded-full py-4 pl-10 pr-36 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all text-white placeholder:text-slate-500"
            />
            <Button className="absolute right-1.5 top-1.5 bottom-1.5 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold px-6 transition-transform active:scale-95">
              Subscribe <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center mb-6">
              <Image 
                src="/codeinternx-logo.png" 
                alt="CodeInternX" 
                width={220} 
                height={60} 
                className="h-10 w-auto object-contain brightness-0 invert" 
              />
            </Link>
            <p className="text-slate-400 text-base leading-relaxed mb-8 max-w-sm">
              Project-based internships and career programs designed to help students build practical skills and demonstrate what they can actually do in the real world.
            </p>
            <div className="flex space-x-5">
              <a href="https://twitter.com/codeinternx" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-amber-500 hover:text-slate-950 transition-all hover:scale-110 hover:-translate-y-1">
                <span className="sr-only">Twitter</span>
                <TwitterLogoIcon className="h-5 w-5" />
              </a>
              <a href="https://github.com/internxcode" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-amber-500 hover:text-slate-950 transition-all hover:scale-110 hover:-translate-y-1">
                <span className="sr-only">GitHub</span>
                <GitHubLogoIcon className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com/company/codeinternx" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-amber-500 hover:text-slate-950 transition-all hover:scale-110 hover:-translate-y-1">
                <span className="sr-only">LinkedIn</span>
                <LinkedInLogoIcon className="h-5 w-5" />
              </a>
              <a href="mailto:internxcode@gmail.com" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-amber-500 hover:text-slate-950 transition-all hover:scale-110 hover:-translate-y-1">
                <span className="sr-only">Email</span>
                <Mail className="h-5 w-5" />
              </a>
              <a href="tel:+919508574636" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-amber-500 hover:text-slate-950 transition-all hover:scale-110 hover:-translate-y-1">
                <span className="sr-only">Phone</span>
                <Phone className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-6 text-sm tracking-wider uppercase text-white">Programs</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/internships/frontend-development" className="text-slate-400 hover:text-amber-400 hover:translate-x-1 inline-block transition-all">
                  Frontend Development
                </Link>
              </li>
              <li>
                <Link href="/internships/full-stack-development" className="text-slate-400 hover:text-amber-400 hover:translate-x-1 inline-block transition-all">
                  Full Stack Development
                </Link>
              </li>
              <li>
                <Link href="/internships/data-science-python" className="text-slate-400 hover:text-amber-400 hover:translate-x-1 inline-block transition-all">
                  Python & Data Science
                </Link>
              </li>
              <li>
                <Link href="/internships" className="text-amber-500 hover:text-amber-400 font-medium hover:translate-x-1 inline-block transition-all flex items-center">
                  View All Internships <ArrowRight className="ml-1 w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-6 text-sm tracking-wider uppercase text-white">Learning Paths</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/courses" className="text-slate-400 hover:text-amber-400 hover:translate-x-1 inline-block transition-all">
                  All Courses
                </Link>
              </li>
              <li>
                <Link href="/roadmaps" className="text-slate-400 hover:text-amber-400 hover:translate-x-1 inline-block transition-all">
                  Developer Roadmaps
                </Link>
              </li>
              <li>
                <Link href="/courses/system-design" className="text-slate-400 hover:text-amber-400 hover:translate-x-1 inline-block transition-all">
                  System Design
                </Link>
              </li>
              <li>
                <Link href="/courses/data-structures" className="text-slate-400 hover:text-amber-400 hover:translate-x-1 inline-block transition-all">
                  Data Structures
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-6 text-sm tracking-wider uppercase text-white">Legal & Resources</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/terms" className="text-slate-400 hover:text-amber-400 hover:translate-x-1 inline-block transition-all">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-slate-400 hover:text-amber-400 hover:translate-x-1 inline-block transition-all">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-slate-400 hover:text-amber-400 hover:translate-x-1 inline-block transition-all">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/trust" className="text-slate-400 hover:text-amber-400 hover:translate-x-1 inline-block transition-all">
                  Trust & Transparency
                </Link>
              </li>
              <li>
                <a href="mailto:internxcode@gmail.com" className="text-slate-400 hover:text-amber-400 hover:translate-x-1 inline-block transition-all">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="tel:+919508574636" className="text-slate-400 hover:text-amber-400 hover:translate-x-1 inline-block transition-all">
                  +91 95085 74636
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} CodeInternX Technologies. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Made with</span>
            <span className="text-red-500 animate-pulse">❤️</span>
            <span>for aspiring developers.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
