import type { Database } from '@skwash/db';

export type ProjectRow = Database['public']['Tables']['projects']['Row'];
export type ReviewItemRow = Database['public']['Tables']['review_items']['Row'];
export type ProjectViewportReviewCounts = {
  desktop: number;
  tablet: number;
  mobile: number;
};

export type ProjectListItem = Pick<
  ProjectRow,
  'id' | 'name' | 'base_url' | 'status' | 'review_status' | 'created_at' | 'updated_at'
>;

export type ProjectDetail = Pick<
  ProjectRow,
  'id' | 'org_id' | 'name' | 'base_url' | 'status' | 'review_status' | 'created_at' | 'updated_at'
> & {
  reviewer_name: string | null;
  viewport_review_counts: ProjectViewportReviewCounts;
  review_items: ReviewItemRow[];
};

export function normalizeProjectUrl(value: string) {
  const trimmed = value.trim();
  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  const url = new URL(candidate);

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error('Only http:// and https:// URLs are supported.');
  }

  url.hash = '';

  return url.toString();
}

export function getProjectDomain(value: string) {
  return new URL(value).hostname.replace(/^www\./, '');
}

export function suggestProjectName(value: string) {
  const [rawBase = 'project'] = getProjectDomain(value).split('.');

  return rawBase
    .split(/[-_]/g)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}
