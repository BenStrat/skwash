'use client';

import { ActiveProjectsSection } from '@/components/dashboard/active-projects-section';
import { ArchivedProjectsSection } from '@/components/dashboard/archived-projects-section';
import { ProjectComposerDialog } from '@/components/dashboard/project-composer-dialog';
import { ProjectUrlForm } from '@/components/dashboard/project-url-form';
import { useProjectDashboard } from '@/components/dashboard/use-project-dashboard';
import type { ProjectListItem } from '@/lib/projects';

type ProjectDashboardProps = {
  initialProjects: ProjectListItem[];
  userName: string;
};

export function ProjectDashboard({ initialProjects, userName }: ProjectDashboardProps) {
  const {
    activeProjects,
    activeProjectSort,
    archivedProjects,
    composer,
    closeComposer,
    draftUrl,
    error,
    handleArchive,
    handleComposerSubmit,
    handleCreateSubmit,
    handleDelete,
    isPending,
    openEditComposer,
    setDraftUrl,
    setActiveProjectSort,
    updateComposerBaseUrl,
    updateComposerName
  } = useProjectDashboard(initialProjects);

  return (
    <section className="space-y-0">
      <ProjectUrlForm
        draftUrl={draftUrl}
        isPending={isPending}
        onDraftUrlChange={setDraftUrl}
        onSubmit={handleCreateSubmit}
      />

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      <ActiveProjectsSection
        onArchive={handleArchive}
        onDelete={handleDelete}
        onEdit={openEditComposer}
        onSortChange={setActiveProjectSort}
        projects={activeProjects}
        sort={activeProjectSort}
        title={userName}
      />

      <ArchivedProjectsSection
        onArchiveToggle={handleArchive}
        onDelete={handleDelete}
        onEdit={openEditComposer}
        projects={archivedProjects}
      />

      <ProjectComposerDialog
        composer={composer}
        isPending={isPending}
        onBaseUrlChange={updateComposerBaseUrl}
        onClose={closeComposer}
        onNameChange={updateComposerName}
        onSubmit={handleComposerSubmit}
      />
    </section>
  );
}
