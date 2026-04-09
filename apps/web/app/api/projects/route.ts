import { NextResponse } from 'next/server';
import {
  createProject,
  listProjects,
  projectCreateBodySchema,
  projectListQuerySchema
} from '@/lib/projects/service';

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const parsed = projectListQuerySchema.safeParse({
    status: searchParams.get('status') ?? undefined,
    sort: searchParams.get('sort') ?? undefined
  });

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid query parameters.' }, { status: 400 });
  }

  const result = await listProjects(parsed.data);

  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ projects: result.projects });
}

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = projectCreateBodySchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid request body.' }, { status: 400 });
  }

  const result = await createProject(parsed.data);

  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ project: result.project }, { status: 201 });
}
