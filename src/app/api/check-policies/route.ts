import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('get_policies'); // assuming we don't have this
  
  // Let's just query pg_policies
  const { data: policies, error: polError } = await supabase
    .from('pg_policies') // wait, pg_policies might not be accessible directly
    .select('*')
    .eq('tablename', 'enrollments');

  return NextResponse.json({ policies, polError });
}
