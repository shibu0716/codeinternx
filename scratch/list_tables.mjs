import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://fbzfoznyzpgzgfxedlzl.supabase.co', 'sb_publishable_LRSdl-QzP0U9o6MDc6W8Iw_OiFYCrlP');

async function test() {
  const { data, error } = await supabase.rpc('get_tables');
  if (error) {
    // try querying common tables instead
    const tables = ['enrollments', 'submissions', 'student_tasks', 'evaluations', 'notifications', 'analytics', 'reports'];
    for (const t of tables) {
      const { error: e } = await supabase.from(t).select('id').limit(1);
      console.log(t, e ? "MISSING/ERROR" : "EXISTS");
    }
  } else {
    console.log(data);
  }
}
test();
