import { createBrowserClient, createServerClient } from '@supabase/ssr';
import type { Database } from './types';

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export function createSsrClient(cookieStore: {
  getAll(): { name: string; value: string }[];
  setAll(cookies: { name: string; value: string; options: Record<string, unknown> }[]): void;
}) {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookieStore.setAll(cookiesToSet);
        }
      }
    }
  );
}
