import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, CreditCard, Award, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Activity & Audit Logs | CodeInternX Admin",
};

export default async function AuditLogsPage() {
  const supabase = await createClient();

  // Combine recent activity across the platform
  const { data: apps } = await supabase.from("applications").select("id, application_id, status, created_at, profiles(full_name)").order("created_at", { ascending: false }).limit(20);
  const { data: orders } = await supabase.from("orders").select("id, razorpay_order_id, amount, status, created_at, profiles(full_name)").order("created_at", { ascending: false }).limit(20);
  const { data: certs } = await supabase.from("certificates").select("id, certificate_id, issue_date, programs(title), profiles(full_name)").order("issue_date", { ascending: false }).limit(20);

  // Map to common structure
  const activities = [
    ...(apps || []).map((a) => ({
      type: "Application",
      icon: FileText,
      color: "text-blue-500 bg-blue-50",
      title: `${a.profiles?.full_name} submitted an application`,
      description: `Application ID: ${a.application_id} | Status: ${a.status}`,
      time: new Date(a.created_at),
      href: "/admin/applications"
    })),
    ...(orders || []).map((o) => ({
      type: "Order",
      icon: CreditCard,
      color: "text-emerald-500 bg-emerald-50",
      title: `${o.profiles?.full_name} initiated an order`,
      description: `Amount: ₹${o.amount} | Status: ${o.status}`,
      time: new Date(o.created_at),
      href: "/admin/orders"
    })),
    ...(certs || []).map((c) => ({
      type: "Certificate",
      icon: Award,
      color: "text-purple-500 bg-purple-50",
      title: `${c.profiles?.full_name} was issued a certificate`,
      description: `Program: ${c.programs?.title} | Cert ID: ${c.certificate_id}`,
      time: new Date(c.issue_date),
      href: "/admin/certificates"
    }))
  ].sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 50);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Activity Logs</h1>
        <p className="text-muted-foreground mt-1">Global timeline of system activities and events.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest actions performed across applications, payments, and document issuance.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8 pl-4 border-l-2 border-slate-100 ml-4">
            {activities.length > 0 ? activities.map((activity, i) => (
              <div key={i} className="relative group">
                <div className={`absolute -left-[29px] mt-1.5 h-4 w-4 rounded-full border-2 border-white ${activity.color.split(' ')[1]} flex items-center justify-center`}>
                  <div className={`h-2 w-2 rounded-full ${activity.color.split(' ')[0].replace('text-', 'bg-')}`} />
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <h4 className="font-medium text-slate-900 flex items-center gap-2">
                      <activity.icon className={`w-4 h-4 ${activity.color.split(' ')[0]}`} />
                      {activity.title}
                    </h4>
                    <p className="text-sm text-slate-500 mt-1">{activity.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="text-xs font-mono text-slate-400">
                      {activity.time.toLocaleString('en-US', {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                    <Link href={activity.href} className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      View Details <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center text-slate-500 py-8">No activity recorded yet.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
