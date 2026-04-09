'use client';

import { Menu } from '@base-ui/react/menu';
import { type ProjectListItem } from '@/lib/projects';

type ProjectCardMenuProps = {
  project: ProjectListItem;
  onEdit: (project: ProjectListItem) => void;
  onArchive: (project: ProjectListItem) => void;
  onDelete: (project: ProjectListItem) => void;
};

export function ProjectCardMenu({ project, onEdit, onArchive, onDelete }: ProjectCardMenuProps) {
  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label="Project actions"
        className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-zinc-500 outline-none transition-colors hover:bg-zinc-100 hover:text-zinc-950 focus-visible:ring-2 focus-visible:ring-zinc-300 data-[popup-open]:bg-zinc-100 data-[popup-open]:text-zinc-950"
      >
        <DotsThreeVerticalIcon />
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Positioner align="end" className="z-10 outline-none" sideOffset={8}>
          <Menu.Popup className="origin-[var(--transform-origin)] w-40 rounded-xl border border-zinc-200 bg-white p-1 shadow-lg outline-none transition-[transform,scale,opacity] data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
            <Menu.Item
              className="flex cursor-default rounded-xl px-3 py-2 text-left text-sm text-zinc-700 outline-none transition data-[highlighted]:bg-zinc-100 data-[highlighted]:text-zinc-950"
              onClick={() => onEdit(project)}
            >
              Edit
            </Menu.Item>
            <Menu.Item
              className="flex cursor-default rounded-xl px-3 py-2 text-left text-sm text-zinc-700 outline-none transition data-[highlighted]:bg-zinc-100 data-[highlighted]:text-zinc-950"
              onClick={() => onArchive(project)}
            >
              {project.status === 'active' ? 'Archive' : 'Restore'}
            </Menu.Item>
            <Menu.Item
              className="flex cursor-default rounded-xl px-3 py-2 text-left text-sm text-red-600 outline-none transition data-[highlighted]:bg-red-50 data-[highlighted]:text-red-700"
              onClick={() => onDelete(project)}
            >
              Delete
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

function DotsThreeVerticalIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-[18px] w-[18px] shrink-0 fill-current"
      viewBox="0 0 256 256"
    >
      <path d="M140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128ZM128,72a12,12,0,1,0-12-12A12,12,0,0,0,128,72Zm0,112a12,12,0,1,0,12,12A12,12,0,0,0,128,184Z" />
    </svg>
  );
}
