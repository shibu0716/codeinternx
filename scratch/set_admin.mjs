import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fbzfoznyzpgzgfxedlzl.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SERVICE_ROLE_KEY';

// I need the actual service role key, I will grab it from .env.local
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
const envPath = path.resolve('.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));
const supabase = createClient(envConfig.NEXT_PUBLIC_SUPABASE_URL, envConfig.SUPABASE_SERVICE_ROLE_KEY);

async function setAdmin() {
  const { data, error } = await supabase.from('profiles').update({ role: 'ADMIN' }).eq('email', 'admin@codeinternx.com');
  console.log('Result:', data, error);
}
setAdmin();
