"use client";

import { useState, FormEvent, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { internships } from "@/lib/data";
import { Loader2, CheckCircle2 } from "lucide-react";

function ApplyForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const programId = searchParams.get("programId");
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [applicationId, setApplicationId] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    college: "",
    degree: "",
    branch: "",
    currentYear: "",
    graduationYear: "",
    linkedinUrl: "",
    githubUrl: "",
    portfolioUrl: "",
    programSlug: programId || "",
    source: "WEBSITE",
    termsAccepted: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit application");
      }

      setApplicationId(data.application_id);
      setSuccess(true);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    const selectedProgram = internships.find(i => i.slug === formData.programSlug);
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6 py-12">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold">Application Submitted Successfully</h1>
        <p className="text-muted-foreground text-lg">Thank you for applying to CodeInternX!</p>
        
        <Card className="text-left mt-8 bg-slate-50 border-slate-200">
          <CardContent className="p-6 space-y-4">
            <div>
              <p className="text-sm text-slate-500 font-medium uppercase">Application ID</p>
              <p className="font-mono text-lg font-bold text-slate-900">{applicationId}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium uppercase">Program</p>
              <p className="text-lg font-medium text-slate-900">{selectedProgram?.title || "Selected Program"}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium uppercase">Status</p>
              <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 mt-1">PENDING REVIEW</Badge>
            </div>
            <div className="pt-4 border-t border-slate-200">
              <p className="text-sm font-medium text-slate-700">Next Step: Our team will review your application. You can track your status in your dashboard.</p>
            </div>
          </CardContent>
        </Card>
        
        <Button onClick={() => router.push("/dashboard/applications")} className="w-full mt-6" size="lg">
          Go to My Applications
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">CodeInternX Application Form</h1>
        <p className="text-muted-foreground">Fill out the details below to apply for your desired internship track.</p>
      </div>

      <Card>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Full Name *</label>
                  <Input required name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Email Address *</label>
                  <Input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Phone Number *</label>
                  <Input required type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 9508574636" />
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Education Background</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">College / University *</label>
                  <Input required name="college" value={formData.college} onChange={handleChange} placeholder="Indian Institute of Technology" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Degree *</label>
                  <Input required name="degree" value={formData.degree} onChange={handleChange} placeholder="B.Tech" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Branch / Major *</label>
                  <Input required name="branch" value={formData.branch} onChange={handleChange} placeholder="Computer Science" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Current Year *</label>
                    <select required name="currentYear" value={formData.currentYear} onChange={handleChange} className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="">Select Year</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                      <option value="Graduated">Graduated</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Grad. Year *</label>
                    <Input required name="graduationYear" value={formData.graduationYear} onChange={handleChange} placeholder="2026" />
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Professional Profiles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">LinkedIn URL</label>
                  <Input type="url" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} placeholder="https://linkedin.com/in/johndoe" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">GitHub URL</label>
                  <Input type="url" name="githubUrl" value={formData.githubUrl} onChange={handleChange} placeholder="https://github.com/johndoe" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Portfolio URL (Optional)</label>
                  <Input type="url" name="portfolioUrl" value={formData.portfolioUrl} onChange={handleChange} placeholder="https://johndoe.dev" />
                </div>
              </div>
            </div>

            {/* Program Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Program Selection</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Selected Program *</label>
                  <select required name="programSlug" value={formData.programSlug} onChange={handleChange} className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="">Select a Program</option>
                    {internships.map(p => (
                      <option key={p.id} value={p.slug}>{p.title}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">How did you hear about us?</label>
                  <select name="source" value={formData.source} onChange={handleChange} className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="WEBSITE">CodeInternX Website</option>
                    <option value="WHATSAPP">WhatsApp Group</option>
                    <option value="REFERRAL">Friend / Referral</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Consent */}
            <div className="space-y-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex items-start space-x-3">
                <input 
                  type="checkbox" 
                  id="terms" 
                  name="termsAccepted" 
                  checked={formData.termsAccepted} 
                  onChange={(e) => setFormData(p => ({...p, termsAccepted: e.target.checked}))} 
                  required 
                  className="mt-1 w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary"
                />
                <div className="space-y-1 leading-none">
                  <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Accept terms and conditions
                  </label>
                  <p className="text-sm text-muted-foreground">
                    I agree to the CodeInternX Terms of Service and Privacy Policy. I confirm that the information provided is accurate.
                  </p>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading || !formData.termsAccepted}>
              {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
              Submit Application
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="text-center py-20"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>}>
        <ApplyForm />
      </Suspense>
    </div>
  );
}
