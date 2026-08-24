import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, ExternalLink } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { SeedButton } from "./SeedButton";

export const metadata = {
  title: "Manage Programs | CodeInternX Admin",
};

export default async function AdminProgramsPage() {
  const supabase = await createClient();

  const { data: programs, error } = await supabase
    .from("programs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching programs:", error);
  }

  // Format currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Manage Programs</h1>
          <p className="text-muted-foreground mt-1">Create, edit, and publish internships and courses.</p>
        </div>
        <div className="flex gap-2">
          <SeedButton />
          <Link href="/admin/programs/new" className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-10 px-4 py-2">
            <PlusCircle className="w-4 h-4 mr-2" />
            Create Program
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Programs</CardTitle>
          <CardDescription>
            A list of all educational offerings on the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-slate-200">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-semibold text-slate-900">Title</TableHead>
                  <TableHead className="font-semibold text-slate-900 hidden md:table-cell">Category</TableHead>
                  <TableHead className="font-semibold text-slate-900 hidden md:table-cell">Duration / Level</TableHead>
                  <TableHead className="font-semibold text-slate-900">Price</TableHead>
                  <TableHead className="font-semibold text-slate-900">Status</TableHead>
                  <TableHead className="font-semibold text-slate-900 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {programs && programs.length > 0 ? (
                  programs.map((program) => (
                    <TableRow key={program.id}>
                      <TableCell className="font-medium text-slate-900">
                        {program.title}
                        <div className="text-xs text-slate-500 font-normal mt-0.5 md:hidden">
                          {program.category}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600 hidden md:table-cell">
                        <Badge variant="outline" className="bg-slate-50 text-slate-700 uppercase tracking-wider text-[10px]">
                          {program.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-600 hidden md:table-cell">
                        {program.duration_weeks} weeks <span className="text-slate-400 mx-1">•</span> {program.level}
                      </TableCell>
                      <TableCell className="text-slate-600 font-medium">
                        {Number(program.price) > 0 ? formatPrice(Number(program.price)) : "Free"}
                      </TableCell>
                      <TableCell>
                        {program.is_published ? (
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                            Published
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                            Draft
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {program.is_published && (
                            <Link href={program.category === 'INTERNSHIP' ? `/internships/${program.slug}` : `/courses/${program.slug}`} title="View Public Page" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-slate-100 hover:text-slate-900 h-9 w-9 text-slate-500">
                                <ExternalLink className="w-4 h-4" />
                            </Link>
                          )}
                          <Link href={`/admin/programs/${program.id}`} title="Edit Program" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-slate-100 hover:text-slate-900 h-9 w-9">
                            <Edit className="w-4 h-4 text-blue-600" />
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                      No programs found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
