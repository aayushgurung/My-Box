import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
export default function PublicLayout({ children }: { children: ReactNode }) {
  return <div className="app-shell public-site"><a className="public-skip" href="#main-content">Skip to content</a><Header /><main id="main-content">{children}</main><Footer /></div>;
}
