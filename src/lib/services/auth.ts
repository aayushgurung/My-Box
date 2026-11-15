import { supabase } from '../supabase';

export async function isAdmin(userId: string) {
  const { data, error } = await supabase.from('mybox_admins').select('user_id').eq('user_id', userId).maybeSingle();
  if (error) throw new Error('Unable to verify admin access. Check the database setup and connection.');
  return Boolean(data);
}

export async function signInAdmin(email: string, password: string) {
  console.log('[MyBox Supabase] admin login request', {
    email,
    password: password ? '[redacted]' : '[empty]',
  });
  const response = await supabase.auth.signInWithPassword({ email, password });
  
  const { data, error } = response;
  if (error) throw new Error('Sign-in failed. Check your email and password and try again.');
  if (!data.user) throw new Error('Sign-in did not return a user. Please try again.');
  return data.user;
}

export async function signOutAdmin() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error('Could not sign out. Please try again.');
}
