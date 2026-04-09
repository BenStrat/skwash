import * as React from 'react';
import { cn } from '../lib/cn';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(function Input(
  { className, ...props },
  ref
) {
  return (
    <input
      className={cn('h-9 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none ring-offset-white focus-visible:ring-2 focus-visible:ring-zinc-950', className)}
      ref={ref}
      {...props}
    />
  );
});
