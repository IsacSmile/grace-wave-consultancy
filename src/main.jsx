import React, { lazy, Suspense, useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const AdminApp = lazy(() => import('./admin/AdminApp'));
const PublicApp = lazy(() => import('./App'));
const NotFound = lazy(() => import('./pages/NotFound'));

function RootRouter() {
  const [pathname, setPathname] = useState(
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Admin route check
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return <AdminApp />;
  }

  // Home page route check (e.g. '/' or empty)
  if (pathname === '/' || pathname === '') {
    return <PublicApp />;
  }

  // Any other route path triggers the 404 Page Not Found
  return <NotFound />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8FAFF] flex items-center justify-center text-slate-400">
          <div className="w-8 h-8 border-2 border-[#0B1B4D] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <RootRouter />
    </Suspense>
  </React.StrictMode>
);
