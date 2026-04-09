import { requireAppUserContext } from "@/lib/app-user";

export default async function ProfilePage() {
  const user = await requireAppUserContext();

  return (
    <div className="grid gap-6">
      <section className="rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-zinc-500">
          Your profile
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">
          {user.displayName}
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Manage the basics of your account while the broader settings
          experience is still coming together.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-[1.75rem] border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-zinc-500">
            Account
          </p>
          <dl className="mt-5 space-y-4">
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                Email
              </dt>
              <dd className="mt-1 text-sm font-medium text-zinc-950">
                {user.email}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                Role
              </dt>
              <dd className="mt-1 text-sm font-medium capitalize text-zinc-950">
                {user.role}
              </dd>
            </div>
          </dl>
        </article>

        <article className="rounded-[1.75rem] border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-zinc-500">
            Workspace
          </p>
          <dl className="mt-5 space-y-4">
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                Organisation
              </dt>
              <dd className="mt-1 text-sm font-medium text-zinc-950">
                {user.orgName}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                Workspace ID
              </dt>
              <dd className="mt-1 break-all text-sm font-medium text-zinc-950">
                {user.orgId}
              </dd>
            </div>
          </dl>
        </article>
      </section>
    </div>
  );
}
