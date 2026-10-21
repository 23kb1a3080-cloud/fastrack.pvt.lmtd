import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const DEFAULT_SUPABASE_URL = 'https://nonlkkewujpoztzhzfwh.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_X_ICNGdFFa2eInHDEbX-_w_iP2gGNvm';

export async function createClient() {
  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL).trim();
  const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY).trim();

  let cookieStore: any = null;
  try {
    cookieStore = await cookies();
  } catch {
    // cookies() may not be available during static build phase
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        try {
          return cookieStore?.getAll() ?? [];
        } catch {
          return [];
        }
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore?.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing user sessions.
        }
      },
    },
  });
}

export async function getServerUser() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    if (data?.user) {
      return {
        id: data.user.id,
        email: data.user.email || '',
        name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'Student',
        role: data.user.user_metadata?.role || (data.user.email?.includes('admin') ? 'ADMIN' : 'STUDENT'),
        branch: data.user.user_metadata?.branch || 'CSE',
        phone: data.user.user_metadata?.phone || '',
      };
    }
  } catch {}

  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('capstonia_session')?.value;
    if (sessionCookie) {
      return JSON.parse(decodeURIComponent(sessionCookie));
    }
  } catch {}

  return null;
}
