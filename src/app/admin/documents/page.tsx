import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { DocumentGeneratorClient } from './DocumentGeneratorClient';

export const dynamic = 'force-dynamic';

export default async function AdminDocumentsPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Fetch all enrollments with student profiles to show as a list for generation
  const { data: enrollments, error } = await supabase
    .from('enrollments')
    .select(`
      id,
      student_id,
      profiles ( full_name, email ),
      programs ( title )
    `)
    .limit(50);

  if (error) {
    return <div className="p-8">Error loading data: {error.message}</div>;
  }

  // Group by student and program for easy selection (Simplified view)
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-[#0A192F]">Admin Document Center</h1>
      
      <div className="bg-white rounded-lg shadow border p-6">
        <h2 className="text-xl font-semibold mb-4">Select Internship for Document Generation</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-3 font-semibold text-sm">Student</th>
                <th className="p-3 font-semibold text-sm">Program/Internship</th>
                <th className="p-3 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {enrollments?.map((enc: any) => (
                <tr key={enc.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <p className="font-medium">{enc.profiles?.full_name || 'Unknown'}</p>
                    <p className="text-xs text-gray-500">{enc.profiles?.email}</p>
                  </td>
                  <td className="p-3">
                    <p>{enc.programs?.title || 'Unknown Program'}</p>
                  </td>
                  <td className="p-3">
                    <DocumentGeneratorClient 
                      studentId={enc.student_id} 
                      enrollmentId={enc.id} 
                      programTitle={enc.programs?.title || 'Unknown Program'} 
                      studentName={enc.profiles?.full_name || 'Unknown'} 
                    />
                  </td>
                </tr>
              ))}
              
              {enrollments?.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-6 text-center text-gray-500">
                    No active internships found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* List of existing documents */}
      <AdminIssuedDocuments supabase={supabase} />
    </div>
  );
}

async function AdminIssuedDocuments({ supabase }: { supabase: any }) {
  const { data: docs } = await supabase
    .from('internship_documents')
    .select(`
      id, document_id, type, status, issue_date, pdf_url,
      profiles ( full_name )
    `)
    .order('created_at', { ascending: false });

  return (
    <div className="bg-white rounded-lg shadow border p-6">
      <h2 className="text-xl font-semibold mb-4">Issued Documents</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-3 font-semibold text-sm">Document ID</th>
              <th className="p-3 font-semibold text-sm">Type</th>
              <th className="p-3 font-semibold text-sm">Student</th>
              <th className="p-3 font-semibold text-sm">Status</th>
              <th className="p-3 font-semibold text-sm">Date</th>
              <th className="p-3 font-semibold text-sm">Action</th>
            </tr>
          </thead>
          <tbody>
            {docs?.map((doc: any) => (
              <tr key={doc.id} className="border-b hover:bg-gray-50">
                <td className="p-3 text-sm font-mono">{doc.document_id}</td>
                <td className="p-3 text-sm">{doc.type.replace('_', ' ')}</td>
                <td className="p-3 text-sm">{doc.profiles?.full_name}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    doc.status === 'ISSUED' ? 'bg-green-100 text-green-700' :
                    doc.status === 'REVOKED' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {doc.status}
                  </span>
                </td>
                <td className="p-3 text-sm">{doc.issue_date}</td>
                <td className="p-3 text-sm flex gap-2">
                  {doc.pdf_url && (
                    <a href={doc.pdf_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                      View PDF
                    </a>
                  )}
                </td>
              </tr>
            ))}
            
            {docs?.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  No documents generated yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
