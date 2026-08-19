import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, Calendar, User } from "lucide-react";

export const metadata = {
  title: "Engineering Blog | CodeInternX",
  description: "Insights on software engineering, career development, and modern tech stacks.",
};

const MOCK_POSTS = [
  {
    slug: "why-project-based-learning-beats-certifications",
    title: "Why Project-Based Learning Beats Traditional Certifications",
    excerpt: "In 2026, tech recruiters are no longer impressed by generic certificates. Here's why hands-on project experience is the only way to land an engineering role.",
    category: "Career Advice",
    author: "Sanjay M.",
    date: "Aug 15, 2026",
    readTime: "5 min read",
  },
  {
    slug: "building-scalable-react-applications",
    title: "Architecting Scalable React Applications in 2026",
    excerpt: "A deep dive into React Server Components, Suspense, and how we structure large-scale frontend codebases at CodeInternX.",
    category: "Engineering",
    author: "Priya Sharma",
    date: "Aug 10, 2026",
    readTime: "8 min read",
  },
  {
    slug: "cracking-the-full-stack-interview",
    title: "Cracking the Full-Stack Developer Interview",
    excerpt: "A comprehensive guide to passing technical rounds, from system design basics to advanced JavaScript concepts.",
    category: "Interview Prep",
    author: "Rahul Kumar",
    date: "Jul 28, 2026",
    readTime: "12 min read",
  },
];

export default function BlogIndexPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <div className="bg-primary/5 border-b py-16 md:py-20 text-center px-4">
        <div className="container mx-auto max-w-3xl">
          <Badge className="mb-4" variant="outline">Engineering Blog</Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Insights & Engineering
          </h1>
          <p className="text-lg text-muted-foreground">
            Articles on modern web development, career growth, and platform engineering from the CodeInternX team.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_POSTS.map((post) => (
            <Card key={post.slug} className="flex flex-col hover:border-primary/50 transition-colors h-full">
              <CardHeader>
                <Badge variant="secondary" className="w-fit mb-3">{post.category}</Badge>
                <Link href={`/blog/${post.slug}`} className="group-hover:underline">
                  <CardTitle className="line-clamp-2 leading-tight hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                </Link>
                <CardDescription className="flex items-center gap-4 text-xs mt-2">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                  <span className="flex items-center gap-1"><User className="w-3 h-3" /> {post.author}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 text-sm text-muted-foreground">
                <p className="line-clamp-3">{post.excerpt}</p>
              </CardContent>
              <CardFooter>
                <Link href={`/blog/${post.slug}`} className="text-sm font-medium text-primary flex items-center gap-1 hover:gap-2 transition-all">
                  Read article <ArrowRight className="w-4 h-4" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
