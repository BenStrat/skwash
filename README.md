# Skwash Phase 0

Phase 0 monorepo scaffold for auth + database + dashboard shell.

## Stack
- Turborepo monorepo
- Next.js 15 + React 19 + TypeScript strict + Tailwind CSS 4
- Supabase Auth (email magic link)
- Vercel deployment target

## Local setup
1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Copy env template:
   ```bash
   cp .env.example .env.local
   ```
3. Fill Supabase values in `.env.local`.
4. Run migrations in your Supabase project (SQL in `packages/db/migrations/001_initial.sql`).
5. Start app:
   ```bash
   pnpm dev
   ```
6. Open `http://localhost:3000` and sign up with email magic link.

## Database types workflow
Regenerate TypeScript DB types after schema updates:

```bash
pnpm --filter @skwash/db gen:types
```

## Deployment (Vercel)
- Import repository in Vercel.
- Set `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Build command is configured in `vercel.json`.
