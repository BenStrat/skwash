'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const authSchema = z.object({
  email: z.string().email()
});

async function sendMagicLink(formData: FormData, mode: 'login' | 'signup') {
  const parsed = authSchema.safeParse({
    email: formData.get('email')
  });

  if (!parsed.success) {
    return { error: 'Please provide a valid email address.' };
  }

  const supabase = await createClient();
  const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`;

  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: {
      shouldCreateUser: mode === 'signup',
      emailRedirectTo: redirectTo
    }
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function loginAction(formData: FormData) {
  return sendMagicLink(formData, 'login');
}

export async function signupAction(formData: FormData) {
  return sendMagicLink(formData, 'signup');
}

export async function signoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
