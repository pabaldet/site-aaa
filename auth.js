import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://iqeqepfxocqyjkbpfxzd.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_fYepwqnoeKTagucEtoM7xQ_fmd2RCC_';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function requireAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = 'login.html';
    return null;
  }
  return session.user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  if (!user) return;
  const { data: profil } = await supabase.from('profils').select('role').eq('id', user.id).single();
  if (profil?.role !== 'admin') {
    window.location.href = 'membre.html';
  }
  return user;
}
