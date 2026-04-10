'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { cn } from '@skwash/ui';
import { getProjectPreviewUrl } from '@/components/dashboard/project-dashboard.utils';

type ProjectPreviewImageProps = {
  baseUrl: string;
  domain: string;
  className?: string;
};

export function ProjectPreviewImage({ baseUrl, domain, className }: ProjectPreviewImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);
  }, [baseUrl]);

  if (hasError) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-white p-6">
        <div className="flex h-full w-full items-center justify-center border border-dashed border-zinc-200 bg-zinc-50">
          <span className="text-center text-sm font-medium text-zinc-500">{domain}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full bg-zinc-100">
      <div
        className={cn(
          'pointer-events-none absolute inset-0 flex items-center justify-center bg-zinc-100 transition-opacity duration-200',
          isLoaded && 'opacity-0'
        )}
      >
        <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-500">
          <PreviewSpinner />
          <span>Loading preview</span>
        </div>
      </div>

      <Image
        alt={`${domain} preview`}
        className={cn(
          'h-full w-full object-cover object-top transition duration-300 group-hover:scale-[1.05]',
          !isLoaded && 'opacity-0',
          className
        )}
        fill
        loading="lazy"
        onError={() => setHasError(true)}
        onLoad={() => setIsLoaded(true)}
        sizes="(min-width: 1280px) 20vw, (min-width: 768px) 50vw, 100vw"
        src={getProjectPreviewUrl(baseUrl)}
      />
    </div>
  );
}

function PreviewSpinner() {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5 animate-spin"
      viewBox="0 0 24 24"
    >
      <circle
        cx="12"
        cy="12"
        fill="none"
        r="10"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="4"
      />
      <path
        d="M22 12a10 10 0 0 0-10-10"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="4"
      />
    </svg>
  );
}
