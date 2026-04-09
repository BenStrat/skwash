'use client';

import { Menu } from '@base-ui/react/menu';
import Image from 'next/image';
import { cn } from '@skwash/ui';
import type { ActiveProjectSort } from '@/components/dashboard/project-dashboard.utils';

type ProjectSortControlsProps = {
  sort: ActiveProjectSort;
  onSortChange: (sort: ActiveProjectSort) => void;
};

const sortOptions: Array<{
  label: string;
  value: ActiveProjectSort;
}> = [
  { label: 'Newest first', value: 'recent-desc' },
  { label: 'Oldest first', value: 'recent-asc' },
  { label: 'A to Z', value: 'alpha-asc' },
  { label: 'Z to A', value: 'alpha-desc' }
];

export function ProjectSortControls({ sort, onSortChange }: ProjectSortControlsProps) {
  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label="Sort projects"
        className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-zinc-600 outline-none transition-colors hover:bg-zinc-100 hover:text-zinc-950 focus-visible:ring-2 focus-visible:ring-zinc-300 data-[popup-open]:bg-zinc-100 data-[popup-open]:text-zinc-950"
      >
        <Image
          alt=""
          aria-hidden="true"
          height={16}
          src="/assets/icons/arrows-down-up.svg"
          width={16}
        />
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Positioner align="end" className="z-30 outline-none" sideOffset={8}>
          <Menu.Popup className="origin-[var(--transform-origin)] min-w-48 rounded-xl border border-zinc-200 bg-white p-1 shadow-lg outline-none transition-[transform,scale,opacity] data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
            {sortOptions.map((option) => {
              const isSelected = option.value === sort;

              return (
                <Menu.Item
                  key={option.value}
                  className={cn(
                    'flex cursor-default items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-zinc-700 outline-none transition data-[highlighted]:bg-zinc-100 data-[highlighted]:text-zinc-950',
                    isSelected && 'font-medium text-zinc-950'
                  )}
                  onClick={() => onSortChange(option.value)}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'flex h-4 w-4 items-center justify-center rounded-full border border-zinc-300',
                      isSelected && 'border-zinc-950'
                    )}
                  >
                    <span
                      className={cn(
                        'h-2 w-2 rounded-full bg-zinc-950 opacity-0 transition-opacity',
                        isSelected && 'opacity-100'
                      )}
                    />
                  </span>
                  <span>{option.label}</span>
                </Menu.Item>
              );
            })}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
