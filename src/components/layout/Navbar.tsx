"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Menu, ArrowRight, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { logout } from "@/actions/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navigation = [
  { name: "Home", href: "/" },
  { 
    name: "Internships", 
    href: "#",
    children: [
      { name: "Apply", href: "/login" },
      { name: "Download Certificate", href: "/dashboard/certificates" },
      { name: "Download LOR", href: "/dashboard/lor" },
      { name: "Download Offer Letter", href: "/dashboard/offer-letter" },
    ]
  },
  { 
    name: "Skills/Courses", 
    href: "#",
    children: [
      { name: "Student Dashboard", href: "/dashboard" },
      { name: "Notes", href: "/notes" },
      { name: "Books", href: "/books" },
    ]
  },
  { name: "Roadmaps", href: "/roadmaps" },
  { name: "Website Creation", href: "/website-creation" },
  { name: "Trust & Verify", href: "/verify" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const supabase = createClient();
    
    // Get initial session
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full pt-4 pb-2 px-4 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between max-w-7xl">
        
        {/* Left: Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/codeinternx-logo.png" alt="CodeInternX" width={250} height={60} className="object-contain h-14 w-auto" priority />
          </Link>
        </div>

        {/* Center: Floating Navigation Pill */}
        <nav className="hidden lg:flex items-center justify-center px-8 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.04)] gap-8 transition-all">
          {navigation.map((item) => (
            item.children ? (
              <DropdownMenu key={item.name}>
                <DropdownMenuTrigger className="flex items-center gap-1 text-base font-semibold transition-all duration-200 hover:scale-105 hover:text-blue-600 dark:hover:text-blue-400 text-slate-500 dark:text-slate-400 focus:outline-none">
                  {item.name} <ChevronDown className="w-4 h-4 opacity-70" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl shadow-xl w-48 p-2">
                  {item.children.map((child) => (
                    <DropdownMenuItem key={child.name} className="cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 focus:text-blue-600 dark:focus:text-blue-400 hover:text-blue-600 dark:hover:text-blue-400 text-slate-700 dark:text-slate-300 transition-colors p-0">
                      <Link href={child.href} className="w-full h-full px-3 py-2 text-base font-medium">
                        {child.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`text-base font-semibold transition-all duration-200 hover:scale-105 hover:text-blue-600 dark:hover:text-blue-400 ${
                  pathname === item.href ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {item.name}
              </Link>
            )
          ))}
        </nav>

        {/* Right: CTA Actions */}
        <div className="hidden md:flex items-center gap-6">
          {user ? (
            <>
              <Link href="/dashboard" className="text-lg font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Dashboard
              </Link>
              <form action={logout}>
                <Button type="submit" variant="outline" className="h-12 px-8 rounded-full border-slate-300 dark:border-slate-700 font-bold text-base transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
                  Logout
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" className="h-12 px-8 rounded-full border-2 border-slate-300 dark:border-slate-700 bg-transparent text-slate-700 dark:text-slate-200 font-bold text-base transition-all hover:bg-blue-600 hover:border-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:border-blue-600 dark:hover:text-white">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="h-12 px-8 rounded-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 shadow-md font-bold text-base transition-transform hover:-translate-y-0.5">
                  Join Now <ArrowRight className="w-5 h-5 ml-1.5" />
                </Button>
              </Link>
            </>
          )}
        </div>
        
        {/* Mobile Nav */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger className="lg:hidden inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 h-10 w-10">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </SheetTrigger>
          <SheetContent side="right" className="pr-0 border-l-0 shadow-2xl flex flex-col">
            <SheetTitle className="text-left mb-8">
              <Image src="/codeinternx-logo.png" alt="CodeInternX" width={200} height={48} className="object-contain h-10 w-auto" />
            </SheetTitle>
            <nav className="flex flex-col gap-6 overflow-y-auto flex-1">
              {navigation.map((item) => (
                item.children ? (
                  <div key={item.name} className="flex flex-col gap-3">
                    <span className="block px-2 text-lg font-bold text-slate-600 dark:text-slate-300">
                      {item.name}
                    </span>
                    <div className="flex flex-col gap-3 pl-4 border-l-2 border-slate-100 dark:border-slate-800 ml-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          onClick={() => setIsOpen(false)}
                          className="block px-2 text-base font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`block px-2 text-lg font-bold transition-colors hover:text-blue-600 ${
                      pathname === item.href ? "text-blue-600" : "text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              ))}
            </nav>

            <div className="mt-auto border-t border-slate-200 dark:border-slate-800 p-6">
              {user ? (
                <div className="flex flex-col gap-4">
                  <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                    <Button className="w-full rounded-full h-12 text-base font-bold bg-blue-600 text-white hover:bg-blue-700">Go to Dashboard</Button>
                  </Link>
                  <form action={logout}>
                    <Button type="submit" variant="outline" className="w-full rounded-full h-12 text-base font-bold border-slate-300 dark:border-slate-700">Logout</Button>
                  </form>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full rounded-full h-12 text-base font-bold border-slate-300 dark:border-slate-700">Login</Button>
                  </Link>
                  <Link href="/signup" onClick={() => setIsOpen(false)}>
                    <Button className="w-full rounded-full h-12 text-base font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-900">Join Now <ArrowRight className="w-4 h-4 ml-2" /></Button>
                  </Link>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
