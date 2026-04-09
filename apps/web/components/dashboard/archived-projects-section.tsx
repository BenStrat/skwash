'use client';

import { Button } from '@skwash/ui';
import type { ProjectListItem } from '@/lib/projects';

export type ArchivedProjectsSectionProps = {
  projects: ProjectListItem[];
  onArchiveToggle: (project: ProjectListItem) => void;
  onDelete: (project: ProjectListItem) => void;
  onEdit: (project: ProjectListItem) => void;
};

export function ArchivedProjectsSection({
  projects,
  onArchiveToggle,
  onDelete,
  onEdit
}: ArchivedProjectsSectionProps) {
  if (projects.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-950">Archived projects</h2>
          <p className="text-sm text-zinc-500">Restore a project whenever you want to review it again.</p>
        </div>
        <p className="text-sm text-zinc-500">{projects.length} archived</p>
      </div>

      <div className="grid gap-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h3 className="font-medium text-zinc-950">{project.name}</h3>
              <p className="text-sm text-zinc-500">{project.base_url}</p>
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={() => onEdit(project)} type="button" variant="ghost">
                Edit
              </Button>
              <Button onClick={() => onArchiveToggle(project)} type="button" variant="ghost">
                Restore
              </Button>
              <Button onClick={() => onDelete(project)} type="button" variant="ghost">
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
