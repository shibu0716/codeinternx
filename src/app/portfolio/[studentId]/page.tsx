import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, FileText, CheckCircle2, Globe, MapPin, Link as LinkIcon, Mail } from "lucide-react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { notFound } from "next/navigation";

// Mock data fetcher
function getStudentPortfolio(id: string) {
  if (id === "demo-student") {
    return {
      name: "Student User",
      title: "Full Stack Developer | CS Undergrad",
      location: "Bengaluru, India",
      about: "Passionate software engineering student with experience in React, Node.js, and PostgreSQL. Dedicated to building scalable, accessible, and high-performance web applications.",
      socials: {
        github: "https://github.com/student",
        linkedin: "https://linkedin.com/in/student",
        website: "https://student-portfolio.dev"
      },
      skills: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS"],
      credentials: [
        {
          id: "SKF-9823-XYZ",
          program: "Full Stack Development",
          score: 92,
          date: "August 2026",
          hasLor: true
        }
      ],
      projects: [
        {
          title: "RESTful E-Commerce API",
          description: "Built a robust backend API using Express and PostgreSQL with complete JWT authentication and role-based access control.",
          score: 95,
          githubUrl: "#",
          liveUrl: "#",
          tech: ["Node.js", "Express", "PostgreSQL"]
        },
        {
          title: "Responsive Dashboard Layout",
          description: "Developed a responsive, mobile-first admin dashboard using React and Tailwind CSS featuring complex state management.",
          score: 88,
          githubUrl: "#",
          liveUrl: "#",
          tech: ["React", "Tailwind CSS"]
        }
      ]
    };
  }
  return null;
}

export async function generateMetadata({ params }: { params: Promise<{ studentId: string }> }) {
  const { studentId } = await params;
  const profile = getStudentPortfolio(studentId);
  
  if (!profile) return { title: "Portfolio Not Found" };
  
  return {
    title: `${profile.name} | Verified Portfolio`,
    description: profile.about,
  };
}

export default async function PortfolioPage({ params }: { params: Promise<{ studentId: string }> }) {
  const { studentId } = await params;
  const profile = getStudentPortfolio(studentId);
  
  if (!profile) notFound();

  return (
    <div className="flex flex-col min-h-screen bg-muted/20 pb-20">
      {/* Profile Header */}
      <div className="bg-primary/5 border-b">
        <div className="container mx-auto max-w-5xl px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-primary/20 rounded-full flex items-center justify-center text-primary text-5xl font-bold shrink-0">
              {profile.name.charAt(0)}
            </div>
            <div className="space-y-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">{profile.name}</h1>
                <p className="text-xl text-muted-foreground mt-2 font-medium">{profile.title}</p>
              </div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {profile.location}</span>
                <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> Open to Opportunities</span>
              </div>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {profile.skills.map(skill => (
                  <Badge key={skill} variant="secondary" className="px-3 py-1 bg-white">{skill}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: About & Links */}
        <div className="space-y-8 lg:col-span-1">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {profile.about}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <a href={profile.socials.github} target="_blank" rel="noreferrer" className="flex w-full">
                <Button variant="outline" className="w-full justify-start">
                  <GitHubLogoIcon className="w-4 h-4 mr-2" /> GitHub
                </Button>
              </a>
              <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" className="flex w-full">
                <Button variant="outline" className="w-full justify-start">
                  <Globe className="w-4 h-4 mr-2" /> LinkedIn
                </Button>
              </a>
              <a href={profile.socials.website} target="_blank" rel="noreferrer" className="flex w-full">
                <Button variant="outline" className="w-full justify-start">
                  <LinkIcon className="w-4 h-4 mr-2" /> Portfolio Website
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Verified Credentials & Projects */}
        <div className="space-y-8 lg:col-span-2">
          
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-green-500" /> Verified Credentials
            </h2>
            <div className="space-y-4">
              {profile.credentials.map((cred) => (
                <Card key={cred.id} className="border-green-200 bg-green-50/30 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{cred.program}</h3>
                          <Badge className="bg-green-100 text-green-700 border-green-200">Verified</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Issued: {cred.date}</p>
                        <p className="text-sm text-muted-foreground font-mono">ID: {cred.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-green-600">{cred.score}<span className="text-base text-muted-foreground">/100</span></p>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Evaluation Score</p>
                      </div>
                    </div>
                    {cred.hasLor && (
                      <div className="mt-4 pt-4 border-t border-green-200/50 flex items-center gap-2 text-sm text-blue-700 font-medium">
                        <FileText className="w-4 h-4" /> Earned Letter of Recommendation
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-4 mt-12 flex items-center gap-2">
              <Award className="w-6 h-6 text-primary" /> Completed Projects
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {profile.projects.map((project, i) => (
                <Card key={i} className="flex flex-col shadow-sm">
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                      <CardTitle className="text-lg leading-tight">{project.title}</CardTitle>
                      <Badge variant="outline" className="shrink-0">{project.score}/100</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.tech.map(tech => (
                        <span key={tech} className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
