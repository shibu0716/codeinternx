import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCertificates() {
  const { data, error } = await supabase.from('certificates').select('*');
  if (error) {
    console.error('Error fetching certificates:', error);
  } else {
    console.log('Certificates count:', data.length);
    if (data.length > 0) {
      console.log('Certificates:', data);
    }
  }
}
checkCertificates();
