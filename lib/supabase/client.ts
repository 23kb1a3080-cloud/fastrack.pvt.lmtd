import { createBrowserClient } from '@supabase/ssr';

const DEFAULT_SUPABASE_URL = 'https://nonlkkewujpoztzhzfwh.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_X_ICNGdFFa2eInHDEbX-_w_iP2gGNvm';

export function createClient() {
  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL).trim();
  const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY).trim();

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
