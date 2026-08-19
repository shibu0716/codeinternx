import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "sonner";
import { SecurityWrapper } from "@/components/SecurityWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | CodeInternX",
    default: "CodeInternX | Production-Ready Internships & Skill Development",
  },
  description: "Gain real-world engineering experience with project-based internships, expert code reviews, and verifiable certificates. Partnering with top colleges to bridge the industry gap.",
  keywords: ["internships", "coding bootcamp", "react training", "full stack developer", "skill development", "verifiable certificates", "college placements"],
  authors: [{ name: "CodeInternX Team" }],
  openGraph: {
    title: "CodeInternX | Production-Ready Internships & Skill Development",
    description: "Gain real-world engineering experience with project-based internships, expert code reviews, and verifiable certificates.",
    url: "https://codeinternx.com",
    siteName: "CodeInternX",
    images: [
      {
        url: "https://codeinternx.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "CodeInternX Platform Overview",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeInternX | Production-Ready Internships & Skill Development",
    description: "Gain real-world engineering experience with project-based internships.",
    images: ["https://codeinternx.com/og-image.png"],
  },
  alternates: {
    canonical: "https://codeinternx.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <SecurityWrapper>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <Toaster position="top-center" richColors />
        </SecurityWrapper>
      </body>
    </html>
  );
}
