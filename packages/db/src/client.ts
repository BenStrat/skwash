import { createBrowserClient, createServerClient, type CookieOptions, type SetAllCookies } from '@supabase/ssr';
import type { Database } from './types';

function getSupabasePublicKey() {
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (publishableKey) {
    return publishableKey;
  }

  throw new Error('Missing Supabase public key. Set NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.');
}

export function createClient() {
  return createBrowserClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, getSupabasePublicKey());
}

export function createSsrClient(cookieStore: {
  getAll(): { name: string; value: string }[];
  setAll(cookies: { name: string; value: string; options: CookieOptions }[]): void;
}) {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    getSupabasePublicKey(),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: Parameters<SetAllCookies>[0]) {
          cookieStore.setAll(cookiesToSet);
        }
      }
    }
  );
}
