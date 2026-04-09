'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { bootstrapUser } from '@/lib/bootstrap-user';
import { hasRequiredAppEnv } from '@/lib/env';
import { createClient } from '@/lib/supabase/server';

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});
type AuthCredentials = z.infer<typeof authSchema>;

type AuthActionResult = {
  error?: string;
  message?: string;
};

const missingConfigMessage =
  'Supabase is not configured yet. Copy .env.example to .env.local and add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.';

function parseAuthForm(formData: FormData): AuthCredentials | null {
  const parsed = authSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password')
  });

  if (!parsed.success) {
    return null;
  }

  return parsed.data;
}

async function bootstrapAndRedirect(): Promise<AuthActionResult> {
  const result = await bootstrapUser();

  if ('error' in result) {
    return { error: result.error };
  }

  redirect('/dashboard');
}

export async function loginAction(formData: FormData): Promise<AuthActionResult> {
  if (!hasRequiredAppEnv) {
    return { error: missingConfigMessage };
  }

  const parsed = parseAuthForm(formData);
  if (!parsed) {
    return { error: 'Please provide a valid email address and password.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.email,
    password: parsed.password
  });

  if (error) {
    return { error: error.message };
  }

  return bootstrapAndRedirect();
}

export async function signupAction(formData: FormData): Promise<AuthActionResult> {
  if (!hasRequiredAppEnv) {
    return { error: missingConfigMessage };
  }

  const parsed = parseAuthForm(formData);
  if (!parsed) {
    return { error: 'Please provide a valid email address and password.' };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.email,
    password: parsed.password
  });

  if (error) {
    return { error: error.message };
  }

  if (data.session) {
    return bootstrapAndRedirect();
  }

  return {
    message: 'Account created. If email confirmation is enabled in Supabase, confirm your email before logging in.'
  };
}

export async function signoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
