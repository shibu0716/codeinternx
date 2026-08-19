"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { updateProfileSettings } from "@/actions/student";
import { toast } from "sonner";
import { Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";

interface Profile {
  id: string;
  github_url: string | null;
  linkedin_url: string | null;
  is_public: boolean;
}

export function SettingsClient({ profile }: { profile: Profile }) {
  const [loading, setLoading] = useState(false);
  const [isPublic, setIsPublic] = useState(profile.is_public || false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("is_public", isPublic.toString());

    try {
      const result = await updateProfileSettings(formData);
      if (result.success) {
        toast.success("Settings updated successfully!");
      } else {
        toast.error(result.error || "Failed to update settings");
      }
    } catch (err: any) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Public Profile Settings</CardTitle>
          <CardDescription>
            Configure your public portfolio to share your CodeInternX achievements with recruiters.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50">
              <div className="space-y-0.5">
                <Label className="text-base">Enable Public Profile</Label>
                <p className="text-sm text-muted-foreground">
                  Allow anyone with the link to view your verified certificates and completed tasks.
                </p>
              </div>
              <Switch checked={isPublic} onCheckedChange={setIsPublic} />
            </div>

            {isPublic && (
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-between">
                <div className="text-sm text-indigo-900">
                  <span className="font-semibold">Your public URL: </span>
                  <Link href={`/p/${profile.id}`} target="_blank" className="hover:underline opacity-80 break-all">
                     codeinternx.com/p/{profile.id}
                  </Link>
                </div>
                <Link href={`/p/${profile.id}`} target="_blank">
                  <Button type="button" size="sm" variant="outline" className="ml-4 shrink-0 bg-white">
                    View <ExternalLink className="w-3 h-3 ml-2" />
                  </Button>
                </Link>
              </div>
            )}

            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-medium">Social Links</h3>
              <div className="space-y-2">
                <Label htmlFor="github_url">GitHub URL</Label>
                <Input 
                  id="github_url" 
                  name="github_url" 
                  placeholder="https://github.com/username" 
                  defaultValue={profile.github_url || ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                <Input 
                  id="linkedin_url" 
                  name="linkedin_url" 
                  placeholder="https://linkedin.com/in/username" 
                  defaultValue={profile.linkedin_url || ""}
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Settings
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
