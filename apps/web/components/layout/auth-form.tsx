'use client';

import { useActionState, type InputHTMLAttributes } from 'react';
import { Button, Input } from '@skwash/ui';

type Result = { error?: string; message?: string };

export function AuthForm({
  action,
  pendingLabel,
  submitLabel,
  passwordAutoComplete
}: {
  action: (formData: FormData) => Promise<Result>;
  pendingLabel: string;
  submitLabel: string;
  passwordAutoComplete: InputHTMLAttributes<HTMLInputElement>['autoComplete'];
}) {
  const [state, formAction, isPending] = useActionState<Result, FormData>(
    (_state, formData) => action(formData),
    {}
  );

  return (
    <form className="space-y-3" action={formAction}>
      <Input autoComplete="email" type="email" name="email" placeholder="you@company.com" required />
      <Input
        autoComplete={passwordAutoComplete}
        type="password"
        name="password"
        placeholder="Password"
        required
      />
      <Button className="w-full" disabled={isPending} type="submit">
        {isPending ? pendingLabel : submitLabel}
      </Button>
      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      {state.message ? <p className="text-sm text-emerald-700">{state.message}</p> : null}
    </form>
  );
}
