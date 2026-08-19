# CodeInternX - Production-Ready Internship Platform

CodeInternX is a modern, scalable web platform built to provide project-based internships, verifiable credentials, and hands-on skill development for software engineering students.

## 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** Shadcn/UI & Radix Primitives
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth (SSR)
- **Icons:** Lucide React & Radix Icons

## 📦 Deployment Instructions (Phase 14)

The platform is 100% production-ready and optimized for Vercel. 

### 1. Database Setup
1. Create a new project on [Supabase](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Copy the contents of `supabase/schema.sql` and run it. This will create all necessary tables (profiles, programs, tasks, submissions, evaluations, certificates) and establish Row Level Security (RLS) policies.

### 2. Environment Variables
You need the following environment variables for deployment. In local development, place these in `.env.local`.

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Deploy to Vercel
Since this is a Next.js application, Vercel is the recommended hosting provider.

1. Push this repository to GitHub.
2. Log in to [Vercel](https://vercel.com) and click **Add New Project**.
3. Import your GitHub repository.
4. In the **Environment Variables** section, add your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
5. Click **Deploy**.

Vercel will automatically detect Next.js, run `npm run build`, and deploy your platform to a global edge network.

## 🌟 Key Features
- **Student Dashboard:** Track progress, submit tasks via GitHub/Live URLs.
- **Admin Dashboard:** Evaluate submissions, issue certificates, monitor Razorpay revenue.
- **Verified Credentials:** Public `/verify` portal for recruiters to check certificate authenticity.
- **Student Portfolios:** Public `/portfolio/[studentId]` pages acting as verified resumes.
- **SEO Optimized:** Dynamic OpenGraph tags, sitemaps, and an engineering blog to drive organic traffic.
