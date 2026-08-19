import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { FileText, IndianRupee } from "lucide-react";

export const metadata = {
  title: "Order Management | CodeInternX Admin",
};

export default async function AdminOrdersPage() {
  const supabase = await createClient();

  const { data: orders, error } = await supabase
    .from("orders")
    .select(`
      id,
      razorpay_order_id,
      amount,
      currency,
      status,
      created_at,
      profiles ( full_name, email ),
      programs ( title ),
      applications ( application_id )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CREATED': return <Badge variant="outline" className="bg-slate-100 text-slate-800">CREATED</Badge>;
      case 'PAID': return <Badge variant="outline" className="bg-emerald-100 text-emerald-800">PAID</Badge>;
      case 'FAILED': return <Badge variant="outline" className="bg-red-100 text-red-800">FAILED</Badge>;
      case 'REFUNDED': return <Badge variant="outline" className="bg-purple-100 text-purple-800">REFUNDED</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Order Management</h1>
        <p className="text-muted-foreground mt-1">View and track all checkout orders.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {orders && orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                  <tr>
                    <th className="px-4 py-3 font-medium">Order ID / RZP ID</th>
                    <th className="px-4 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium">Program</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3">
                        <div className="font-mono text-xs">{order.id.split('-')[0]}...</div>
                        <div className="text-xs text-muted-foreground mt-1 font-mono">{order.razorpay_order_id}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{(order.profiles as any)?.full_name}</div>
                        <div className="text-xs text-muted-foreground">{(order.profiles as any)?.email}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{(order.programs as any)?.title}</td>
                      <td className="px-4 py-3 font-semibold">
                        <span className="flex items-center text-slate-900">
                          <IndianRupee className="w-3 h-3 mr-1" />
                          {order.amount}
                        </span>
                      </td>
                      <td className="px-4 py-3">{getStatusBadge(order.status)}</td>
                      <td className="px-4 py-3 text-slate-500">
                        {new Date(order.created_at).toLocaleString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">No orders found.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
