import Link from 'next/link';
import { AuthForm } from '@/components/layout/auth-form';
import { loginAction } from '../actions';

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4">
      <div className="w-full space-y-4 rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Log in to Skwash</h1>
        <AuthForm action={loginAction} submitLabel="Send magic link" />
        <p className="text-sm text-zinc-600">
          Need an account? <Link href="/signup" className="underline">Sign up</Link>
        </p>
      </div>
    </main>
  );
}
