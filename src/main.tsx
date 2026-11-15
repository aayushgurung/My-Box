import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import AdminApp from './admin/AdminApp';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin/') ? <AdminApp /> : <App />}
  </StrictMode>
);

