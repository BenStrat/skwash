'use client';

import { useEffect, useRef } from 'react';

type ProjectSearchControlProps = {
  isOpen: boolean;
  query: string;
  onChange: (value: string) => void;
  onOpen: () => void;
  onClose: () => void;
  onClear: () => void;
};

export function ProjectSearchControl({
  isOpen,
  query,
  onChange,
  onOpen,
  onClose,
  onClear
}: ProjectSearchControlProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isExpanded = isOpen || query.trim().length > 0;

  useEffect(() => {
    if (!isExpanded) {
      return;
    }

    inputRef.current?.focus();
  }, [isExpanded]);

  if (!isExpanded) {
    return (
      <button
        aria-label="Search projects"
        className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-zinc-600 outline-none transition-colors hover:bg-zinc-100 hover:text-zinc-950 focus-visible:ring-2 focus-visible:ring-zinc-300"
        onClick={onOpen}
        type="button"
      >
        <SearchIcon />
      </button>
    );
  }

  return (
    <div className="relative h-8 w-[12rem]">
      <SearchIcon className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-zinc-400" />
      <input
        className="h-full w-full rounded-xl border border-zinc-200 bg-white pl-8 pr-8 text-sm text-zinc-700 outline-none placeholder:text-zinc-400 focus-visible:ring-2 focus-visible:ring-zinc-300"
        onBlur={() => {
          if (!query.trim()) {
            onClose();
          }
        }}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            if (query.trim()) {
              onClear();
            } else {
              onClose();
            }
          }
        }}
        placeholder="Search"
        ref={inputRef}
        type="text"
        value={query}
      />
      {query.trim() ? (
        <button
          aria-label="Clear search"
          className="absolute right-1 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-zinc-400 outline-none transition-colors hover:bg-zinc-100 hover:text-zinc-700 focus-visible:ring-2 focus-visible:ring-zinc-300"
          onMouseDown={(event) => event.preventDefault()}
          onClick={onClear}
          type="button"
        >
          <ClearIcon />
        </button>
      ) : null}
    </div>
  );
}

function SearchIcon({ className = 'text-zinc-600' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={`h-4 w-4 shrink-0 ${className}`}
      viewBox="0 0 256 256"
    >
      <path
        d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5 shrink-0"
      viewBox="0 0 256 256"
    >
      <path
        d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66A8,8,0,0,1,50.34,194.34L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"
        fill="currentColor"
      />
    </svg>
  );
}
