import { Facebook, LockKeyhole } from 'lucide-react';
import Brand from '../ui/Brand';
import { facebookGroupUrl, publicLinks } from '../../data/navigation';
export default function Footer() {
  return <footer className="public-footer"><div><Brand /><p>Local delivery.<br />Connected communities.</p></div><nav aria-label="Footer navigation">{publicLinks.map(link => <a href={link.href} key={link.href}>{link.label}</a>)}</nav><div className="public-footer-note"><a href={facebookGroupUrl} target="_blank" rel="noreferrer"><Facebook size={15} />Find us on Facebook<span className="public-sr-only"> (opens in a new tab)</span></a><a href="/admin/login"><LockKeyhole size={14} />Admin portal</a><span>&copy; {new Date().getFullYear()} MyBox</span></div></footer>;
}
