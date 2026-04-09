'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@skwash/db';
import { getRequiredAppEnv } from '@/lib/env';

export function createClient() {
  const env = getRequiredAppEnv();
  return createBrowserClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.supabasePublicKey);
}
