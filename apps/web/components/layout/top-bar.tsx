import { signoutAction } from '@/app/(auth)/actions';
import { Button } from '@skwash/ui';

export function TopBar({ email }: { email: string }) {
  return (
    <header className="flex h-14 items-center justify-between border-b bg-white px-6">
      <p className="text-sm text-zinc-600">Phase 0 dashboard shell</p>
      <div className="flex items-center gap-3 text-sm">
        <span>{email}</span>
        <form action={signoutAction}>
          <Button size="sm" variant="ghost" type="submit">
            Sign out
          </Button>
        </form>
      </div>
    </header>
  );
}
