import Link from 'next/link';
import { AuthForm } from '@/components/layout/auth-form';
import { SetupGuide } from '@/components/layout/setup-guide';
import { hasRequiredAppEnv } from '@/lib/env';
import { signupAction } from '../actions';

export default function SignupPage() {
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
        <h1 className="text-2xl font-semibold">Create your Skwash account</h1>
        <AuthForm
          action={signupAction}
          pendingLabel="Creating account..."
          passwordAutoComplete="new-password"
          submitLabel="Create account"
        />
        <p className="text-sm text-zinc-600">
          Already have an account? <Link href="/login" className="underline">Log in</Link>
        </p>
      </div>
    </main>
  );
}
