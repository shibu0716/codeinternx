"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2, ShieldCheck, GraduationCap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";


interface EnrollmentCardProps {
  internship: {
    id: string;
    slug: string;
    numberOfTasks: number;
  };
  user: {
    email?: string;
  } | null;
}

export function EnrollmentCard({ internship, user }: EnrollmentCardProps) {
  // duration is in months: 1, 2, 3, or 6
  const [duration, setDuration] = useState<number>(1);

  const pricingMap: Record<number, number> = {
    1: 99,
    2: 199,
    3: 299,
    6: 499,
  };

  const currentPrice = pricingMap[duration];

  return (
    <div className="sticky top-24">
      <Card className="border-2 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl mb-2">Enrollment Details</CardTitle>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-primary">₹{currentPrice}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Select Internship Duration
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value={1}>1 Month (₹99)</option>
              <option value={2}>2 Months (₹199)</option>
              <option value={3}>3 Months (₹299)</option>
              <option value={6}>6 Months (₹499)</option>
            </select>
          </div>

          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-3 text-muted-foreground">
              <Code2 className="w-5 h-5 text-foreground/70" /> {internship.numberOfTasks} Practical Tasks
            </li>
            <li className="flex items-center gap-3 text-muted-foreground">
              <ShieldCheck className="w-5 h-5 text-foreground/70" /> Expert Code Review
            </li>
            <li className="flex items-center gap-3 text-muted-foreground">
              <GraduationCap className="w-5 h-5 text-foreground/70" /> Verified Certificate
            </li>
          </ul>
          
          <div className="pt-4 border-t">
            {user ? (
              <Link href={`/apply?programId=${internship.slug}`} className="w-full">
                <Button className="w-full text-md h-12">Apply Now</Button>
              </Link>
            ) : (
              <Link href={`/login?redirect=/internships/${internship.slug}`} className="w-full">
                <Button className="w-full text-md h-12">Log in to Apply</Button>
              </Link>
            )}
            <p className="text-xs text-center text-muted-foreground mt-3">
              Limited spots available in the next cohort.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
