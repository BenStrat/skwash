import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { bootstrapUser } from '@/lib/bootstrap-user';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
    }

    const result = await bootstrapUser();
    if ('error' in result) {
      return NextResponse.redirect(`${origin}/login?error=bootstrap_failed`);
    }
  }

  return NextResponse.redirect(`${origin}/dashboard`);
}
