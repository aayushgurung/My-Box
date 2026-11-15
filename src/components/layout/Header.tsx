import { useEffect, useState } from 'react';
import { LockKeyhole, Menu, X } from 'lucide-react';
import Brand from '../ui/Brand';
import { publicLinks } from '../../data/navigation';
export default function Header() {
  const [open, setOpen] = useState(false);
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  useEffect(() => { if (!open) return; const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); }; window.addEventListener('keydown', close); return () => window.removeEventListener('keydown', close); }, [open]);
  return <header className="public-header"><Brand /><button className="public-menu-toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="public-navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button><nav id="public-navigation" className={`public-navigation ${open ? 'is-open' : ''}`} aria-label="Main navigation">{publicLinks.map(link => <a href={link.href} key={link.href} aria-current={path === link.href ? 'page' : undefined}>{link.label}</a>)}<a href="/admin/login" className="public-mobile-admin"><LockKeyhole size={15} />Admin sign in</a></nav><a className="public-admin-link" href="/admin/login"><LockKeyhole size={15} />Admin sign in</a></header>;
}
