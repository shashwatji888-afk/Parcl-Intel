import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kznbfbtpxvfbikdsdtlk.supabase.co';
const supabaseKey = 
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  'sb_publishable_QkWWZ2Vcs0jzY2A6UBGW8Q_MC45Hgfb';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);


export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
