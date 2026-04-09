import type { ProjectListItem } from '@/lib/projects';

const relativeTimeFormatter = new Intl.RelativeTimeFormat('en', {
  numeric: 'auto'
});

export type ActiveProjectSort =
  | 'recent-desc'
  | 'recent-asc'
  | 'alpha-asc'
  | 'alpha-desc';

export function sortProjects(projects: ProjectListItem[]) {
  return [...projects].sort((left, right) => {
    if (left.status !== right.status) {
      return left.status === 'active' ? -1 : 1;
    }

    return new Date(right.updated_at).getTime() - new Date(left.updated_at).getTime();
  });
}

export function sortActiveProjects(projects: ProjectListItem[], sort: ActiveProjectSort) {
  const collator = new Intl.Collator('en', { sensitivity: 'base' });

  return [...projects].sort((left, right) => {
    switch (sort) {
      case 'recent-asc':
        return new Date(left.updated_at).getTime() - new Date(right.updated_at).getTime();
      case 'alpha-asc':
        return collator.compare(left.name, right.name);
      case 'alpha-desc':
        return collator.compare(right.name, left.name);
      case 'recent-desc':
      default:
        return new Date(right.updated_at).getTime() - new Date(left.updated_at).getTime();
    }
  });
}

export function formatRelativeUpdate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const diffMs = date.getTime() - Date.now();
  const absDiffMs = Math.abs(diffMs);

  if (absDiffMs < 60_000) {
    return 'just now';
  }

  if (absDiffMs < 3_600_000) {
    return relativeTimeFormatter.format(Math.round(diffMs / 60_000), 'minute');
  }

  if (absDiffMs < 86_400_000) {
    return relativeTimeFormatter.format(Math.round(diffMs / 3_600_000), 'hour');
  }

  if (absDiffMs < 2_592_000_000) {
    return relativeTimeFormatter.format(Math.round(diffMs / 86_400_000), 'day');
  }

  return relativeTimeFormatter.format(Math.round(diffMs / 2_592_000_000), 'month');
}

export function getProjectPreviewUrl(baseUrl: string) {
  return `https://image.thum.io/get/width/1200/crop/900/noanimate/${baseUrl}`;
}
