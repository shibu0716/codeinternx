"use client";

import { useEffect } from "react";

export function SecurityWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Block right click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Block keyboard shortcuts (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U)
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === "F12") {
        e.preventDefault();
      }
      
      // Ctrl/Cmd + Shift + I (Inspect)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "I" || e.key === "i")) {
        e.preventDefault();
      }
      
      // Ctrl/Cmd + Shift + J (Console)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "J" || e.key === "j")) {
        e.preventDefault();
      }
      
      // Ctrl/Cmd + Shift + C (Element selector)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "C" || e.key === "c")) {
        e.preventDefault();
      }

      // Ctrl/Cmd + U (View Source)
      if ((e.ctrlKey || e.metaKey) && (e.key === "U" || e.key === "u")) {
        e.preventDefault();
      }
    };

    // Advanced DevTools detection (optional trick to pause debugger if they somehow open it)
    const blockDevTools = setInterval(() => {
      const before = new Date().getTime();
       
      debugger;
      const after = new Date().getTime();
      if (after - before > 100) {
        // DevTools is open, we could redirect or clear the page, but let's just keep pausing them
      }
    }, 1000);

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      clearInterval(blockDevTools);
    };
  }, []);

  return <>{children}</>;
}
