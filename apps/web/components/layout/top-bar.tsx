import Link from "next/link";
import { signoutAction } from "@/app/(auth)/actions";
import { DashboardUserMenu } from "@/components/layout/dashboard-user-menu";
import { Button, cn } from "@skwash/ui";

export type TopBarProps = {
  email: string;
  displayName: string;
  className?: string;
  title?: string;
  subtitle?: string;
  startSlot?: React.ReactNode;
  centerSlot?: React.ReactNode;
  endSlot?: React.ReactNode;
  hideAccountControls?: boolean;
};

export function TopBarBrand({
  iconOnly = false,
}: {
  iconOnly?: boolean;
}) {
  return (
    <Link
      aria-label="Skwish dashboard"
      className={cn(
        "flex items-center gap-3 rounded-xl transition hover:opacity-90",
        iconOnly ? "justify-center" : "min-w-0",
      )}
      href="/dashboard"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.75rem] bg-zinc-950 text-xs font-semibold tracking-[-0.08em] text-white shadow-sm">
        _sk
      </div>
      {iconOnly ? null : (
        <div className="min-w-0">
          <p className="text-lg font-semibold tracking-tight text-zinc-950">
            Skwish
          </p>
        </div>
      )}
    </Link>
  );
}

export function TopBar({
  email,
  displayName,
  className,
  title = "Phase 1",
  subtitle = "Projects, review items, and the live iframe canvas are ready.",
  startSlot,
  centerSlot,
  endSlot,
  hideAccountControls = false,
}: TopBarProps) {
  const isWorkspaceTopBar = Boolean(startSlot || centerSlot || endSlot);
  const showAccountControls = !hideAccountControls;

  if (!isWorkspaceTopBar) {
    return (
      <header
        className={cn(
          "flex min-h-16 items-center justify-between gap-4 border-b border-zinc-200 bg-white/85 px-6 backdrop-blur",
          className,
        )}
      >
        <TopBarBrand />

        <DashboardUserMenu displayName={displayName} email={email} />
      </header>
    );
  }

  return (
    <header
      className={cn(
        "flex min-h-16 items-center gap-4 border-b border-zinc-200 bg-white/85 px-6 backdrop-blur",
        className,
      )}
    >
      {startSlot ? <div className="min-w-0 shrink-0">{startSlot}</div> : null}

      {centerSlot ? (
        <div
          className={cn(
            "min-w-0",
            !startSlot && !endSlot && !showAccountControls
              ? "flex flex-1 justify-center"
              : "flex-1",
          )}
        >
          {centerSlot}
        </div>
      ) : startSlot ? null : (
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-zinc-500">
            {title}
          </p>
          <p className="mt-1 text-sm text-zinc-700">{subtitle}</p>
        </div>
      )}

      {endSlot || showAccountControls ? (
        <div className="ml-auto flex shrink-0 items-center gap-3 text-sm">
          {endSlot ? (
            <div className="flex items-center gap-3">{endSlot}</div>
          ) : null}
          {showAccountControls ? (
            <>
              <div className="text-right">
                <p className="font-medium text-zinc-950">{displayName}</p>
                <p className="text-xs text-zinc-500">{email}</p>
              </div>
              <form action={signoutAction}>
                <Button size="sm" variant="ghost" type="submit">
                  Sign out
                </Button>
              </form>
            </>
          ) : null}
        </div>
      ) : null}
    </header>
  );
}
