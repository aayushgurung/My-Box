import { ReactNode, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { isAdmin, signOutAdmin } from '../lib/services/auth';

export default function AdminAccess({ login, children }: { login: ReactNode; children: (email: string) => ReactNode }) {
  const [session, setSession] = useState<Session | null>();
  const [access, setAccess] = useState<'checking' | 'allowed' | 'denied' | 'error'>('checking');
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    let receivedEvent = false;
    const { data: listener } = supabase.auth.onAuthStateChange((_event, value) => {
      receivedEvent = true;
      if (active) { setAccess('checking'); setSession(value); setRetry(count => count + 1); }
    });
    void supabase.auth.getSession().then(({ data, error: authError }) => {
      if (!active || receivedEvent) return;
      if (authError) { setError('Could not restore your session. Please reload and try again.'); setAccess('error'); }
      else setSession(data.session);
    }).catch(() => { if (active) { setError('Could not connect to authentication.'); setAccess('error'); } });
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, []);
  useEffect(() => {
    let active = true;
    if (!session) return;
    setAccess('checking');
    void isAdmin(session.user.id).then(allowed => { if (active) setAccess(allowed ? 'allowed' : 'denied'); })
      .catch((cause: Error) => { if (active) { setError(cause.message); setAccess('error'); } });
    return () => { active = false; };
  }, [session, retry]);
  useEffect(() => {
    if (session !== null) return;

    const redirectToLogin = () => {
      if (window.location.pathname !== '/admin/login') {
        window.history.replaceState({}, '', '/admin/login');
      }
    };

    redirectToLogin();
    // Back/Forward can change the URL without changing the signed-out session.
    window.addEventListener('popstate', redirectToLogin);
    return () => window.removeEventListener('popstate', redirectToLogin);
  }, [session]);
  if (access === 'error' || (session && access === 'denied')) return <main className="admin-access-state"><h1>{access === 'denied' ? 'Admin access required' : 'Unable to verify access'}</h1><p role="alert">{access === 'denied' ? 'This account is signed in but is not listed in mybox_admins. Ask the project owner to grant access.' : error}</p><button className="admin-button" onClick={() => session ? setRetry(value => value + 1) : window.location.reload()}>Try again</button><button className="admin-button" onClick={() => void signOutAdmin().catch((cause: Error) => setError(cause.message))}>Sign out</button><a href="/">Back to MyBox</a></main>;
  if (session === undefined || (session && access === 'checking')) return <main className="admin-access-state" role="status">Checking admin access...</main>;
  if (!session) return login;
  return children(session.user.email || 'Administrator');
}
