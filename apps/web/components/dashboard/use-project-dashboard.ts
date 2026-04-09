'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import {
  normalizeProjectUrl,
  suggestProjectName,
  type ProjectListItem
} from '@/lib/projects';
import {
  sortActiveProjects,
  sortProjects,
  type ActiveProjectSort
} from '@/components/dashboard/project-dashboard.utils';

export type ComposerState =
  | {
    mode: 'create';
    project: null;
    name: string;
    baseUrl: string;
  }
  | {
    mode: 'edit';
    project: ProjectListItem;
    name: string;
    baseUrl: string;
  };

type ProjectApiResponse = {
  project: ProjectListItem & {
    review_items?: Array<{
      id: string;
      url: string;
      title: string;
    }>;
  };
};

export function useProjectDashboard(initialProjects: ProjectListItem[]) {
  const router = useRouter();
  const [projects, setProjects] = useState(() => sortProjects(initialProjects));
  const [draftUrl, setDraftUrl] = useState('');
  const [composer, setComposer] = useState<ComposerState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [activeProjectSort, setActiveProjectSort] = useState<ActiveProjectSort>('recent-desc');

  const activeProjects = sortActiveProjects(
    projects.filter((project) => project.status === 'active'),
    activeProjectSort
  );
  const archivedProjects = projects.filter((project) => project.status === 'archived');

  function upsertProject(nextProject: ProjectListItem) {
    setProjects((currentProjects) =>
      sortProjects([...currentProjects.filter((project) => project.id !== nextProject.id), nextProject])
    );
  }

  function openCreateComposer() {
    try {
      const normalizedUrl = normalizeProjectUrl(draftUrl);

      setComposer({
        mode: 'create',
        project: null,
        name: suggestProjectName(normalizedUrl),
        baseUrl: normalizedUrl
      });
      setError(null);
    } catch (composeError) {
      setError(composeError instanceof Error ? composeError.message : 'Enter a valid URL.');
    }
  }

  function openEditComposer(project: ProjectListItem) {
    setComposer({
      mode: 'edit',
      project,
      name: project.name,
      baseUrl: project.base_url
    });
    setError(null);
  }

  function closeComposer() {
    setComposer(null);
  }

  function updateComposerName(name: string) {
    setComposer((currentComposer) =>
      currentComposer ? { ...currentComposer, name } : currentComposer
    );
  }

  function updateComposerBaseUrl(baseUrl: string) {
    setComposer((currentComposer) =>
      currentComposer ? { ...currentComposer, baseUrl } : currentComposer
    );
  }

  function handleCreateSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    openCreateComposer();
  }

  function handleComposerSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!composer) {
      return;
    }

    let normalizedUrl: string;

    try {
      normalizedUrl = normalizeProjectUrl(composer.baseUrl);
    } catch (composeError) {
      setError(composeError instanceof Error ? composeError.message : 'Enter a valid URL.');
      return;
    }

    const payload = {
      name: composer.name.trim(),
      base_url: normalizedUrl
    };

    if (!payload.name) {
      setError('Project name is required.');
      return;
    }

    setError(null);

    startTransition(async () => {
      const endpoint = composer.mode === 'create' ? '/api/projects' : `/api/projects/${composer.project.id}`;
      const method = composer.mode === 'create' ? 'POST' : 'PATCH';
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = (await response.json().catch(() => null)) as ProjectApiResponse | { error: string } | null;

      if (!response.ok || !data || !('project' in data)) {
        setError(data && 'error' in data ? data.error : 'Unable to save project.');
        return;
      }

      upsertProject(data.project);
      setComposer(null);

      if (composer.mode === 'create') {
        setDraftUrl('');
        router.push(`/projects/${data.project.id}`);
      } else {
        router.refresh();
      }
    });
  }

  function handleArchive(project: ProjectListItem) {
    const nextStatus = project.status === 'active' ? 'archived' : 'active';
    setError(null);

    startTransition(async () => {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });

      const data = (await response.json().catch(() => null)) as ProjectApiResponse | { error: string } | null;

      if (!response.ok || !data || !('project' in data)) {
        setError(data && 'error' in data ? data.error : 'Unable to update project status.');
        return;
      }

      upsertProject(data.project);
    });
  }

  function handleDelete(project: ProjectListItem) {
    if (!window.confirm(`Delete "${project.name}"? This will remove the project and its review URL.`)) {
      return;
    }

    setError(null);

    startTransition(async () => {
      const response = await fetch(`/api/projects/${project.id}`, { method: 'DELETE' });
      const data = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        setError(data?.error ?? 'Unable to delete project.');
        return;
      }

      setProjects((currentProjects) => currentProjects.filter((currentProject) => currentProject.id !== project.id));
    });
  }

  return {
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
  };
}
