import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { TopBar } from '@/components/layout/top-bar';
import { hasRequiredAppEnv } from '@/lib/env';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  if (!hasRequiredAppEnv) {
    redirect('/');
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <TopBar email={user.email ?? 'Unknown user'} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
