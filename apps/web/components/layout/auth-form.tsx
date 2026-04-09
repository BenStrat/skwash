'use client';

import { useActionState } from 'react';
import { Button, Input } from '@skwash/ui';

type Result = { error?: string; success?: boolean };

export function AuthForm({
  action,
  submitLabel
}: {
  action: (formData: FormData) => Promise<Result>;
  submitLabel: string;
}) {
  const [state, formAction, isPending] = useActionState<Result, FormData>(action, {});

  return (
    <form className="space-y-3" action={formAction}>
      <Input type="email" name="email" placeholder="you@company.com" required />
      <Button className="w-full" disabled={isPending} type="submit">
        {isPending ? 'Sending...' : submitLabel}
      </Button>
      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-emerald-700">Check your inbox for a secure login link.</p> : null}
    </form>
  );
}
