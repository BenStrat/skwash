import Link from 'next/link';

export function Sidebar() {
  return (
    <aside className="flex w-64 flex-col border-r bg-white p-4">
      <div className="mb-6 text-lg font-semibold">Skwash</div>
      <nav className="space-y-2">
        <Link className="block rounded-md px-3 py-2 text-sm hover:bg-zinc-100" href="/dashboard">
          Dashboard
        </Link>
        <Link className="block rounded-md px-3 py-2 text-sm hover:bg-zinc-100" href="/settings">
          Settings
        </Link>
      </nav>
    </aside>
  );
}
