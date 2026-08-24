import { createClient } from '@supabase/supabase-js';

// Note: Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

export interface VerificationResult {
  isValid: boolean;
  document?: any;
  message?: string;
}

/**
 * Verifies a document based on its unique document_id
 */
export async function verifyDocument(documentId: string): Promise<VerificationResult> {
  if (!documentId) {
    return { isValid: false, message: 'Invalid document ID' };
  }

  try {
    const { data, error } = await supabase
      .from('internship_documents')
      .select(`
        document_id,
        type,
        status,
        issue_date,
        student_id,
        enrollment_id,
        metadata,
        profiles!inner ( full_name )
      `)
      .eq('document_id', documentId)
      .single();

    if (error || !data) {
      return { isValid: false, message: 'Document not found' };
    }

    const isValidStatus = data.status === 'ISSUED' || data.status === 'ACCEPTED';

    return {
      isValid: isValidStatus,
      document: {
        id: data.document_id,
        type: data.type,
        status: data.status,
        issue_date: data.issue_date,
        student_name: Array.isArray(data.profiles) ? data.profiles[0]?.full_name : (data.profiles as any)?.full_name,
        metadata: data.metadata
      },
      message: isValidStatus ? 'Document is valid' : `Document status is ${data.status}`
    };
  } catch (error) {
    console.error('Verification error:', error);
    return { isValid: false, message: 'Internal server error during verification' };
  }
}
