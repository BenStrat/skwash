import { createClient } from '@/lib/supabase/server';

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
    return { error: existingError.message, status: 500 as const };
  }

  if (existingUser) {
    return { ok: true as const };
  }

  const emailPrefix = user.email?.split('@')[0] ?? 'team';
  const baseSlug = `${slugify(emailPrefix)}-${user.id.slice(0, 8)}`;
  const orgName = `${emailPrefix}'s Workspace`;

  const { data: org, error: orgError } = await supabase
    .from('organisations')
    .insert({ name: orgName, slug: baseSlug })
    .select('id')
    .single();

  if (orgError || !org) {
    return { error: orgError?.message ?? 'Unable to create organisation', status: 500 as const };
  }

  const { error: userError } = await supabase.from('users').insert({
    id: user.id,
    org_id: org.id,
    role: 'owner',
    display_name: user.user_metadata?.display_name ?? emailPrefix
  });

  if (userError) {
    return { error: userError.message, status: 500 as const };
  }

  return { ok: true as const };
}
