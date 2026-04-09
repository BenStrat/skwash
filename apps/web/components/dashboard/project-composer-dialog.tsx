'use client';

import type { FormEventHandler } from 'react';
import { Button, Input } from '@skwash/ui';
import type { ComposerState } from '@/components/dashboard/use-project-dashboard';

export type ProjectComposerDialogProps = {
  composer: ComposerState | null;
  isPending?: boolean;
  onBaseUrlChange: (value: string) => void;
  onClose: () => void;
  onNameChange: (value: string) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
};

export function ProjectComposerDialog({
  composer,
  isPending = false,
  onBaseUrlChange,
  onClose,
  onNameChange,
  onSubmit
}: ProjectComposerDialogProps) {
  if (!composer) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/45 p-4">
      <div className="w-full max-w-xl rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-2xl">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
            {composer.mode === 'create' ? 'Create project' : 'Edit project'}
          </p>
          <h2 className="text-2xl font-semibold text-zinc-950">
            {composer.mode === 'create' ? 'Name the project and save the base URL.' : 'Update the project details.'}
          </h2>
          <p className="text-sm text-zinc-600">
            Phase 1 keeps one review item per project, so changing the base URL also updates the linked review item.
          </p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-800" htmlFor="project-name">
              Project name
            </label>
            <Input
              id="project-name"
              onChange={(event) => onNameChange(event.target.value)}
              value={composer.name}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-800" htmlFor="project-url">
              Base URL
            </label>
            <Input
              id="project-url"
              onChange={(event) => onBaseUrlChange(event.target.value)}
              type="url"
              value={composer.baseUrl}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button onClick={onClose} type="button" variant="ghost">
              Cancel
            </Button>
            <Button disabled={isPending} type="submit">
              {isPending ? 'Saving...' : composer.mode === 'create' ? 'Create and open canvas' : 'Save changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
