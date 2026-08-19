import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { LayoutDashboard, CheckSquare, ClipboardList, Settings, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ReactNode } from "react";
import Image from "next/image";

const sidebarNavItems = [
  { title: "Evaluator Dashboard", href: "/evaluator", icon: LayoutDashboard },
  { title: "Submission Queue", href: "/evaluator/queue", icon: CheckSquare },
  { title: "My Reviews", href: "/evaluator/reviews", icon: ClipboardList },
];

export default async function EvaluatorLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, email, avatar_url")
    .eq("id", user.id)
    .single();

  if (!profile || !["EVALUATOR", "ADMIN", "SUPER_ADMIN"].includes(profile.role)) {
    redirect("/dashboard");
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col gap-4">
      <div className="flex h-16 items-center px-6 border-b border-indigo-100">
        <Link href="/evaluator" className="flex items-center gap-2 font-bold text-xl text-indigo-900 tracking-tight">
          <Image src="/codeinternx-logo.png" alt="CodeInternX" width={120} height={28} className="h-6 w-auto" />
          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full uppercase tracking-widest font-semibold ml-2">Evaluator</span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
        <div className="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Evaluation Center
        </div>
        {sidebarNavItems.map((item, index) => (
          <Link key={index} href={item.href}>
            <span className="group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 transition-colors">
              <item.icon className="mr-3 h-5 w-5 text-slate-400 group-hover:text-indigo-500" />
              {item.title}
            </span>
          </Link>
        ))}
      </div>
      <div className="p-4 border-t border-indigo-100 bg-slate-50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center font-bold text-indigo-700 overflow-hidden">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
            ) : (
              profile.full_name?.charAt(0) || "E"
            )}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-slate-900 truncate">{profile.full_name}</p>
            <p className="text-xs text-slate-500 truncate">{profile.email}</p>
          </div>
        </div>
        <form action="/auth/signout" method="post">
          <Button variant="outline" className="w-full justify-start text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900">
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-72 border-r bg-white shadow-sm shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Navbar */}
      <div className="flex flex-col flex-1 min-w-0">
        <header className="flex h-16 items-center gap-4 border-b bg-white px-4 md:hidden shrink-0">
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SidebarContent />
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">Evaluator Portal</span>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
