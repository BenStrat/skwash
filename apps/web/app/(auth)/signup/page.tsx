import Link from 'next/link';
import { AuthForm } from '@/components/layout/auth-form';
import { signupAction } from '../actions';

export default function SignupPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4">
      <div className="w-full space-y-4 rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Create your Skwash account</h1>
        <AuthForm action={signupAction} submitLabel="Send signup link" />
        <p className="text-sm text-zinc-600">
          Already have an account? <Link href="/login" className="underline">Log in</Link>
        </p>
      </div>
    </main>
  );
}
