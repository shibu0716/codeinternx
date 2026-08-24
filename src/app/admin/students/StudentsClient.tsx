"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Search, User, UserX, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function StudentsClient({ initialStudents }: { initialStudents: any[] }) {
  const [students, setStudents] = useState(initialStudents);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudents = students.filter((student) => {
    const query = searchQuery.toLowerCase();
    return (
      student.full_name?.toLowerCase().includes(query) ||
      student.email?.toLowerCase().includes(query) ||
      student.college?.toLowerCase().includes(query)
    );
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDisable = async (id: string) => {
    toast.success("Student disabled (Mock)");
  };

  const handleDelete = async (id: string) => {
    toast.success("Student deleted (Mock)");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            type="search"
            placeholder="Search students..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border border-slate-200">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-semibold text-slate-900">Name</TableHead>
              <TableHead className="font-semibold text-slate-900">Email</TableHead>
              <TableHead className="font-semibold text-slate-900 hidden md:table-cell">College</TableHead>
              <TableHead className="font-semibold text-slate-900">Joined</TableHead>
              <TableHead className="font-semibold text-slate-900 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium text-slate-900">{student.full_name}</TableCell>
                  <TableCell className="text-slate-600">{student.email}</TableCell>
                  <TableCell className="text-slate-600 hidden md:table-cell">
                    {student.college || <span className="text-slate-400 italic">Not provided</span>}
                    {student.graduation_year && <span className="text-xs text-slate-500 ml-1">({student.graduation_year})</span>}
                  </TableCell>
                  <TableCell className="text-slate-600">{formatDate(student.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center whitespace-nowrap rounded-md hover:bg-slate-100 outline-none p-0 transition-colors">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <User className="mr-2 h-4 w-4" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDisable(student.id)}>
                          <UserX className="mr-2 h-4 w-4 text-amber-600" />
                          <span className="text-amber-600">Disable Account</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(student.id)}>
                          <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                          <span className="text-red-600">Delete Account</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                  No students found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
