'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@skwash/db';
import { env } from '@/lib/env';

export function createClient() {
  return createBrowserClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
