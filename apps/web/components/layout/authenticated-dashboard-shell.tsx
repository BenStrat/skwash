import { redirect } from "next/navigation";
import { SetupGuide } from "@/components/layout/setup-guide";
import { Sidebar, type SidebarProps } from "@/components/layout/sidebar";
import { TopBar, type TopBarProps } from "@/components/layout/top-bar";
import { isAppSetupError } from "@/lib/app-setup";
import { getAppUserContext } from "@/lib/app-user";

type AuthenticatedDashboardShellProps = {
  children: React.ReactNode;
  mainClassName?: string;
  sidebarProps?: Omit<SidebarProps, "organisationName" | "displayName">;
  topBarProps?: Omit<TopBarProps, "email" | "displayName">;
};

export async function AuthenticatedDashboardShell({
  children,
  mainClassName,
  sidebarProps,
  topBarProps,
}: AuthenticatedDashboardShellProps) {
  let user;
  try {
    user = await getAppUserContext();
  } catch (error) {
    if (isAppSetupError(error)) {
      return (
        <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-4 py-12">
          <SetupGuide mode="database" />
        </main>
      );
    }

    throw error;
  }

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-white">
      <TopBar
        displayName={user.displayName}
        email={user.email || "Unknown user"}
        {...topBarProps}
      />
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <Sidebar
          displayName={user.displayName}
          organisationName={user.orgName}
          {...sidebarProps}
        />
        <main
          className={
            mainClassName ??
            "flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto bg-white p-6"
          }
        >
          {children}
        </main>
      </div>
    </div>
  );
}
