"use client";

import Image from "next/image";
import { Menu } from "@base-ui/react/menu";
import { cn } from "@skwash/ui";

type SidebarWorkspaceSwitcherProps = {
  displayName: string;
};

const menuItemClassName = cn(
  "flex w-full cursor-pointer items-center rounded-xl px-3 py-2 text-left text-sm font-medium text-zinc-700 outline-none transition",
  "data-[highlighted]:bg-zinc-100 data-[highlighted]:text-zinc-950",
);

export function SidebarWorkspaceSwitcher({
  displayName,
}: SidebarWorkspaceSwitcherProps) {
  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label={`${displayName} workspace menu`}
        className="flex w-full list-none items-center gap-3 rounded-2xl border border-zinc-200 bg-white/80 px-3 py-3 text-left text-sm text-zinc-950 outline-none transition hover:bg-white focus-visible:ring-2 focus-visible:ring-zinc-300 data-[popup-open]:border-zinc-300 data-[popup-open]:[&_svg]:rotate-180"
      >
        <Image
          alt=""
          className="h-10 w-10 shrink-0 rounded-xl border border-zinc-200 bg-zinc-100 object-cover"
          height={40}
          src="/assets/placeholders/workspace-placeholder.svg"
          width={40}
        />
        <span className="min-w-0 flex-1 truncate font-medium">
          {displayName}
        </span>
        <ChevronDownIcon />
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Positioner align="start" className="z-20 outline-none" sideOffset={12}>
          <Menu.Popup className="origin-[var(--transform-origin)] w-64 rounded-2xl border border-zinc-200 bg-white p-2 shadow-[0_18px_48px_rgba(15,23,42,0.14)] outline-none transition-[transform,scale,opacity] data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
            <div className="flex items-center gap-3 rounded-xl bg-zinc-50 px-3 py-2">
              <Image
                alt=""
                className="h-10 w-10 shrink-0 rounded-xl border border-zinc-200 bg-zinc-100 object-cover"
                height={40}
                src="/assets/placeholders/workspace-placeholder.svg"
                width={40}
              />
              <span className="min-w-0 truncate text-sm font-medium text-zinc-950">
                {displayName}
              </span>
            </div>

            <div className="my-2 h-px bg-zinc-100" />

            <Menu.Item
              className={menuItemClassName}
              nativeButton
              render={<button type="button" />}
            >
              + Add workspace
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 shrink-0 text-zinc-500 transition"
      fill="none"
      viewBox="0 0 10 10"
    >
      <path
        d="M1.25 3.5L5 7.25L8.75 3.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.25"
      />
    </svg>
  );
}
