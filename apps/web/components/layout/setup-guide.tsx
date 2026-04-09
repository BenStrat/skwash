import { requiredAppEnv } from '@/lib/env';

export function SetupGuide() {
  return (
    <div className="w-full space-y-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">Setup Required</p>
        <h1 className="text-2xl font-semibold text-zinc-950">Connect Skwash to Supabase</h1>
        <p className="text-sm leading-6 text-zinc-600">
          The app can boot without crashing now, but auth and dashboard routes stay disabled until the local env file is
          filled in.
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-zinc-900">1. Create your local env file</p>
        <pre className="overflow-x-auto rounded-xl bg-zinc-950 p-4 text-sm text-zinc-100">
          <code>cp .env.example .env.local</code>
        </pre>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-zinc-900">2. Fill in these values from Supabase</p>
        <ul className="space-y-2 text-sm text-zinc-700">
          {requiredAppEnv.map((key) => (
            <li key={key} className="rounded-lg bg-zinc-50 px-3 py-2 font-mono text-xs text-zinc-800">
              {key}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-2 text-sm text-zinc-600">
        <p>Find the project URL and publishable key in Supabase Dashboard:</p>
        <p className="font-mono text-xs break-all">Settings → API</p>
        <p className="font-mono text-xs break-all">Authentication → Providers → Email</p>
      </div>
    </div>
  );
}
