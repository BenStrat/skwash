'use client';

import { Button, cn } from '@skwash/ui';

export type ViewportPreset = 'mobile' | 'tablet' | 'desktop' | 'wide';

const VIEWPORTS: Array<{ key: ViewportPreset; label: string; width: number }> = [
  { key: 'mobile', label: '375', width: 375 },
  { key: 'tablet', label: '768', width: 768 },
  { key: 'desktop', label: '1440', width: 1440 },
  { key: 'wide', label: '1920', width: 1920 }
];

export { VIEWPORTS };

export function ViewportSelector({
  value,
  onChange
}: {
  value: ViewportPreset;
  onChange: (value: ViewportPreset) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {VIEWPORTS.map((viewport) => {
        const isActive = viewport.key === value;

        return (
          <Button
            key={viewport.key}
            className={cn(
              'inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition',
              isActive
                ? 'border-zinc-900 bg-zinc-900 text-white shadow-sm'
                : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50'
            )}
            onClick={() => onChange(viewport.key)}
            type="button"
            variant="ghost"
          >
            <span className="inline-flex h-2 w-2 rounded-full bg-current opacity-60" />
            <span>{viewport.label}px</span>
          </Button>
        );
      })}
    </div>
  );
}
