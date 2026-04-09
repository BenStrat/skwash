import Link from "next/link";
import { cn } from "@skwash/ui";

const navigationItems = [
  {
    href: "/dashboard",
    icon: HouseIcon,
    label: "Dashboard",
  },
  {
    href: "/settings",
    icon: GearSixIcon,
    label: "Settings",
  },
] as const;

export type SidebarProps = {
  organisationName: string;
  displayName: string;
  className?: string;
  headerSlot?: React.ReactNode;
  headerClassName?: string;
  contentSlot?: React.ReactNode;
  contentClassName?: string;
  footerSlot?: React.ReactNode;
  showNavigation?: boolean;
};

export function Sidebar({
  organisationName,
  displayName,
  className,
  headerSlot,
  headerClassName,
  contentSlot,
  contentClassName,
  footerSlot,
  showNavigation = true,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "flex min-h-0 w-72 shrink-0 flex-col overflow-hidden border-r border-zinc-200 bg-[radial-gradient(circle_at_top,#fafaf9_0%,#f4f4f5_35%,#f8fafc_100%)] p-4",
        className,
      )}
    >

      {showNavigation ? (
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
                href={item.href}
              >
                <Icon />
                <span className="min-w-0">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      ) : null}

      {contentSlot ? (
        <div
          className={cn(
            "min-h-0 flex-1 overflow-y-auto",
            showNavigation ? "mt-6" : "",
            contentClassName,
          )}
        >
          {contentSlot}
        </div>
      ) : (
        <div className="flex-1" />
      )}

      {footerSlot ? <div className="mt-4">{footerSlot}</div> : null}
    </aside>
  );
}

function HouseIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-[18px] w-[18px] shrink-0 fill-current"
      viewBox="0 0 256 256"
    >
      <path d="M219.31,108.68l-80-80a16,16,0,0,0-22.62,0l-80,80A15.87,15.87,0,0,0,32,120v96a8,8,0,0,0,8,8h64a8,8,0,0,0,8-8V160h32v56a8,8,0,0,0,8,8h64a8,8,0,0,0,8-8V120A15.87,15.87,0,0,0,219.31,108.68ZM208,208H160V152a8,8,0,0,0-8-8H104a8,8,0,0,0-8,8v56H48V120l80-80,80,80Z" />
    </svg>
  );
}

function GearSixIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-[18px] w-[18px] shrink-0 fill-current"
      viewBox="0 0 256 256"
    >
      <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm109.94-52.79a8,8,0,0,0-3.89-5.4l-29.83-17-.12-33.62a8,8,0,0,0-2.83-6.08,111.91,111.91,0,0,0-36.72-20.67,8,8,0,0,0-6.46.59L128,41.85,97.88,25a8,8,0,0,0-6.47-.6A112.1,112.1,0,0,0,54.73,45.15a8,8,0,0,0-2.83,6.07l-.15,33.65-29.83,17a8,8,0,0,0-3.89,5.4,106.47,106.47,0,0,0,0,41.56,8,8,0,0,0,3.89,5.4l29.83,17,.12,33.62a8,8,0,0,0,2.83,6.08,111.91,111.91,0,0,0,36.72,20.67,8,8,0,0,0,6.46-.59L128,214.15,158.12,231a7.91,7.91,0,0,0,3.9,1,8.09,8.09,0,0,0,2.57-.42,112.1,112.1,0,0,0,36.68-20.73,8,8,0,0,0,2.83-6.07l.15-33.65,29.83-17a8,8,0,0,0,3.89-5.4A106.47,106.47,0,0,0,237.94,107.21Zm-15,34.91-28.57,16.25a8,8,0,0,0-3,3c-.58,1-1.19,2.06-1.81,3.06a7.94,7.94,0,0,0-1.22,4.21l-.15,32.25a95.89,95.89,0,0,1-25.37,14.3L134,199.13a8,8,0,0,0-3.91-1h-.19c-1.21,0-2.43,0-3.64,0a8.08,8.08,0,0,0-4.1,1l-28.84,16.1A96,96,0,0,1,67.88,201l-.11-32.2a8,8,0,0,0-1.22-4.22c-.62-1-1.23-2-1.8-3.06a8.09,8.09,0,0,0-3-3.06l-28.6-16.29a90.49,90.49,0,0,1,0-28.26L61.67,97.63a8,8,0,0,0,3-3c.58-1,1.19-2.06,1.81-3.06a7.94,7.94,0,0,0,1.22-4.21l.15-32.25a95.89,95.89,0,0,1,25.37-14.3L122,56.87a8,8,0,0,0,4.1,1c1.21,0,2.43,0,3.64,0a8.08,8.08,0,0,0,4.1-1l28.84-16.1A96,96,0,0,1,188.12,55l.11,32.2a8,8,0,0,0,1.22,4.22c.62,1,1.23,2,1.8,3.06a8.09,8.09,0,0,0,3,3.06l28.6,16.29A90.49,90.49,0,0,1,222.9,142.12Z" />
    </svg>
  );
}
