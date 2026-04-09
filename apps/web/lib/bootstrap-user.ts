import { createClient } from '@/lib/supabase/server';
import { getAppSetupError } from '@/lib/app-setup';
import type { Database } from '@skwash/db';

type OrganisationInsert = Database['public']['Tables']['organisations']['Insert'];
type OrganisationRow = Database['public']['Tables']['organisations']['Row'];
type UserInsert = Database['public']['Tables']['users']['Insert'];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}

export async function bootstrapUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'Unauthorized', status: 401 as const };
  }

  const { data: existingUser, error: existingError } = await supabase
    .from('users')
    .select('id')
    .eq('id', user.id)
    .maybeSingle();

  if (existingError) {
    const setupError = getAppSetupError(existingError);
    return {
      error: setupError?.message ?? existingError.message,
      status: setupError?.status ?? 500
    };
  }

  if (existingUser) {
    return { ok: true as const };
  }

  const emailPrefix = user.email?.split('@')[0] ?? 'team';
  const baseSlug = `${slugify(emailPrefix)}-${user.id.slice(0, 8)}`;
  const orgName = `${emailPrefix}'s Workspace`;
  const organisationToInsert: OrganisationInsert = {
    name: orgName,
    slug: baseSlug
  };

  // Supabase loses the insert payload type through our SSR wrapper, so we keep
  // the row shape explicit here and cast only at the SDK boundary.
  const createOrgResult = await supabase
    .from('organisations')
    .insert(organisationToInsert as never)
    .select('id')
    .single();
  const org = createOrgResult.data as Pick<OrganisationRow, 'id'> | null;
  const orgError = createOrgResult.error;

  if (orgError || !org) {
    const setupError = getAppSetupError(orgError);
    return {
      error: setupError?.message ?? orgError?.message ?? 'Unable to create organisation',
      status: setupError?.status ?? 500
    };
  }

  const userToInsert: UserInsert = {
    id: user.id,
    org_id: org.id,
    role: 'owner',
    display_name: user.user_metadata?.display_name ?? emailPrefix
  };
  const { error: userError } = await supabase.from('users').insert(userToInsert as never);

  if (userError) {
    const setupError = getAppSetupError(userError);
    return {
      error: setupError?.message ?? userError.message,
      status: setupError?.status ?? 500
    };
  }

  return { ok: true as const };
}
