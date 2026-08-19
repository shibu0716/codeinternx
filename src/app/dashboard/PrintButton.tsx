"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintButton({ className }: { className?: string }) {
  return (
    <Button 
      className={`bg-indigo-600 hover:bg-indigo-700 ${className}`} 
      onClick={() => window.print()}
    >
      <Download className="w-4 h-4 mr-2" />
      Download PDF
    </Button>
  );
}
