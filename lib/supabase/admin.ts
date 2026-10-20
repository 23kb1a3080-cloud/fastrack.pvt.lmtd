import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://nonlkkewujpoztzhzfwh.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_X_ICNGdFFa2eInHDEbX-_w_iP2gGNvm';

export function createAdminClient() {
  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL).trim();
  const supabaseServiceKey = (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    DEFAULT_SUPABASE_KEY
  ).trim();

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
