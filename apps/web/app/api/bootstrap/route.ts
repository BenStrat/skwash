import { NextResponse } from 'next/server';
import { z } from 'zod';
import { bootstrapUser } from '@/lib/bootstrap-user';

const bodySchema = z.object({}).optional();

export async function POST(request: Request) {
  const json = await request.json().catch(() => ({}));
  const parsed = bodySchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const result = await bootstrapUser();

  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ ok: true });
}
