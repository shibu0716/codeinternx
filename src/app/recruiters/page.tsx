import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Building, Users, Search, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Hire Top Engineering Talent | CodeInternX for Recruiters",
  description: "Bypass the resume pile. Hire verified engineers based on their actual performance data and project code.",
};

export default function RecruitersPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary/5 py-20 md:py-32 border-b">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <Badge className="mb-4 bg-primary/20 text-primary hover:bg-primary/30 border-none" variant="outline">CodeInternX For Employers</Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-foreground max-w-4xl mx-auto leading-tight">
            Stop hiring based on resumes. <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Start hiring based on proof.</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Access our exclusive talent pool of engineers who have been rigorously vetted through 
            project-based internships and intensive code reviews.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="h-12 px-8 text-base">Request Talent Access</Button>
            <Link href="/verify" className="flex">
              <Button size="lg" variant="outline" className="h-12 px-8 text-base bg-background w-full">
                Verify a Candidate Credential
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Why partner with CodeInternX?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Traditional technical interviews are broken. We provide you with candidates who have already proven they can build production-ready software.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: "Pre-Vetted by Experts",
                desc: "Every candidate in our pool has had their code manually reviewed and graded by senior engineers."
              },
              {
                icon: Zap,
                title: "Zero Onboarding Time",
                desc: "Our graduates have built full-stack applications using React, Next.js, Node, and PostgreSQL. They are ready to commit on day one."
              },
              {
                icon: Search,
                title: "Performance Data",
                desc: "Don't guess their skill level. View their actual grading rubrics, evaluator feedback, and live deployed projects."
              }
            ].map((feature, i) => (
              <Card key={i} className="border-muted shadow-sm hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <Building className="w-12 h-12 mx-auto text-primary mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Ready to upgrade your hiring pipeline?</h2>
          <p className="text-lg text-slate-300 mb-10">
            Join 50+ startups and enterprise companies who are already hiring from the CodeInternX talent pool. 
            Fill out the form below to get early access to our recruiter dashboard.
          </p>
          <Button size="lg" variant="default" className="bg-white text-slate-900 hover:bg-slate-100 h-12 px-8">
            Join the Waitlist <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
}
