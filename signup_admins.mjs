import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fbzfoznyzpgzgfxedlzl.supabase.co';
const supabaseKey = 'sb_publishable_LRSdl-QzP0U9o6MDc6W8Iw_OiFYCrlP';
const supabase = createClient(supabaseUrl, supabaseKey);

async function signUpAdmins() {
  const admins = [
    { email: 'shanibhardwaj653@gmail.com', password: 'Veer9528@@12#', firstName: 'Shani', lastName: 'Bhardwaj' },
    { email: 'shibu95085@gmail.com', password: 'Aniket91020@12%*', firstName: 'Shibu', lastName: 'Admin' }
  ];

  for (const admin of admins) {
    console.log(`Attempting to sign up ${admin.email}...`);
    const { data, error } = await supabase.auth.signUp({
      email: admin.email,
      password: admin.password,
      options: {
        data: {
          first_name: admin.firstName,
          last_name: admin.lastName,
        }
      }
    });

    if (error) {
      console.error(`Error for ${admin.email}:`, error.message);
    } else {
      console.log(`Success for ${admin.email}! User ID: ${data.user?.id}`);
    }
  }
}

signUpAdmins();
