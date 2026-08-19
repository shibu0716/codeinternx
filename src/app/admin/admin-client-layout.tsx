"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Users, 
  BookOpen, 
  CheckSquare, 
  Award, 
  Settings, 
  LogOut,
  Menu,
  LayoutDashboard,
  CreditCard,
  FileText,
  Briefcase,
  ShoppingCart,
  GraduationCap,
  ClipboardList,
  ShieldCheck,
  Bell,
  LayoutTemplate,
  BarChart,
  FileBarChart,
  UserCog,
  ShieldAlert,
  Server
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const adminNavItems = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Applications", href: "/admin/applications", icon: FileText },
  { title: "Students", href: "/admin/students", icon: Users },
  { title: "Internships", href: "/admin/internships", icon: Briefcase },
  { title: "Programs", href: "/admin/programs", icon: BookOpen },
  { title: "Payments", href: "/admin/payments", icon: CreditCard },
  { title: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { title: "Enrollments", href: "/admin/enrollments", icon: GraduationCap },
  { title: "Submissions", href: "/admin/submissions", icon: ClipboardList },
  { title: "Evaluations", href: "/admin/evaluations", icon: CheckSquare },
  { title: "Certificates", href: "/admin/certificates", icon: Award },
  { title: "Verification", href: "/admin/verification", icon: ShieldCheck },
  { title: "Notifications", href: "/admin/notifications", icon: Bell },
  { title: "Content", href: "/admin/content", icon: LayoutTemplate },
  { title: "Analytics", href: "/admin/analytics", icon: BarChart },
  { title: "Reports", href: "/admin/reports", icon: FileBarChart },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Admins", href: "/admin/admins", icon: UserCog },
  { title: "Audit Logs", href: "/admin/audit-logs", icon: ShieldAlert },
  { title: "Settings", href: "/admin/settings", icon: Settings },
  { title: "System", href: "/admin/system", icon: Server },
];

const SidebarContent = ({ pathname }: { pathname: string }) => (
  <div className="flex h-full flex-col bg-slate-900 text-slate-200">
    <div className="px-6 py-6 border-b border-slate-800">
      <Link href="/admin" className="flex items-center gap-2">
        <span className="font-bold text-xl tracking-tight text-white">CodeInternX</span>
        <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">Admin</span>
      </Link>
    </div>
    <div className="flex-1 overflow-auto py-4">
      <nav className="grid gap-1 px-4">
        {adminNavItems.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <Link key={index} href={item.href}>
              <span
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? "bg-primary/20 text-primary" : "text-slate-400 hover:bg-slate-800 hover:text-white"
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
    <div className="p-4 border-t border-slate-800">
      <Link href="/" className="flex">
        <Button variant="outline" className="w-full justify-start text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white">
          <LogOut className="h-4 w-4 mr-2" />
          Exit Admin
        </Button>
      </Link>
    </div>
  </div>
);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col md:flex">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="flex h-14 items-center justify-between border-b bg-slate-900 px-4 md:hidden">
          <Link href="/admin" className="font-bold text-lg text-white">CodeInternX Admin</Link>
          <Sheet>
            <SheetTrigger className="md:hidden inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors text-white hover:bg-slate-800 h-9 w-9">
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
