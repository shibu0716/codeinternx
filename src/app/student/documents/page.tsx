import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export default async function StudentDocumentsPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const supabase = createClient(supabaseUrl, supabaseKey);

  // In a real app, you would get the student ID from auth.
  // For now, we'll fetch a dummy student or just select documents for demonstration.
  // Assuming auth context is available or fetching all for a single hardcoded student for demo
  const { data: authUser } = await supabase.auth.getUser();
  const userId = authUser.user?.id;
  
  let query = supabase.from('internship_documents').select('*');
  
  if (userId) {
     query = query.eq('student_id', userId);
  }

  const { data: docs, error } = await query
    .in('status', ['ISSUED', 'ACCEPTED']) // Only show valid documents to student
    .order('created_at', { ascending: false });

  if (error) {
    return <div className="p-8">Error loading documents.</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-[#0A192F]">My Internship Documents</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {docs?.map((doc: any) => (
          <div key={doc.id} className="bg-white rounded-lg shadow border p-6 flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-bold text-[#0A192F]">
                {doc.type.replace('_', ' ')}
              </h2>
              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                {doc.status}
              </span>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600 flex-grow">
              <p><strong>Document ID:</strong> {doc.document_id}</p>
              <p><strong>Issue Date:</strong> {doc.issue_date}</p>
              
              {doc.type === 'PERFORMANCE_REPORT' && doc.metadata?.overall_rating && (
                <p><strong>Overall Rating:</strong> {doc.metadata.overall_rating} / 5</p>
              )}
            </div>
            
            <div className="mt-6 pt-4 border-t flex gap-3">
              {doc.pdf_url ? (
                <>
                  <a 
                    href={doc.pdf_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex-1 text-center bg-blue-50 text-blue-600 px-4 py-2 rounded font-medium hover:bg-blue-100"
                  >
                    View
                  </a>
                  <a 
                    href={doc.pdf_url} 
                    download
                    className="flex-1 text-center bg-[#0A192F] text-white px-4 py-2 rounded font-medium hover:bg-[#112240]"
                  >
                    Download
                  </a>
                </>
              ) : (
                <span className="text-sm text-gray-500 italic">Document PDF not available</span>
              )}
            </div>
          </div>
        ))}
        
        {(!docs || docs.length === 0) && (
          <div className="col-span-full p-8 text-center bg-gray-50 rounded border border-dashed border-gray-300">
            <p className="text-gray-500">No documents have been issued to you yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
