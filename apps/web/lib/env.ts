import { z } from 'zod';

export const requiredAppEnv = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'
] as const;

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1)
});

const rawEnv = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
};

const parsedEnv = envSchema.safeParse(rawEnv);

export const hasRequiredAppEnv = parsedEnv.success;

export function getRequiredAppEnv() {
  if (parsedEnv.success) {
    return {
      ...parsedEnv.data,
      supabasePublicKey: parsedEnv.data.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    };
  }

  throw new Error(
    `Missing or invalid environment variables. Copy .env.example to .env.local and set ${requiredAppEnv.join(', ')}.`
  );
}
