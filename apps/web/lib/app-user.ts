import 'server-only';

import { cache } from 'react';
import type { Database } from '@skwash/db';
import { getAppSetupError } from '@/lib/app-setup';
import { bootstrapUser } from '@/lib/bootstrap-user';
import { createClient } from '@/lib/supabase/server';

type UserRow = Database['public']['Tables']['users']['Row'];
type OrganisationRow = Database['public']['Tables']['organisations']['Row'];

export type AppUserContext = {
  userId: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  role: UserRow['role'];
  orgId: string;
  orgName: string;
};

export class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized');
  }
}

export const getAppUserContext = cache(async (): Promise<AppUserContext | null> => {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return null;
  }

  let profile = await loadUserProfile(user.id);

  if (!profile) {
    const bootstrapResult = await bootstrapUser();

    if ('error' in bootstrapResult) {
      throw getAppSetupError(bootstrapResult.error) ?? new Error(bootstrapResult.error);
    }

    profile = await loadUserProfile(user.id);
  }

  if (!profile?.org_id) {
    throw new Error('Your workspace is missing an organisation. Please sign out and sign back in.');
  }

  const org = await loadOrganisation(profile.org_id);

  return {
    userId: user.id,
    email: user.email ?? '',
    displayName: profile.display_name || user.email?.split('@')[0] || 'Workspace member',
    avatarUrl: profile.avatar_url,
    role: profile.role,
    orgId: profile.org_id,
    orgName: org?.name ?? 'Workspace'
  };
});

export async function requireAppUserContext() {
  const context = await getAppUserContext();

  if (!context) {
    throw new UnauthorizedError();
  }

  return context;
}

export function isUnauthorizedError(error: unknown): error is UnauthorizedError {
  return error instanceof UnauthorizedError;
}

async function loadUserProfile(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('users')
    .select('id, org_id, display_name, avatar_url, role')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    throw getAppSetupError(error) ?? new Error(error.message);
  }

  return (data as Pick<UserRow, 'id' | 'org_id' | 'display_name' | 'avatar_url' | 'role'> | null) ?? null;
}

async function loadOrganisation(orgId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('organisations')
    .select('id, name, slug')
    .eq('id', orgId)
    .maybeSingle();

  if (error) {
    throw getAppSetupError(error) ?? new Error(error.message);
  }

  return (data as Pick<OrganisationRow, 'id' | 'name' | 'slug'> | null) ?? null;
}
