"use client";

import Link from "next/link";
import { Menu } from "@base-ui/react/menu";
import { signoutAction } from "@/app/(auth)/actions";
import { cn } from "@skwash/ui";

type DashboardUserMenuProps = {
  displayName: string;
  email: string;
};

const itemClassName = cn(
  "flex w-full cursor-default items-center rounded-xl px-3 py-2 text-left text-sm font-medium text-zinc-700 outline-none transition",
  "data-[highlighted]:bg-zinc-100 data-[highlighted]:text-zinc-950",
);

export function DashboardUserMenu({
  displayName,
  email,
}: DashboardUserMenuProps) {
  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label={`${displayName} menu`}
        className="flex list-none items-center gap-3 rounded-xl px-4 py-2 text-left text-sm text-zinc-950 outline-none transition focus-visible:ring-2 focus-visible:ring-zinc-300 data-[popup-open]:[&_svg]:rotate-180"
      >
        <div className="min-w-0">
          <p className="truncate font-medium">{displayName}</p>
        </div>
        <span className="text-xs text-zinc-500">
          <svg
            aria-hidden="true"
            fill="none"
            height="10"
            viewBox="0 0 10 10"
            width="10"
            className="transition"
          >
            <path
              d="M1.25 3.5L5 7.25L8.75 3.5"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.25"
            />
          </svg>
        </span>
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Positioner align="end" className="z-20 outline-none" sideOffset={12}>
          <Menu.Popup className="origin-[var(--transform-origin)] w-56 rounded-2xl border border-zinc-200 bg-white p-2 shadow-[0_18px_48px_rgba(15,23,42,0.14)] outline-none transition-[transform,scale,opacity] data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
            <div className="rounded-xl px-3 py-2">
              <p className="text-sm font-medium text-zinc-950">{displayName}</p>
              <p className="mt-1 truncate text-xs text-zinc-500">{email}</p>
            </div>

            <div className="my-2 h-px bg-zinc-100" />

            <Menu.LinkItem
              className={itemClassName}
              closeOnClick
              render={<Link href="/profile" />}
            >
              Your profile
            </Menu.LinkItem>

            <form action={signoutAction}>
              <Menu.Item
                className={itemClassName}
                nativeButton
                render={<button type="submit" />}
              >
                Sign out
              </Menu.Item>
            </form>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
