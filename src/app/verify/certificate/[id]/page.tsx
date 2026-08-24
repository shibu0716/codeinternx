import { verifyDocument } from '../../../../services/document-verification';
import { notFound } from 'next/navigation';

export default async function CertificateVerificationPage({ params }: { params: { id: string } }) {
  const result = await verifyDocument(params.id);

  if (!result.isValid || result.document?.type !== 'CERTIFICATE') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg border-t-4 border-red-500 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            &#10008;
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h1>
          <p className="text-gray-600 mb-6">
            The certificate ID <strong>{params.id}</strong> could not be verified. It may be invalid, revoked, or incorrectly entered.
          </p>
          <a href="/" className="text-blue-600 hover:underline">Return to Home</a>
        </div>
      </div>
    );
  }

  const doc = result.document;
  const metadata = doc.metadata || {};

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg border-t-4 border-[#0A192F] overflow-hidden">
        
        <div className="bg-[#0A192F] p-6 text-center text-white">
          <h1 className="text-2xl font-bold tracking-wider">CERTIFICATE VERIFIED</h1>
          <p className="text-blue-200 mt-2 text-sm">Official CodeInternX Document</p>
        </div>

        <div className="p-8 space-y-6">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl border-4 border-white shadow">
              &#10004;
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
            <div>
              <p className="text-gray-500 mb-1">Certificate ID</p>
              <p className="font-semibold text-gray-900 font-mono">{doc.id}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Status</p>
              <p className="font-semibold text-green-600">VALID</p>
            </div>
            
            <div className="col-span-1 sm:col-span-2 mt-4 border-t pt-4">
              <p className="text-gray-500 mb-1">Student Name</p>
              <p className="font-semibold text-gray-900 text-lg">{doc.student_name}</p>
            </div>

            <div className="col-span-1 sm:col-span-2">
              <p className="text-gray-500 mb-1">Internship Domain</p>
              <p className="font-semibold text-gray-900">{metadata.internship_domain}</p>
            </div>

            <div>
              <p className="text-gray-500 mb-1">Organization</p>
              <p className="font-semibold text-gray-900">{metadata.company_name}</p>
            </div>

            <div>
              <p className="text-gray-500 mb-1">Internship Duration</p>
              <p className="font-semibold text-gray-900">{metadata.start_date} to {metadata.end_date}</p>
            </div>

            <div>
              <p className="text-gray-500 mb-1">Issue Date</p>
              <p className="font-semibold text-gray-900">{doc.issue_date}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 border-t text-center text-sm text-gray-500">
          This digital certificate is a verified authentic document issued by CodeInternX.
        </div>
      </div>
    </div>
  );
}
