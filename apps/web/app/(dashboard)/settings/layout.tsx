import { AuthenticatedDashboardShell } from "@/components/layout/authenticated-dashboard-shell";

export default function SettingsPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthenticatedDashboardShell>{children}</AuthenticatedDashboardShell>;
}
