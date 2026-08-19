import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// Mock data fetcher
function getPostBySlug(slug: string) {
  if (slug === "why-project-based-learning-beats-certifications") {
    return {
      title: "Why Project-Based Learning Beats Traditional Certifications",
      category: "Career Advice",
      author: "Sanjay M.",
      date: "Aug 15, 2026",
      readTime: "5 min read",
      content: `
        <p>In today's highly competitive tech landscape, the value of traditional certifications is rapidly diminishing. Employers are no longer looking for candidates who can simply pass a multiple-choice exam; they want engineers who can build, debug, and scale real applications.</p>
        <h2>The Certification Illusion</h2>
        <p>For years, completing online courses and hoarding certificates was seen as the golden ticket to a tech job. However, these certificates often prove only that you can watch videos and follow tutorials. They rarely demonstrate your ability to solve unstructured problems or work within a complex codebase.</p>
        <h2>Why Projects Matter</h2>
        <p>Building real projects forces you to confront the messy reality of software engineering. You encounter edge cases, dependency conflicts, and architectural decisions that no tutorial can fully prepare you for. When you present a completed project to a recruiter, you are providing undeniable proof of your capabilities.</p>
        <ul>
          <li><strong>Proof of Work:</strong> A deployed application speaks louder than a PDF certificate.</li>
          <li><strong>Problem-Solving:</strong> Building from scratch develops critical debugging skills.</li>
          <li><strong>Tech Stack Mastery:</strong> You learn how different technologies integrate (e.g., connecting a React frontend to a Node.js backend).</li>
        </ul>
        <h2>The CodeInternX Approach</h2>
        <p>This is why CodeInternX focuses entirely on project-based internships. We don't just give you a certificate; we give you a rigorous curriculum where you build production-ready applications, receive expert code reviews, and earn a credential backed by actual performance data.</p>
      `
    };
  }
  return null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  
  if (!post) {
    return { title: "Post Not Found" };
  }
  
  return {
    title: post.title,
    description: "Read this article on the CodeInternX Engineering Blog.",
    openGraph: {
      title: post.title,
      type: "article",
    }
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  
  if (!post) {
    notFound();
  }
  
  return (
    <article className="min-h-screen bg-background pb-24">
      <div className="bg-primary/5 py-12 md:py-16 border-b">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to all articles
          </Link>
          <Badge className="mb-4" variant="secondary">{post.category}</Badge>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {post.author}</span>
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {post.date}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {post.readTime}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-3xl px-4 mt-12">
        <div 
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </article>
  );
}
