import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  const supabase = await createClient();

  const { data: apps } = await supabase.from('applications').select('*');
  const { data: enrolls } = await supabase.from('enrollments').select('*');
  const { data: users } = await supabase.from('profiles').select('id, email, role');
  const { data: tasks } = await supabase.from('tasks').select('*');
  
  return NextResponse.json({ apps, enrolls, users, tasks });
}
