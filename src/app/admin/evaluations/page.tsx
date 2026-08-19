"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe, Search, Filter, CheckCircle2 } from "lucide-react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

export default function AdminEvaluationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Evaluations</h1>
        <p className="text-muted-foreground mt-1">Review student submissions and assign scores.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex items-center gap-2 w-full max-w-sm relative">
          <Search className="w-4 h-4 absolute left-3 text-muted-foreground" />
          <Input placeholder="Search students or tasks..." className="pl-9 bg-white" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-white"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
          <Button>Assign to Me</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Reviews</CardTitle>
          <CardDescription>Submissions waiting for your evaluation.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md divide-y">
            {[
              { id: "sub-1", student: "Rahul Kumar", program: "Full Stack", task: "Task 3: Backend APIs", date: "2 hours ago", status: "PENDING", version: 1 },
              { id: "sub-2", student: "Priya Sharma", program: "React", task: "Task 2: Hooks", date: "3 hours ago", status: "PENDING", version: 2 },
              { id: "sub-3", student: "Amit Singh", program: "Data Science", task: "Final Project", date: "5 hours ago", status: "PENDING", version: 1 },
            ].map((sub, i) => (
              <div key={i} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white hover:bg-slate-50 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">{sub.student}</span>
                    <Badge variant="secondary" className="text-xs">{sub.program}</Badge>
                    {sub.version > 1 && <Badge variant="outline" className="text-xs border-amber-200 text-amber-700 bg-amber-50">v{sub.version} (Resubmission)</Badge>}
                  </div>
                  <p className="text-sm font-medium text-slate-700">{sub.task}</p>
                  <p className="text-xs text-muted-foreground">Submitted: {sub.date}</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                  <div className="flex gap-2 mr-4">
                    <Button variant="ghost" size="icon" title="View GitHub Repo">
                      <GitHubLogoIcon className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="View Live Deployment">
                      <Globe className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button variant="outline" className="w-full sm:w-auto">Evaluate</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recently Evaluated</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
             <div className="p-4 border rounded-md bg-slate-50 flex justify-between items-center opacity-80">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">Sanjana Patel</span>
                    <Badge className="bg-green-100 text-green-700 border-green-200" variant="outline">Approved</Badge>
                  </div>
                  <p className="text-sm">Task 1: HTML & CSS</p>
                </div>
                <div className="flex items-center gap-2 font-bold text-lg text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-green-500" /> 88/100
                </div>
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
