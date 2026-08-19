import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://fbzfoznyzpgzgfxedlzl.supabase.co', 'sb_publishable_LRSdl-QzP0U9o6MDc6W8Iw_OiFYCrlP');
async function test() {
  const { data, error } = await supabase.from('profiles').select('*').eq('email', 'shibu95085@gmail.com');
  console.log(data, error);
}
test();
