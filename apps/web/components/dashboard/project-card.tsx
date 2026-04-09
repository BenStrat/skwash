'use client';

import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@skwash/ui';
import { type ProjectListItem, getProjectDomain } from '@/lib/projects';
import { formatRelativeUpdate } from '@/components/dashboard/project-dashboard.utils';
import { ProjectPreviewImage } from '@/components/dashboard/project-preview-image';
import { ProjectCardMenu } from '@/components/dashboard/project-card-menu';

type ProjectCardProps = {
  project: ProjectListItem;
  onEdit: (project: ProjectListItem) => void;
  onArchive: (project: ProjectListItem) => void;
  onDelete: (project: ProjectListItem) => void;
  className?: string;
};

export function ProjectCard({
  project,
  onEdit,
  onArchive,
  onDelete,
  className
}: ProjectCardProps) {
  const domain = getProjectDomain(project.base_url);

  return (
    <article
      className={cn(
        'group relative overflow-hidden rounded-xl border border-zinc-200 bg-white transition-colors duration-200 hover:border-zinc-400',
        className
      )}
    >
      <div className="relative z-0">
        <div className="bg-zinc-100">
          <div className="relative aspect-[4/3] overflow-hidden bg-white shadow-[inset_0_0_0_1px_rgba(228,228,231,0.9)]">
            <ProjectPreviewImage baseUrl={project.base_url} domain={domain} />

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-zinc-950/65 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <Link
                className="pointer-events-auto inline-flex items-center gap-2 rounded-xl border border-white/80 bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                href={`/projects/${project.id}`}
              >
                <Image
                  alt=""
                  aria-hidden="true"
                  className="invert"
                  height={16}
                  src="/assets/icons/arrow-square-right.svg"
                  width={16}
                />
                <span>Open</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-200 px-4 py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-zinc-950">{domain}</h3>
              <p className="text-xs text-zinc-500">Updated {formatRelativeUpdate(project.updated_at)}</p>
            </div>

            <div className="relative z-20 shrink-0">
              <ProjectCardMenu project={project} onEdit={onEdit} onArchive={onArchive} onDelete={onDelete} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
