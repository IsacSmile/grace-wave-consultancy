import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const isAdminPath =
  typeof window !== 'undefined' &&
  (window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin/'));

const AdminApp = lazy(() => import('./admin/AdminApp'));
const PublicApp = lazy(() => import('./App'));

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070D1F] flex items-center justify-center text-slate-400">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      {isAdminPath ? <AdminApp /> : <PublicApp />}
    </Suspense>
  </React.StrictMode>
);
