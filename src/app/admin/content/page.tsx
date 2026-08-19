"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Loader2, Globe } from "lucide-react";
import { toast } from "sonner";

export default function ContentSettingsPage() {
  const [loading, setLoading] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call to save settings
    setTimeout(() => {
      toast.success("Site configuration saved successfully. Changes will propagate within 5 minutes.");
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Content & SEO Settings</h1>
        <p className="text-muted-foreground mt-1">Manage global metadata, hero copy, and platform-wide configurations.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5 text-indigo-500" /> Global SEO Metadata</CardTitle>
            <CardDescription>This information will be indexed by search engines across all default routes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Site Title</Label>
              <Input defaultValue="CodeInternX - Premier EdTech Internships" />
            </div>
            <div className="space-y-2">
              <Label>Meta Description</Label>
              <Textarea 
                defaultValue="Unlock your career potential with practical, hands-on internships at CodeInternX. Join thousands of students building real-world projects." 
                rows={3} 
              />
            </div>
            <div className="space-y-2">
              <Label>Keywords (comma separated)</Label>
              <Input defaultValue="EdTech, Internships, CodeInternX, Software Engineering, Hands-on Learning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hero Section Copy</CardTitle>
            <CardDescription>Update the primary messaging on the public homepage.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Main Headline</Label>
              <Input defaultValue="Launch Your Career with CodeInternX" />
            </div>
            <div className="space-y-2">
              <Label>Sub-headline</Label>
              <Input defaultValue="Gain real-world experience through structured, industry-aligned internships." />
            </div>
            <div className="space-y-2">
              <Label>Primary CTA Button</Label>
              <Input defaultValue="Explore Internships" className="max-w-xs" />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[120px]">
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
