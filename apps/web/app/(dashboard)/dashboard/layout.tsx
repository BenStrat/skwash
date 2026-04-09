import { AuthenticatedDashboardShell } from "@/components/layout/authenticated-dashboard-shell";

export default function DashboardPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthenticatedDashboardShell mainClassName="flex min-h-0 min-w-0 flex-1 flex-col">
      {children}
    </AuthenticatedDashboardShell>
  );
}
