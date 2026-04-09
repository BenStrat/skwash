import { ProjectDashboard } from '@/components/dashboard/project-dashboard';
import { getAppUserContext } from '@/lib/app-user';
import { listProjects } from '@/lib/projects/service';

export default async function DashboardPage() {
  const user = await getAppUserContext();
  const result = await listProjects({ sort: 'updated' });

  if ('error' in result) {
    return (
      <section className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-900 shadow-sm">
        <h1 className="text-2xl font-semibold">Dashboard unavailable</h1>
        <p className="mt-2 text-sm leading-6">{result.error}</p>
      </section>
    );
  }

  return <ProjectDashboard initialProjects={result.projects} userName={user?.displayName ?? 'Projects'} />;
}
