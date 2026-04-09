'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import { ProjectSearchControl } from '@/components/dashboard/project-search-control';
import { ProjectSortControls } from '@/components/dashboard/project-sort-controls';
import type { ActiveProjectSort } from '@/components/dashboard/project-dashboard.utils';
import { getProjectDomain, type ProjectListItem } from '@/lib/projects';
import { ProjectCard } from '@/components/dashboard/project-card';

type ActiveProjectsSectionProps = {
  onSortChange: (sort: ActiveProjectSort) => void;
  projects: ProjectListItem[];
  onArchive: (project: ProjectListItem) => void;
  onDelete: (project: ProjectListItem) => void;
  onEdit: (project: ProjectListItem) => void;
  sort: ActiveProjectSort;
  title: string;
};

export function ActiveProjectsSection({
  onSortChange,
  projects,
  onArchive,
  onDelete,
  onEdit,
  sort,
  title
}: ActiveProjectsSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const normalizedSearchQuery = deferredSearchQuery.trim().toLowerCase();

  const filteredProjects = useMemo(() => {
    if (!normalizedSearchQuery) {
      return projects;
    }

    return projects.filter((project) => {
      const domain = getProjectDomain(project.base_url).toLowerCase();
      const projectName = project.name.toLowerCase();
      const baseUrl = project.base_url.toLowerCase();

      return (
        domain.includes(normalizedSearchQuery) ||
        projectName.includes(normalizedSearchQuery) ||
        baseUrl.includes(normalizedSearchQuery)
      );
    });
  }, [normalizedSearchQuery, projects]);

  const isSearchActive = isSearchOpen || searchQuery.trim().length > 0;

  return (
    <div className="px-6 sm:px-8">
      {projects.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-zinc-300 bg-white px-6 py-16 text-center shadow-sm">
          <p className="text-sm font-medium text-zinc-900">Paste a URL above to start your first review.</p>
          <p className="mt-2 text-sm text-zinc-500">Projects appear here as cards once the base URL is saved.</p>
        </div>
      ) : (
        <div className="space-y-5">
          <header className="-mx-6 border-b border-zinc-200 px-6 py-4 sm:-mx-8 sm:px-8 sm:py-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-zinc-950">{title}</h2>
              </div>
              <div className="flex items-center gap-1">
                {isSearchActive ? null : <ProjectSortControls onSortChange={onSortChange} sort={sort} />}
                <ProjectSearchControl
                  isOpen={isSearchOpen}
                  onChange={(value) => {
                    setSearchQuery(value);
                    if (value.trim()) {
                      setIsSearchOpen(true);
                    }
                  }}
                  onClear={() => {
                    setSearchQuery('');
                    setIsSearchOpen(false);
                  }}
                  onClose={() => setIsSearchOpen(false)}
                  onOpen={() => setIsSearchOpen(true)}
                  query={searchQuery}
                />
              </div>
            </div>
          </header>

          <div className="py-4 sm:py-5">
            {filteredProjects.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-zinc-300 bg-white px-6 py-12 text-center">
                <p className="text-sm font-medium text-zinc-900">No projects match your search.</p>
                <p className="mt-2 text-sm text-zinc-500">Try a project name, domain, or URL.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    onArchive={onArchive}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    project={project}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
