import { notFound, redirect } from "next/navigation";
import {
  ProjectWorkspaceProvider,
  ProjectWorkspaceSidebarContent,
  ProjectWorkspaceSidebarHeader,
  ProjectWorkspaceTopBarControls,
} from "@/components/canvas/project-canvas";
import { ProjectWorkspaceShareButton } from "@/components/canvas/project-workspace-share-button";
import { AuthenticatedDashboardShell } from "@/components/layout/authenticated-dashboard-shell";
import { TopBarBrand } from "@/components/layout/top-bar";
import { getAppUserContext } from "@/lib/app-user";
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
  const user = await getAppUserContext();

  if ("error" in result) {
    if (result.status === 401) {
      redirect("/login");
    }

    notFound();
  }

  return (
    <ProjectWorkspaceProvider
      project={result.project}
      reviewerName={result.project.reviewer_name ?? "Reviewer"}
    >
      <AuthenticatedDashboardShell
        mainClassName="flex min-h-0 min-w-0 flex-1 overflow-hidden p-0"
        sidebarProps={{
          className: "w-[320px] bg-none bg-white p-0 xl:w-[340px]",
          contentClassName: "mt-0",
          contentSlot: <ProjectWorkspaceSidebarContent />,
          headerClassName: "mb-0",
          headerSlot: <ProjectWorkspaceSidebarHeader />,
          showNavigation: false,
        }}
        topBarProps={{
          centerSlot: <ProjectWorkspaceTopBarControls />,
          className: "bg-white",
          endSlot: (
            <ProjectWorkspaceShareButton orgName={user?.orgName ?? "Skwish"} />
          ),
          startSlot: <TopBarBrand iconOnly />,
          hideAccountControls: true,
        }}
      >
        {children}
      </AuthenticatedDashboardShell>
    </ProjectWorkspaceProvider>
  );
}
