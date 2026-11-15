import { useEffect } from 'react';
import PublicLayout from './components/layout/PublicLayout';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import DriverPage from './pages/DriverPage';
import FranchisePage from './pages/FranchisePage';
import NotFoundPage from './pages/NotFoundPage';
import './styles/public.css';
const pages = {
  '/': { component: HomePage, title: 'Local delivery, made simple' },
  '/shop': { component: ShopPage, title: 'Parcel boxes & delivery tickets' },
  '/drivers': { component: DriverPage, title: 'Drive with MyBox' },
  '/franchise': { component: FranchisePage, title: 'Become a MyBox partner' },
};
export default function App() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const page = pages[path as keyof typeof pages];
  const Page = page?.component || NotFoundPage;
  useEffect(() => { document.title = `${page?.title || 'Page not found'} | MyBox`; }, [page]);
  return <PublicLayout><Page /></PublicLayout>;
}
