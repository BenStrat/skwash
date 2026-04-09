import { redirect } from 'next/navigation';
import { SetupGuide } from '@/components/layout/setup-guide';
import { hasRequiredAppEnv } from '@/lib/env';

export default function HomePage() {
  if (!hasRequiredAppEnv) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-2xl items-center px-4 py-12">
        <SetupGuide />
      </main>
    );
  }

  redirect('/dashboard');
}
