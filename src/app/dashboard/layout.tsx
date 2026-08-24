"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { 
  LayoutDashboard, 
  BookOpen, 
  CheckSquare, 
  Award, 
  Settings, 
  LogOut,
  Menu,
  Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const sidebarNavItems = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { title: "My Internships", href: "/dashboard/internships", icon: BookOpen },
  { title: "Tasks & Submissions", href: "/dashboard/tasks", icon: CheckSquare },
  { title: "Leaderboard", href: "/dashboard/leaderboard", icon: Trophy },
  { title: "Certificates", href: "/dashboard/certificates", icon: Award },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
];

const SidebarContent = ({ pathname }: { pathname: string }) => {
  const router = useRouter();
  const supabase = createClient();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="px-6 py-6 border-b">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/codeinternx-logo.png" alt="CodeInternX" width={200} height={48} className="object-contain h-10 w-auto" priority />
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-4">
          {sidebarNavItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link key={index} href={item.href}>
                <span
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-4 border-t">
        <Button 
          variant="outline" 
          onClick={handleLogout} 
          disabled={loggingOut}
          className="w-full justify-start text-muted-foreground"
        >
          <LogOut className="h-4 w-4 mr-2" />
          {loggingOut ? "Logging out..." : "Log out"}
        </Button>
      </div>
    </div>
  );
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-background md:flex">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="flex h-14 items-center justify-between border-b bg-background px-4 md:hidden">
          <Link href="/" className="flex items-center">
            <Image src="/codeinternx-logo.png" alt="CodeInternX" width={160} height={36} className="object-contain h-8 w-auto" />
          </Link>
          <Sheet>
            <SheetTrigger className="md:hidden inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Sidebar</span>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SidebarContent pathname={pathname} />
            </SheetContent>
          </Sheet>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
