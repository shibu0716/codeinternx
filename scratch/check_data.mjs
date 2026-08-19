import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://fbzfoznyzpgzgfxedlzl.supabase.co', 'sb_publishable_LRSdl-QzP0U9o6MDc6W8Iw_OiFYCrlP');

async function test() {
  const { data: apps, error } = await supabase.from('applications').select('id, status').limit(5);
  console.log("Applications:", apps, error);
}
test();
