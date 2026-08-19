"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CheckCircle2, Globe, FileWarning, MessageSquare } from "lucide-react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useParams } from "next/navigation";
import { TaskSubmissionClient } from "./TaskSubmissionClient";

export default function TaskSubmissionPage() {
  const params = useParams();
  
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <Link href="/dashboard/tasks" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-4 w-fit">
          <ArrowLeft className="w-4 h-4" /> Back to Tasks
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Task 2: React Components & Hooks</h1>
            <p className="text-muted-foreground mt-1">Due: August 15, 2026</p>
          </div>
          <Badge className="w-fit bg-amber-100 text-amber-700 border-amber-200" variant="outline">
            Changes Requested
          </Badge>
        </div>
      </div>

      {/* Evaluator Feedback Section (Only shown if changes requested or approved) */}
      <Card className="border-amber-200 bg-amber-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 text-amber-800">
            <FileWarning className="w-5 h-5" /> Evaluator Feedback
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-amber-900/80 space-y-2">
            <p><strong>Reviewer:</strong> Sanjay M.</p>
            <p>Good progress on the UI layout! The components are well structured. However, I noticed two issues that need to be addressed before approval:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>The state management in the <code>DashboardCard</code> component is causing unnecessary re-renders. Consider using <code>useMemo</code> or lifting the state up.</li>
              <li>Server-side validation is missing in the mock API route. Please ensure all inputs are validated before processing.</li>
            </ul>
            <p className="mt-2 font-medium">Please fix these issues and submit a new GitHub commit URL.</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Task Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 prose prose-sm max-w-none text-muted-foreground">
              <h3>Objective</h3>
              <p>Build a responsive dashboard layout using React components and manage state efficiently using React Hooks.</p>
              
              <h3>Requirements</h3>
              <ul>
                <li>Create reusable functional components (Card, Button, Sidebar).</li>
                <li>Implement a global state context for user session management.</li>
                <li>Ensure the layout is responsive (mobile-first).</li>
                <li>Code must be clean, linted, and properly commented.</li>
              </ul>
              
              <h3>Skills Tested</h3>
              <div className="flex flex-wrap gap-2 not-prose">
                <Badge variant="secondary">React</Badge>
                <Badge variant="secondary">Hooks</Badge>
                <Badge variant="secondary">Tailwind CSS</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Submit Your Work</CardTitle>
              <CardDescription>Provide the URLs to your completed code and live deployment.</CardDescription>
            </CardHeader>
            <CardContent>
              <TaskSubmissionClient />
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Evaluation Criteria</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Technical</span>
                  <span className="font-medium">30%</span>
                </li>
                <li className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">UI/UX Quality</span>
                  <span className="font-medium">25%</span>
                </li>
                <li className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Requirements</span>
                  <span className="font-medium">20%</span>
                </li>
                <li className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Code Quality</span>
                  <span className="font-medium">15%</span>
                </li>
                <li className="flex justify-between pb-2">
                  <span className="text-muted-foreground">Professionalism</span>
                  <span className="font-medium">10%</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
