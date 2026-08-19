import { FileBarChart, HardHat } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Reports | Admin Dashboard",
};

export default function ReportsPage() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Reports</h1>
          <p className="text-slate-500 mt-1">Exportable data and compliance reporting.</p>
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardContent className="p-12 md:p-24 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6 relative">
            <FileBarChart className="w-10 h-10 text-indigo-500" />
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100">
              <HardHat className="w-5 h-5 text-amber-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Under Construction</h2>
          <p className="text-slate-500 max-w-md mx-auto">
            The reporting module is currently under development. Soon, you will be able to generate CSV and PDF reports for university partners and internal audits.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
