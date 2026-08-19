"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { submitContactForm } from "@/actions/contact";
import { CheckCircle2, AlertCircle } from "lucide-react";

export function QuoteForm() {
  const [isPending, setIsPending] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: "" });

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setStatus({ type: null, message: "" });
    
    // The submitContactForm expects: name, email, subject, message
    // Let's transform our specific fields into that format
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const projectDetails = formData.get("projectDetails") as string;
    const email = formData.get("email") as string;
    
    const submitData = new FormData();
    submitData.append("name", `${firstName} ${lastName}`);
    submitData.append("email", email);
    submitData.append("subject", "Website Creation Quote Request");
    submitData.append("message", projectDetails);

    try {
      const response = await submitContactForm(submitData);
      
      if (response?.error) {
        setStatus({ type: 'error', message: response.error });
      } else if (response?.success) {
        setStatus({ type: 'success', message: response.message });
      }
    } catch (error) {
      setStatus({ type: 'error', message: "An unexpected error occurred. Please try again." });
    } finally {
      setIsPending(false);
    }
  }

  if (status.type === 'success') {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 animate-in fade-in zoom-in duration-500">
        <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 border border-emerald-500/30">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Request Sent!</h3>
        <p className="text-slate-400 max-w-md">
          {status.message}
        </p>
        <Button 
          onClick={() => setStatus({ type: null, message: "" })}
          className="mt-8 px-6 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors"
        >
          Send another request
        </Button>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      {status.type === 'error' && (
        <div className="p-4 bg-red-900/20 border border-red-800 rounded-xl flex items-start gap-3 text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>{status.message}</p>
        </div>
      )}
      <div className="grid grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">First Name</label>
          <input 
            type="text" 
            name="firstName"
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" 
            placeholder="John" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Last Name</label>
          <input 
            type="text" 
            name="lastName"
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" 
            placeholder="Doe" 
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Email Address</label>
        <input 
          type="email" 
          name="email"
          required
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" 
          placeholder="john@example.com" 
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Project Details</label>
        <textarea 
          name="projectDetails"
          required
          rows={4}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none" 
          placeholder="Tell us about the website you want to build..." 
        ></textarea>
      </div>
      <Button disabled={isPending} className="w-full h-14 text-base font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-900/20 transition-all hover:-translate-y-1 mt-2">
        {isPending ? "Sending..." : "Submit Request"}
      </Button>
    </form>
  );
}
