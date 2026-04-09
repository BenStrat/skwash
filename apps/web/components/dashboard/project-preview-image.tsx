'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@skwash/ui';
import { getProjectPreviewUrl } from '@/components/dashboard/project-dashboard.utils';

type ProjectPreviewImageProps = {
  baseUrl: string;
  domain: string;
  className?: string;
};

export function ProjectPreviewImage({ baseUrl, domain, className }: ProjectPreviewImageProps) {
  const [hasError, setHasError] = useState(false);

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
    <Image
      alt={`${domain} preview`}
      className={cn(
        'h-full w-full object-cover object-top transition duration-300 group-hover:scale-[1.05]',
        className
      )}
      fill
      loading="lazy"
      onError={() => setHasError(true)}
      sizes="(min-width: 1280px) 20vw, (min-width: 768px) 50vw, 100vw"
      src={getProjectPreviewUrl(baseUrl)}
    />
  );
}
