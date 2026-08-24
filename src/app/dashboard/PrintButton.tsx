"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintButton({ className, targetId = "document-container", filename = "document.pdf" }: { className?: string, targetId?: string, filename?: string }) {
  const handlePrint = async () => {
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const element = document.getElementById(targetId);
      
      if (element) {
        const opt = {
          margin:       0.5,
          filename:     filename,
          image:        { type: 'jpeg' as const, quality: 0.98 },
          html2canvas:  { scale: 2, useCORS: true },
          jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' as const }
        };
        
        html2pdf().set(opt).from(element).save();
      } else {
        window.print();
      }
    } catch (error) {
      console.error("PDF generation failed:", error);
      window.print();
    }
  };

  return (
    <Button 
      className={`bg-indigo-600 hover:bg-indigo-700 ${className}`} 
      onClick={handlePrint}
    >
      <Download className="w-4 h-4 mr-2" />
      Download PDF
    </Button>
  );
}
