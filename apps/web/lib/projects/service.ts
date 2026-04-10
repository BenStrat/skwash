import 'server-only';

import { createClient } from '@/lib/supabase/server';
import type { Database } from '@skwash/db';
import { z } from 'zod';
import type { ProjectViewportReviewCounts } from '@/lib/projects';
import { getAppSetupError, getErrorMessage } from '@/lib/app-setup';
import { isUnauthorizedError, requireAppUserContext } from '@/lib/app-user';

const projectStatusSchema = z.enum(['active', 'archived']);
const projectSortSchema = z.enum(['updated', 'name']);
const projectReviewStatusSchema = z.enum(['none', 'in_progress', 'ready_for_review', 'approved', 'changes_requested']);
const projectIdSchema = z.string().uuid();

export const projectListQuerySchema = z.object({
  status: projectStatusSchema.optional(),
  sort: projectSortSchema.optional()
});

export const projectCreateBodySchema = z.object({
  name: z.string().trim().min(1).max(120),
  base_url: z.string().trim().min(1)
});

export const projectUpdateBodySchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    base_url: z.string().trim().min(1).optional(),
    review_status: projectReviewStatusSchema.optional(),
    status: projectStatusSchema.optional()
  })
  .refine((value) => Object.values(value).some((entry) => entry !== undefined), {
    message: 'At least one field must be provided.'
  });

type ProjectRow = Database['public']['Tables']['projects']['Row'];
type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
type ProjectUpdate = Database['public']['Tables']['projects']['Update'];
type UserRow = Database['public']['Tables']['users']['Row'];
type ReviewItemRow = Database['public']['Tables']['review_items']['Row'];
type ReviewRoundRow = Database['public']['Tables']['review_rounds']['Row'];
type AnnotationRow = Database['public']['Tables']['annotations']['Row'];
type CommentRow = Database['public']['Tables']['comments']['Row'];
type ReviewerNoteRow = Database['public']['Tables']['reviewer_notes']['Row'];
type QueryError = {
  message: string;
};
type MaybeSingleResult<T> = {
  data: T | null;
  error: QueryError | null;
};
type MultiResult<T> = {
  data: T[] | null;
  error: QueryError | null;
};

export type ProjectRecord = ProjectRow & {
  reviewer_name: string | null;
  viewport_review_counts: ProjectViewportReviewCounts;
  review_items: ReviewItemRow[];
  domain: string;
};

export type ProjectListFilters = z.infer<typeof projectListQuerySchema>;

type AuthContext =
  | {
      supabase: Awaited<ReturnType<typeof createClient>>;
      userId: string;
      orgId: string;
    }
  | {
      error: string;
      status: number;
    };

function normalizeBaseUrl(rawUrl: string) {
  const candidate = rawUrl.trim();
  const withProtocol = /^https?:\/\//i.test(candidate) ? candidate : `https://${candidate}`;
  const url = new URL(withProtocol);

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error('Only http:// and https:// URLs are supported.');
  }

  url.hash = '';

  return url.toString();
}

function deriveReviewItemTitle(baseUrl: string) {
  const parsed = new URL(baseUrl);
  const pathname = parsed.pathname.replace(/\/+$/, '');

  if (!pathname || pathname === '') {
    return 'Home';
  }

  return `${parsed.hostname}${pathname}`;
}

function toProjectRecord(
  project: ProjectRow,
  reviewItems: ReviewItemRow[],
  reviewerName: string | null = null,
  viewportReviewCounts: ProjectViewportReviewCounts = {
    desktop: 0,
    tablet: 0,
    mobile: 0
  }
): ProjectRecord {
  return {
    ...project,
    reviewer_name: reviewerName,
    viewport_review_counts: viewportReviewCounts,
    review_items: reviewItems,
    domain: new URL(project.base_url).hostname
  };
}

function toServiceError(error: unknown, fallbackMessage: string) {
  if (isUnauthorizedError(error)) {
    return { error: 'Unauthorized', status: 401 };
  }

  const setupError = getAppSetupError(error);
  if (setupError) {
    return { error: setupError.message, status: setupError.status };
  }

  const message = getErrorMessage(error);
  return { error: message ?? fallbackMessage, status: 500 };
}

function toQueryFailure(error: QueryError | null, fallbackMessage: string) {
  return toServiceError(error, fallbackMessage);
}

async function getAuthContext(): Promise<AuthContext> {
  try {
    const context = await requireAppUserContext();
    const supabase = await createClient();

    return {
      supabase,
      userId: context.userId,
      orgId: context.orgId
    };
  } catch (error) {
    return toServiceError(error, 'Unable to load the active workspace.');
  }
}

async function loadProjectReviewItems(supabase: Awaited<ReturnType<typeof createClient>>, projectIds: string[]) {
  if (projectIds.length === 0) {
    return new Map<string, ReviewItemRow[]>();
  }

  const { data, error } = ((await supabase
    .from('review_items')
    .select('*')
    .in('project_id', projectIds)
    .order('sort_order', {
      ascending: true
    })) as unknown) as MultiResult<ReviewItemRow>;

  if (error) {
    return toQueryFailure(error, 'Unable to load review items.');
  }

  const grouped = new Map<string, ReviewItemRow[]>();

  for (const item of data ?? []) {
    const existing = grouped.get(item.project_id) ?? [];
    existing.push(item);
    grouped.set(item.project_id, existing);
  }

  return grouped;
}

async function loadReviewerDisplayName(
  supabase: Awaited<ReturnType<typeof createClient>>,
  reviewerId: string
) {
  const { data, error } = ((await supabase
    .from('users')
    .select('display_name')
    .eq('id', reviewerId)
    .maybeSingle()) as unknown) as MaybeSingleResult<Pick<UserRow, 'display_name'>>;

  if (error) {
    return toQueryFailure(error, 'Unable to load the reviewer profile.');
  }

  return data?.display_name ?? null;
}

async function loadProjectReviewerName(
  supabase: Awaited<ReturnType<typeof createClient>>,
  reviewItemIds: string[]
) {
  if (reviewItemIds.length === 0) {
    return null;
  }

  const { data: annotations, error: annotationsError } = ((await supabase
    .from('annotations')
    .select('id, author_id, created_at')
    .in('review_item_id', reviewItemIds)
    .order('created_at', { ascending: false })) as unknown) as MultiResult<
    Pick<AnnotationRow, 'id' | 'author_id' | 'created_at'>
  >;

  if (annotationsError) {
    return toQueryFailure(annotationsError, 'Unable to load project annotations.');
  }

  const annotationIds = (annotations ?? []).map((annotation) => annotation.id);

  const { data: comments, error: commentsError } =
    annotationIds.length === 0
      ? { data: [], error: null }
      : (((await supabase
          .from('comments')
          .select('author_id, created_at')
          .in('annotation_id', annotationIds)
          .order('created_at', { ascending: false })) as unknown) as MultiResult<
          Pick<CommentRow, 'author_id' | 'created_at'>
        >);

  if (commentsError) {
    return toQueryFailure(commentsError, 'Unable to load project comments.');
  }

  const { data: reviewRounds, error: reviewRoundsError } = ((await supabase
    .from('review_rounds')
    .select('created_by, created_at')
    .in('review_item_id', reviewItemIds)
    .order('created_at', { ascending: false })) as unknown) as MultiResult<
    Pick<ReviewRoundRow, 'created_by' | 'created_at'>
  >;

  if (reviewRoundsError) {
    return toQueryFailure(reviewRoundsError, 'Unable to load project review rounds.');
  }

  const { data: reviewerNotes, error: reviewerNotesError } = ((await supabase
    .from('reviewer_notes')
    .select('updated_by, updated_at')
    .in('review_item_id', reviewItemIds)
    .order('updated_at', { ascending: false })) as unknown) as MultiResult<
    Pick<ReviewerNoteRow, 'updated_by' | 'updated_at'>
  >;

  if (reviewerNotesError) {
    return toQueryFailure(reviewerNotesError, 'Unable to load reviewer notes.');
  }

  const latestActivity = [
    ...(comments ?? []).map((comment) => ({
      reviewerId: comment.author_id,
      occurredAt: comment.created_at
    })),
    ...(annotations ?? []).map((annotation) => ({
      reviewerId: annotation.author_id,
      occurredAt: annotation.created_at
    })),
    ...(reviewRounds ?? []).map((reviewRound) => ({
      reviewerId: reviewRound.created_by,
      occurredAt: reviewRound.created_at
    })),
    ...(reviewerNotes ?? []).map((reviewerNote) => ({
      reviewerId: reviewerNote.updated_by,
      occurredAt: reviewerNote.updated_at
    }))
  ]
    .filter((activity) => activity.reviewerId && activity.occurredAt)
    .sort((left, right) => new Date(right.occurredAt).getTime() - new Date(left.occurredAt).getTime())[0];

  if (!latestActivity) {
    return null;
  }

  return loadReviewerDisplayName(supabase, latestActivity.reviewerId);
}

function normalizeAnnotationViewport(viewport: string): keyof ProjectViewportReviewCounts | null {
  const normalizedViewport = viewport.trim().toLowerCase();

  if (normalizedViewport.includes('mobile')) {
    return 'mobile';
  }

  if (normalizedViewport.includes('tablet')) {
    return 'tablet';
  }

  if (normalizedViewport.includes('desktop')) {
    return 'desktop';
  }

  return null;
}

async function loadProjectViewportReviewCounts(
  supabase: Awaited<ReturnType<typeof createClient>>,
  reviewItemIds: string[]
) {
  const emptyCounts: ProjectViewportReviewCounts = {
    desktop: 0,
    tablet: 0,
    mobile: 0
  };

  if (reviewItemIds.length === 0) {
    return emptyCounts;
  }

  const { data, error } = ((await supabase
    .from('annotations')
    .select('viewport')
    .in('review_item_id', reviewItemIds)
    .eq('status', 'active')) as unknown) as MultiResult<Pick<AnnotationRow, 'viewport'>>;

  if (error) {
    return toQueryFailure(error, 'Unable to load viewport review counts.');
  }

  for (const annotation of data ?? []) {
    const viewportKey = normalizeAnnotationViewport(annotation.viewport);

    if (!viewportKey) {
      continue;
    }

    emptyCounts[viewportKey] += 1;
  }

  return emptyCounts;
}

export async function listProjects(filters: ProjectListFilters) {
  const auth = await getAuthContext();

  if ('error' in auth) {
    return auth;
  }

  let query = auth.supabase.from('projects').select('*').eq('org_id', auth.orgId);

  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  query =
    filters.sort === 'name'
      ? query.order('name', { ascending: true })
      : query.order('updated_at', { ascending: false });

  const { data, error } = ((await query) as unknown) as MultiResult<ProjectRow>;

  if (error) {
    return toQueryFailure(error, 'Unable to load projects.');
  }

  const reviewItemsByProject = await loadProjectReviewItems(
    auth.supabase,
    (data ?? []).map((project) => project.id)
  );

  if ('error' in reviewItemsByProject) {
    return reviewItemsByProject;
  }

  return {
    projects: (data ?? []).map((project) => toProjectRecord(project, reviewItemsByProject.get(project.id) ?? []))
  };
}

export async function getProject(projectId: string) {
  const parsedId = projectIdSchema.safeParse(projectId);
  if (!parsedId.success) {
    return { error: 'Invalid project id.', status: 400 };
  }

  const auth = await getAuthContext();
  if ('error' in auth) {
    return auth;
  }

  const { data: project, error } = ((await auth.supabase
    .from('projects')
    .select('*')
    .eq('org_id', auth.orgId)
    .eq('id', parsedId.data)
    .maybeSingle()) as unknown) as MaybeSingleResult<ProjectRow>;

  if (error) {
    return toQueryFailure(error, 'Unable to load the requested project.');
  }

  if (!project) {
    return { error: 'Project not found.', status: 404 };
  }

  const { data: reviewItems, error: reviewItemsError } = ((await auth.supabase
    .from('review_items')
    .select('*')
    .eq('project_id', project.id)
    .order('sort_order', { ascending: true })) as unknown) as MultiResult<ReviewItemRow>;

  if (reviewItemsError) {
    return toQueryFailure(reviewItemsError, 'Unable to load project review items.');
  }

  const reviewerName = await loadProjectReviewerName(
    auth.supabase,
    (reviewItems ?? []).map((reviewItem) => reviewItem.id)
  );

  if (reviewerName && typeof reviewerName === 'object' && 'error' in reviewerName) {
    return reviewerName;
  }

  const viewportReviewCounts = await loadProjectViewportReviewCounts(
    auth.supabase,
    (reviewItems ?? []).map((reviewItem) => reviewItem.id)
  );

  if (viewportReviewCounts && typeof viewportReviewCounts === 'object' && 'error' in viewportReviewCounts) {
    return viewportReviewCounts;
  }

  return {
    project: toProjectRecord(
      project,
      reviewItems ?? [],
      reviewerName ?? null,
      viewportReviewCounts
    )
  };
}

export async function createProject(input: z.infer<typeof projectCreateBodySchema>) {
  const parsed = projectCreateBodySchema.safeParse(input);
  if (!parsed.success) {
    return { error: 'Invalid project payload.', status: 400 };
  }

  let normalizedBaseUrl: string;
  try {
    normalizedBaseUrl = normalizeBaseUrl(parsed.data.base_url);
  } catch {
    return { error: 'Please provide a valid base URL.', status: 400 };
  }

  const auth = await getAuthContext();
  if ('error' in auth) {
    return auth;
  }

  const projectInsert: ProjectInsert = {
    org_id: auth.orgId,
    name: parsed.data.name,
    base_url: normalizedBaseUrl
  };

  const { data: project, error } = ((await auth.supabase
    .from('projects')
    .insert(projectInsert as never)
    .select('*')
    .single()) as unknown) as MaybeSingleResult<ProjectRow>;

  if (error || !project) {
    return toQueryFailure(error, 'Unable to create project.');
  }

  const { data: reviewItem, error: reviewItemError } = ((await auth.supabase
    .from('review_items')
    .insert({
      project_id: project.id,
      url: normalizedBaseUrl,
      title: deriveReviewItemTitle(normalizedBaseUrl)
    } as never)
    .select('*')
    .single()) as unknown) as MaybeSingleResult<ReviewItemRow>;

  if (reviewItemError || !reviewItem) {
    await auth.supabase.from('projects').delete().eq('id', project.id);
    return toQueryFailure(reviewItemError, 'Unable to create review item.');
  }

  return {
    project: toProjectRecord(project, [reviewItem])
  };
}

export async function updateProject(projectId: string, input: z.infer<typeof projectUpdateBodySchema>) {
  const parsedId = projectIdSchema.safeParse(projectId);
  if (!parsedId.success) {
    return { error: 'Invalid project id.', status: 400 };
  }

  const parsed = projectUpdateBodySchema.safeParse(input);
  if (!parsed.success) {
    return { error: 'Invalid project payload.', status: 400 };
  }

  const auth = await getAuthContext();
  if ('error' in auth) {
    return auth;
  }

  const update: ProjectUpdate = {};
  if (parsed.data.name) {
    update.name = parsed.data.name;
  }
  if (parsed.data.base_url) {
    try {
      update.base_url = normalizeBaseUrl(parsed.data.base_url);
    } catch {
      return { error: 'Please provide a valid base URL.', status: 400 };
    }
  }
  if (parsed.data.review_status) {
    update.review_status = parsed.data.review_status;
  }
  if (parsed.data.status) {
    update.status = parsed.data.status;
  }

  const { data: existingProject, error: fetchError } = ((await auth.supabase
    .from('projects')
    .select('*')
    .eq('org_id', auth.orgId)
    .eq('id', parsedId.data)
    .maybeSingle()) as unknown) as MaybeSingleResult<ProjectRow>;

  if (fetchError) {
    return toQueryFailure(fetchError, 'Unable to load the requested project.');
  }

  if (!existingProject) {
    return { error: 'Project not found.', status: 404 };
  }

  const { data: project, error } = ((await auth.supabase
    .from('projects')
    .update(update as never)
    .eq('id', existingProject.id)
    .select('*')
    .single()) as unknown) as MaybeSingleResult<ProjectRow>;

  if (error || !project) {
    return toQueryFailure(error, 'Unable to update project.');
  }

  const reviewItemUpdate: { url?: string; title?: string } = {};
  if (parsed.data.base_url) {
    reviewItemUpdate.url = update.base_url ?? existingProject.base_url;
    reviewItemUpdate.title = deriveReviewItemTitle(reviewItemUpdate.url);
  }

  if (Object.keys(reviewItemUpdate).length > 0) {
    const { error: reviewItemError } = (await auth.supabase
      .from('review_items')
      .update(reviewItemUpdate as never)
      .eq('project_id', project.id)
      .eq('sort_order', 0)) as { error: QueryError | null };

    if (reviewItemError) {
      return toQueryFailure(reviewItemError, 'Unable to update the primary review item.');
    }
  }

  const { data: reviewItems, error: reviewItemsError } = ((await auth.supabase
    .from('review_items')
    .select('*')
    .eq('project_id', project.id)
    .order('sort_order', { ascending: true })) as unknown) as MultiResult<ReviewItemRow>;

  if (reviewItemsError) {
    return toQueryFailure(reviewItemsError, 'Unable to load updated review items.');
  }

  return {
    project: toProjectRecord(project, reviewItems ?? [])
  };
}

export async function deleteProject(projectId: string) {
  const parsedId = projectIdSchema.safeParse(projectId);
  if (!parsedId.success) {
    return { error: 'Invalid project id.', status: 400 };
  }

  const auth = await getAuthContext();
  if ('error' in auth) {
    return auth;
  }

  const { data: project, error: fetchError } = ((await auth.supabase
    .from('projects')
    .select('id')
    .eq('org_id', auth.orgId)
    .eq('id', parsedId.data)
    .maybeSingle()) as unknown) as MaybeSingleResult<Pick<ProjectRow, 'id'>>;

  if (fetchError) {
    return toQueryFailure(fetchError, 'Unable to load the requested project.');
  }

  if (!project) {
    return { error: 'Project not found.', status: 404 };
  }

  const { error } = ((await auth.supabase.from('projects').delete().eq('id', project.id)) as unknown) as {
    error: QueryError | null;
  };

  if (error) {
    return toQueryFailure(error, 'Unable to delete project.');
  }

  return { ok: true as const };
}
