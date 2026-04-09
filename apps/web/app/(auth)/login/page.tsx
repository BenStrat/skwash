import Link from 'next/link';
import { AuthForm } from '@/components/layout/auth-form';
import { SetupGuide } from '@/components/layout/setup-guide';
import { hasRequiredAppEnv } from '@/lib/env';
import { loginAction } from '../actions';

export default function LoginPage() {
  if (!hasRequiredAppEnv) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-2xl items-center px-4 py-12">
        <SetupGuide />
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4">
      <div className="w-full space-y-4 rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Log in to Skwash</h1>
        <AuthForm
          action={loginAction}
          pendingLabel="Logging in..."
          passwordAutoComplete="current-password"
          submitLabel="Log in"
        />
        <p className="text-sm text-zinc-600">
          Need an account? <Link href="/signup" className="underline">Sign up</Link>
        </p>
      </div>
    </main>
  );
}
