"use client";

import { useState } from "react";
import { generateAndSaveDocument } from "@/actions/documents";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { DocumentType } from "@/services/document-generator";

export function DocumentGeneratorClient({ 
  studentId, 
  enrollmentId, 
  programTitle, 
  studentName 
}: { 
  studentId: string; 
  enrollmentId: string; 
  programTitle: string; 
  studentName: string;
}) {
  const [loadingType, setLoadingType] = useState<DocumentType | null>(null);

  const handleGenerate = async (type: DocumentType) => {
    setLoadingType(type);
    try {
      const documentId = `${type === 'OFFER_LETTER' ? 'OL' : type === 'PERFORMANCE_REPORT' ? 'PR' : type === 'CERTIFICATE' ? 'CERT' : 'LOR'}-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
      
      const data = {
        studentName,
        programTitle,
        startDate: new Date().toLocaleDateString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        performanceScore: 95,
        certificateId: documentId,
      };

      const result = await generateAndSaveDocument({
        type,
        studentId,
        enrollmentId,
        documentId,
        data
      });

      if (result.success) {
        toast.success(`${type.replace('_', ' ')} generated successfully!`);
      } else {
        toast.error(result.error || "Failed to generate document");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <div className="flex gap-2 flex-wrap">
      <button 
        onClick={() => handleGenerate('OFFER_LETTER')} 
        disabled={loadingType !== null}
        className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 flex items-center gap-1 disabled:opacity-50"
      >
        {loadingType === 'OFFER_LETTER' && <Loader2 className="w-3 h-3 animate-spin" />}
        Offer Letter
      </button>
      <button 
        onClick={() => handleGenerate('PERFORMANCE_REPORT')} 
        disabled={loadingType !== null}
        className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 flex items-center gap-1 disabled:opacity-50"
      >
        {loadingType === 'PERFORMANCE_REPORT' && <Loader2 className="w-3 h-3 animate-spin" />}
        Performance
      </button>
      <button 
        onClick={() => handleGenerate('CERTIFICATE')} 
        disabled={loadingType !== null}
        className="px-3 py-1 bg-purple-100 text-purple-700 rounded text-sm hover:bg-purple-200 flex items-center gap-1 disabled:opacity-50"
      >
        {loadingType === 'CERTIFICATE' && <Loader2 className="w-3 h-3 animate-spin" />}
        Certificate
      </button>
      <button 
        onClick={() => handleGenerate('LOR')} 
        disabled={loadingType !== null}
        className="px-3 py-1 bg-orange-100 text-orange-700 rounded text-sm hover:bg-orange-200 flex items-center gap-1 disabled:opacity-50"
      >
        {loadingType === 'LOR' && <Loader2 className="w-3 h-3 animate-spin" />}
        LOR
      </button>
    </div>
  );
}
