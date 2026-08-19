import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fbzfoznyzpgzgfxedlzl.supabase.co';
const supabaseKey = 'sb_publishable_LRSdl-QzP0U9o6MDc6W8Iw_OiFYCrlP';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testLogin() {
  console.log("Testing shani...");
  const res1 = await supabase.auth.signInWithPassword({
    email: 'shanibhardwaj653@gmail.com',
    password: 'Veer9528@@12#'
  });
  console.log("Shani result:", res1.error ? res1.error.message : "Success!");

  console.log("Testing shibu...");
  const res2 = await supabase.auth.signInWithPassword({
    email: 'shibu95085@gmail.com',
    password: 'Aniket91020@12%*'
  });
  console.log("Shibu result:", res2.error ? res2.error.message : "Success!");
}

testLogin();
