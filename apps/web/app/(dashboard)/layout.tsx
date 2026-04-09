import { redirect } from "next/navigation";
import { SetupGuide } from "@/components/layout/setup-guide";
import { isAppSetupError } from "@/lib/app-setup";
import { hasRequiredAppEnv } from "@/lib/env";
import { getAppUserContext } from "@/lib/app-user";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!hasRequiredAppEnv) {
    redirect("/");
  }

  let user;
  try {
    user = await getAppUserContext();
  } catch (error) {
    if (isAppSetupError(error)) {
      return (
        <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-4 py-12">
          <SetupGuide mode="database" />
        </main>
      );
    }

    throw error;
  }

  if (!user) {
    redirect("/login");
  }

  return children;
}
