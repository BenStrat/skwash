'use client';

import { Toggle } from '@base-ui/react/toggle';
import { ToggleGroup } from '@base-ui/react/toggle-group';
import { cn } from '@skwash/ui';
import type { ProjectViewportReviewCounts } from '@/lib/projects';

export type ViewportPreset = 'desktop' | 'tablet' | 'mobile';

const VIEWPORTS: Array<{ key: ViewportPreset; label: string; width: number }> = [
  { key: 'desktop', label: 'Desktop', width: 1440 },
  { key: 'tablet', label: 'Tablet', width: 578 },
  { key: 'mobile', label: 'Mobile', width: 375 }
];

export { VIEWPORTS };

function ViewportIcon({ viewport }: { viewport: ViewportPreset }) {
  switch (viewport) {
    case 'desktop':
      return (
        <svg
          aria-hidden="true"
          className="h-4 w-4"
          fill="currentColor"
          viewBox="0 0 256 256"
        >
          <path d="M208 40H48a24 24 0 0 0-24 24v112a24 24 0 0 0 24 24h72v16H96a8 8 0 0 0 0 16h64a8 8 0 0 0 0-16h-24v-16h72a24 24 0 0 0 24-24V64a24 24 0 0 0-24-24m8 136a8 8 0 0 1-8 8H48a8 8 0 0 1-8-8v-16h176Zm0-32H40V64a8 8 0 0 1 8-8h160a8 8 0 0 1 8 8Z" />
        </svg>
      );
    case 'tablet':
      return (
        <svg
          aria-hidden="true"
          className="h-4 w-4"
          fill="currentColor"
          viewBox="0 0 256 256"
        >
          <path d="M192 24H64a24 24 0 0 0-24 24v160a24 24 0 0 0 24 24h128a24 24 0 0 0 24-24V48a24 24 0 0 0-24-24M56 72h144v112H56Zm8-32h128a8 8 0 0 1 8 8v8H56v-8a8 8 0 0 1 8-8m128 176H64a8 8 0 0 1-8-8v-8h144v8a8 8 0 0 1-8 8" />
        </svg>
      );
    case 'mobile':
      return (
        <svg
          aria-hidden="true"
          className="h-4 w-4"
          fill="currentColor"
          viewBox="0 0 256 256"
        >
          <path d="M176 16H80a24 24 0 0 0-24 24v176a24 24 0 0 0 24 24h96a24 24 0 0 0 24-24V40a24 24 0 0 0-24-24M72 64h112v128H72Zm8-32h96a8 8 0 0 1 8 8v8H72v-8a8 8 0 0 1 8-8m96 192H80a8 8 0 0 1-8-8v-8h112v8a8 8 0 0 1-8 8" />
        </svg>
      );
  }
}

export function ViewportSelector({
  value,
  onChange,
  reviewCounts
}: {
  value: ViewportPreset;
  onChange: (value: ViewportPreset) => void;
  reviewCounts?: ProjectViewportReviewCounts;
}) {
  return (
    <ToggleGroup
      aria-label="Viewport"
      className="flex flex-wrap gap-0"
      onValueChange={(groupValue) => {
        const nextValue = groupValue[0] as ViewportPreset | undefined;

        if (nextValue) {
          onChange(nextValue);
        }
      }}
      value={[value]}
    >
      {VIEWPORTS.map((viewport) => {
        const hasReviews = (reviewCounts?.[viewport.key] ?? 0) > 0;

        return (
          <Toggle
            aria-label={viewport.label}
            className={(state) =>
              cn(
                'relative flex h-10 w-10 items-center justify-center rounded-xl border p-0 transition hover:bg-zinc-50',
                state.pressed
                  ? 'border-zinc-300 bg-zinc-100 text-zinc-950 shadow-sm'
                  : 'border-transparent bg-transparent text-zinc-600 shadow-none hover:border-transparent'
              )
            }
            key={viewport.key}
            title={viewport.label}
            value={viewport.key}
          >
            <ViewportIcon viewport={viewport.key} />
            {hasReviews ? (
              <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-indigo-600 ring-2 ring-white" />
            ) : null}
            <span className="sr-only">{viewport.label}</span>
          </Toggle>
        );
      })}
    </ToggleGroup>
  );
}
