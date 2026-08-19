import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Award, Code2, CheckCircle2, User, BookOpen, Link as LinkIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, is_public")
    .eq("id", params.id)
    .single();

  if (!profile || !profile.is_public) {
    return { title: "Profile Not Found | CodeInternX" };
  }

  return { title: `${profile.full_name} | CodeInternX Profile` };
}

export default async function PublicProfilePage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  // 1. Fetch Profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!profile || !profile.is_public) {
    notFound();
  }

  // 2. Fetch Certificates
  const { data: certificates } = await supabase
    .from("certificates")
    .select("*, programs(title)")
    .eq("student_id", params.id)
    .order("issue_date", { ascending: false });

  // 3. Fetch Evaluations & Stats
  const { data: evaluations } = await supabase
    .from("evaluations")
    .select("overall_score, submissions!inner(student_id)")
    .eq("submissions.student_id", params.id);

  const evals = evaluations || [];
  const completedTasks = evals.length;
  const avgScore = completedTasks > 0 
    ? Math.round(evals.reduce((acc, curr) => acc + curr.overall_score, 0) / completedTasks) 
    : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b py-4">
        <div className="container mx-auto px-4 flex justify-between items-center max-w-5xl">
          <Link href="/">
            <Image src="/codeinternx-logo.png" alt="CodeInternX" width={160} height={36} className="h-8 w-auto" />
          </Link>
          <Badge variant="secondary" className="font-medium text-xs">Verified Portfolio</Badge>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Left Column: Personal Info */}
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-500 mb-4 border-4 border-white shadow-lg overflow-hidden">
                    {profile.avatar_url ? (
                      <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-12 h-12" />
                    )}
                  </div>
                  <h1 className="text-2xl font-bold text-slate-900">{profile.full_name}</h1>
                  {profile.college && <p className="text-sm text-slate-500 mt-1">{profile.college}</p>}
                  
                  <div className="flex gap-3 mt-6">
                    {profile.github_url && (
                      <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-colors">
                        <LinkIcon className="w-5 h-5" />
                      </a>
                    )}
                    {profile.linkedin_url && (
                      <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-colors">
                        <LinkIcon className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            {profile.skills && profile.skills.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2"><Code2 className="w-4 h-4 text-slate-400" /> Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill: string, i: number) => (
                      <Badge key={i} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Stats */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-3xl font-bold text-indigo-600">{completedTasks}</p>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Tasks Done</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-emerald-600">{avgScore > 0 ? avgScore : '-'}</p>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Avg Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Achievements & Certificates */}
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-6 h-6 text-indigo-500" /> Verified Credentials
            </h2>
            
            {certificates && certificates.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {certificates.map((cert) => (
                  <Card key={cert.id} className="overflow-hidden border-indigo-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="bg-indigo-50 px-4 py-3 border-b border-indigo-100 flex items-center gap-3">
                      <div className="bg-indigo-600 p-1.5 rounded-md text-white">
                        <Award className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-sm text-indigo-900">CodeInternX Certified</span>
                    </div>
                    <CardContent className="p-4 pt-5">
                      <h3 className="font-bold text-lg mb-1 leading-tight">{cert.programs?.title}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mb-4">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Issued on {new Date(cert.issue_date).toLocaleDateString()}
                      </p>
                      <div className="text-[10px] font-mono text-slate-400 bg-slate-50 p-2 rounded text-center break-all">
                        ID: {cert.certificate_id}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <BookOpen className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="font-semibold text-slate-900">No Credentials Yet</h3>
                  <p className="text-slate-500 text-sm max-w-sm mt-1">
                    {profile.full_name} is currently working towards their first CodeInternX certification.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
