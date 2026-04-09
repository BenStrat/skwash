import { notFound, redirect } from "next/navigation";
import {
  ProjectWorkspaceProvider,
  ProjectWorkspaceSidebarContent,
  ProjectWorkspaceSidebarHeader,
  ProjectWorkspaceTopBarActions,
  ProjectWorkspaceTopBarControls,
  ProjectWorkspaceTopBarStart,
} from "@/components/canvas/project-canvas";
import { AuthenticatedDashboardShell } from "@/components/layout/authenticated-dashboard-shell";
import { getProject } from "@/lib/projects/service";

export default async function ProjectWorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getProject(id);

  if ("error" in result) {
    if (result.status === 401) {
      redirect("/login");
    }

    notFound();
  }

  return (
    <ProjectWorkspaceProvider project={result.project}>
      <AuthenticatedDashboardShell
        mainClassName="flex min-h-0 min-w-0 flex-1 overflow-hidden p-0"
        sidebarProps={{
          className: "w-[320px] bg-white p-0 backdrop-blur xl:w-[340px]",
          contentClassName: "mt-0",
          contentSlot: <ProjectWorkspaceSidebarContent />,
          headerClassName: "mb-0",
          headerSlot: <ProjectWorkspaceSidebarHeader />,
          showNavigation: false,
        }}
        topBarProps={{
          centerSlot: <ProjectWorkspaceTopBarControls />,
          className: "bg-white px-5",
          endSlot: <ProjectWorkspaceTopBarActions />,
          startSlot: <ProjectWorkspaceTopBarStart />,
        }}
      >
        {children}
      </AuthenticatedDashboardShell>
    </ProjectWorkspaceProvider>
  );
}
