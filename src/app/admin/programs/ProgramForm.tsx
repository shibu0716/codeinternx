"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { saveProgram, deleteProgram } from "@/actions/admin";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";

export function ProgramForm({ initialData = null }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    category: initialData?.category || "INTERNSHIP",
    duration_weeks: initialData?.duration_weeks || 4,
    level: initialData?.level || "BEGINNER",
    mode: initialData?.mode || "ONLINE",
    price: initialData?.price || 0,
    is_published: initialData?.is_published || false,
    technologies: initialData?.technologies?.join(", ") || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, is_published: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        duration_weeks: Number(formData.duration_weeks),
        technologies: formData.technologies.split(",").map(t => t.trim()).filter(Boolean)
      };

      await saveProgram(payload, initialData?.id);
      toast.success(`Program successfully ${initialData ? "updated" : "created"}!`);
      router.push("/admin/programs");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to save program");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData?.id) return;
    if (!confirm("Are you sure you want to completely delete this program? This action cannot be undone and will cascade delete all tasks.")) return;

    setDeleting(true);
    try {
      await deleteProgram(initialData.id);
      toast.success("Program deleted permanently");
      router.push("/admin/programs");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete program");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{initialData ? "Edit Program" : "Create New Program"}</CardTitle>
        <CardDescription>
          {initialData ? "Update existing program details." : "Fill out the form below to create a new program."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" name="title" required value={formData.title} onChange={handleChange} placeholder="e.g. Full-Stack Web Development" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL) *</Label>
              <Input id="slug" name="slug" required value={formData.slug} onChange={handleChange} placeholder="e.g. full-stack-web-dev" />
            </div>

            <div className="space-y-2">
              <Label>Category *</Label>
              <Select value={formData.category} onValueChange={(v) => handleSelectChange('category', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="INTERNSHIP">Internship</SelectItem>
                  <SelectItem value="COURSE">Course</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Level *</Label>
              <Select value={formData.level} onValueChange={(v) => handleSelectChange('level', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="BEGINNER">Beginner</SelectItem>
                  <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                  <SelectItem value="ADVANCED">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Mode *</Label>
              <Select value={formData.mode} onValueChange={(v) => handleSelectChange('mode', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ONLINE">Online</SelectItem>
                  <SelectItem value="OFFLINE">Offline</SelectItem>
                  <SelectItem value="HYBRID">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration_weeks">Duration (Weeks) *</Label>
              <Input id="duration_weeks" name="duration_weeks" type="number" required min="1" value={formData.duration_weeks} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (INR) *</Label>
              <Input id="price" name="price" type="number" required min="0" step="0.01" value={formData.price} onChange={handleChange} />
              <p className="text-xs text-muted-foreground">Set to 0 for free.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="technologies">Technologies (comma separated)</Label>
              <Input id="technologies" name="technologies" value={formData.technologies} onChange={handleChange} placeholder="React, Node.js, Typescript" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" rows={4} value={formData.description} onChange={handleChange} placeholder="Detailed program description..." />
          </div>

          <div className="flex items-center space-x-2 py-4 border-t border-b">
            <Switch id="is_published" checked={formData.is_published} onCheckedChange={handleSwitchChange} />
            <Label htmlFor="is_published" className="font-semibold cursor-pointer">
              Publish Program instantly
            </Label>
          </div>

          <div className="flex justify-between items-center pt-4">
            {initialData ? (
              <Button type="button" variant="destructive" onClick={handleDelete} disabled={deleting || loading}>
                {deleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
                Delete Program
              </Button>
            ) : <div />}

            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading || deleting}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading || deleting} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {initialData ? "Update Program" : "Create Program"}
              </Button>
            </div>
          </div>

        </form>
      </CardContent>
    </Card>
  );
}
