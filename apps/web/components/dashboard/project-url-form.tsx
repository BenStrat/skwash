'use client';

import type { FormEventHandler } from 'react';
import { Button, Input } from '@skwash/ui';

export type ProjectUrlFormProps = {
  draftUrl: string;
  isPending?: boolean;
  onDraftUrlChange: (value: string) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
};

export function ProjectUrlForm({
  draftUrl,
  isPending = false,
  onDraftUrlChange,
  onSubmit
}: ProjectUrlFormProps) {
  return (
    <div>
      <div className="px-6 py-4 sm:px-8 sm:py-5">
        <div className="space-y-4">
          <form
            className="flex w-full max-w-[25rem] items-center gap-2 rounded-[1.1rem] border border-zinc-300 bg-white p-1.5"
            onSubmit={onSubmit}
          >
            <Input
              className="h-10 flex-1 rounded-[0.85rem] border-0 bg-transparent px-3.5 py-0 text-sm font-normal text-zinc-700 placeholder:text-zinc-500 focus-visible:ring-0"
              name="base-url"
              onChange={(event) => onDraftUrlChange(event.target.value)}
              placeholder="Enter a URL here"
              type="url"
              value={draftUrl}
            />
            <Button
              className="h-10 shrink-0 rounded-[0.85rem] bg-[#2a00ff] px-4 text-sm font-medium text-white shadow-none hover:bg-[#2200db] focus-visible:ring-[#2a00ff]"
              disabled={isPending}
              type="submit"
              variant="default"
            >
              Go
            </Button>
          </form>
        </div>
      </div>

      <div className="border-t border-zinc-200" />
    </div>
  );
}
