"use client";
import { useEffect } from "react";

export function PrintTrigger({ filename = "certificate.pdf" }: { filename?: string }) {
  useEffect(() => {
    // Dynamically import html2pdf on the client side
    import("html2pdf.js").then((html2pdf) => {
      // Add a slight delay to ensure fonts and images are loaded
      const timer = setTimeout(() => {
        const element = document.getElementById("certificate-container");
        if (element && html2pdf.default) {
          // Hide the "Verify Another Credential" button in the PDF
          const buttonToHide = element.querySelector("button");
          if (buttonToHide && buttonToHide.parentElement) {
             buttonToHide.parentElement.style.display = "none";
          }
          
          const opt = {
            margin:       0.5,
            filename:     filename,
            image:        { type: 'jpeg' as const, quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'in' as const, format: 'letter' as const, orientation: 'portrait' as const }
          };
          
          html2pdf.default().set(opt).from(element).save().then(() => {
              // Restore button visibility
              if (buttonToHide && buttonToHide.parentElement) {
                 buttonToHide.parentElement.style.display = "";
              }
          });
        } else {
          window.print();
        }
      }, 1000);
      return () => clearTimeout(timer);
    });
  }, [filename]);

  return null;
}
