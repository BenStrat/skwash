import { AuthenticatedDashboardShell } from "@/components/layout/authenticated-dashboard-shell";
import { SidebarWorkspaceSwitcher } from "@/components/layout/sidebar-workspace-switcher";
import { getAppUserContext } from "@/lib/app-user";

export default async function DashboardPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAppUserContext();

  return (
    <AuthenticatedDashboardShell
      mainClassName="flex min-h-0 min-w-0 flex-1 flex-col"
      sidebarProps={{
        headerSlot: (
          <SidebarWorkspaceSwitcher
            displayName={user?.displayName ?? "Workspace member"}
          />
        ),
      }}
    >
      {children}
    </AuthenticatedDashboardShell>
  );
}
