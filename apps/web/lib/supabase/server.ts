import { createServerClient, type SetAllCookies } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@skwash/db';
import { getRequiredAppEnv } from '@/lib/env';

export async function createClient() {
  const cookieStore = await cookies();
  const env = getRequiredAppEnv();

  return createServerClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.supabasePublicKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: Parameters<SetAllCookies>[0]) {
        cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
      }
    }
  });
}
