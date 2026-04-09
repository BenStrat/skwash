import { NextResponse } from 'next/server';
import { z } from 'zod';
import { hasRequiredAppEnv } from '@/lib/env';
import { bootstrapUser } from '@/lib/bootstrap-user';

const bodySchema = z.object({}).optional();

export async function POST(request: Request) {
  const json = await request.json().catch(() => ({}));
  const parsed = bodySchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (!hasRequiredAppEnv) {
    return NextResponse.json(
      {
        error:
          'Supabase is not configured yet. Copy .env.example to .env.local and add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.'
      },
      { status: 503 }
    );
  }

  const result = await bootstrapUser();

  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ ok: true });
}
