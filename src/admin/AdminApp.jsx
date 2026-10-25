import React, { useState, useEffect, useCallback } from 'react';
import {
  Lock,
  Eye,
  EyeOff,
  Search,
  Filter,
  RefreshCw,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  Calendar,
  AlertCircle,
  Copy,
  Check,
  MessageSquare,
  ExternalLink,
  X,
  Shield,
  TrendingUp,
  Inbox,
  Clock,
  Sparkles,
} from 'lucide-react';
import { ALLOWED_SERVICES } from '../data/serviceOptions.js';

export default function AdminApp() {
  const [authStatus, setAuthStatus] = useState('checking'); // 'checking' | 'unauthenticated' | 'authenticated'
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Enquiries state
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [counts, setCounts] = useState({ all: 0, today: 0, last7days: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [listError, setListError] = useState(null);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  // Selected item modal state
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
      setPage(1); // Reset to page 1 on new search
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Check initial session
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/admin?action=session');
        if (res.ok) {
          setAuthStatus('authenticated');
        } else {
          setAuthStatus('unauthenticated');
        }
      } catch {
        setAuthStatus('unauthenticated');
      }
    }
    checkSession();
  }, []);

  // Fetch enquiries list
  const fetchEnquiries = useCallback(async () => {
    setIsLoading(true);
    setListError(null);
    try {
      const params = new URLSearchParams({
        action: 'list',
        page: page.toString(),
        pageSize: pageSize.toString(),
        sort: sortOrder,
      });
      if (debouncedQuery) {
        params.set('q', debouncedQuery);
      }
      if (serviceFilter) {
        params.set('service', serviceFilter);
      }

      const res = await fetch(`/api/admin?${params.toString()}`);
      if (res.status === 401) {
        setAuthStatus('unauthenticated');
        return;
      }

      const data = await res.json();
      if (res.ok && data.ok) {
        setItems(data.items || []);
        setTotal(data.total || 0);
        setCounts(data.counts || { all: 0, today: 0, last7days: 0 });
      } else {
        setListError(data.error || 'Failed to load enquiries.');
      }
    } catch {
      setListError('Network connection error while fetching enquiries.');
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, debouncedQuery, serviceFilter, sortOrder]);

  // Trigger fetch when authenticated and filters change
  useEffect(() => {
    if (authStatus === 'authenticated') {
      fetchEnquiries();
    }
  }, [authStatus, fetchEnquiries]);

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginPassword.trim()) {
      setLoginError('Please enter your administrator password.');
      return;
    }

    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const res = await fetch('/api/admin?action=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: loginPassword }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setAuthStatus('authenticated');
        setLoginPassword('');
        setLoginError(null);
      } else if (res.status === 429) {
        setLoginError(data.error || 'Too many attempts. Try again later.');
      } else if (res.status === 503) {
        setLoginError(data.error || 'Admin is not configured.');
      } else {
        setLoginError(data.error || 'Incorrect password');
      }
    } catch {
      setLoginError('A network error occurred during login. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/admin?action=logout', {
        method: 'POST',
        headers: {
          'X-Requested-With': 'gw-admin',
        },
      });
    } catch {
      // Ignore network errors on logout
    }
    setAuthStatus('unauthenticated');
    setItems([]);
  };

  // Helper: Copy to clipboard
  const handleCopy = (text, fieldName) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  // Helper: Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return new Intl.DateTimeFormat('en-AE', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(d);
    } catch {
      return dateStr;
    }
  };

  // Helper: Get service badge color
  const getServiceBadgeStyle = (service) => {
    switch (service) {
      case 'Accounting & Bookkeeping':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Taxation & Compliance':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Audit & Advisory':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // Total pages
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // =========================================================================
  // RENDER: Loading Check
  // =========================================================================
  if (authStatus === 'checking') {
    return (
      <div className="min-h-screen bg-[#070D1F] flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm tracking-wider uppercase font-semibold text-slate-500">
            Verifying Authentication...
          </span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: Login Screen
  // =========================================================================
  if (authStatus === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-[#070D1F] flex items-center justify-center p-4 sm:p-6 text-slate-200">
        <div className="w-full max-w-md bg-[#0F1B38] border border-blue-900/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle Decorative Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="text-center mb-8 relative z-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600/15 border border-blue-500/30 text-blue-400 mb-4 shadow-inner">
              <Shield className="w-7 h-7" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/60 text-[11px] font-semibold text-blue-300 uppercase tracking-wider mb-2">
              <Lock className="w-3 h-3" />
              <span>Administrative Portal</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Grace Way Accounting
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Read-Only Client Enquiry Management System
            </p>
          </div>

          {/* Error Banner */}
          {loginError && (
            <div
              role="alert"
              className="mb-5 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-start gap-2.5 text-rose-300 text-xs sm:text-sm animate-fade-in"
            >
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-snug">{loginError}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4 relative z-10">
            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
              >
                Access Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="admin-password"
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                    if (loginError) setLoginError(null);
                  }}
                  placeholder="Enter administrator password"
                  autoComplete="current-password"
                  autoFocus
                  className="w-full h-12 pl-4 pr-11 rounded-xl text-sm bg-[#081024] border border-blue-900/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full h-12 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Authenticate Session</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Warning */}
          <p className="text-[11px] text-slate-500 text-center mt-6 leading-relaxed">
            Restricted access zone. Login attempts are monitored and rate-limited.
          </p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: Authenticated Dashboard
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-[#0B1B4D] text-white border-b border-blue-950 px-4 sm:px-6 lg:px-8 py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-base tracking-tight text-white">
                  Grace Way Accounting
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/20 text-blue-200 border border-blue-400/30">
                  Read-Only Viewer
                </span>
              </div>
              <p className="text-[11px] text-blue-200/70 hidden sm:block">
                UAE Commercial Enquiries Database
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchEnquiries}
              disabled={isLoading}
              title="Refresh dataset"
              className="p-2 rounded-lg bg-blue-900/60 hover:bg-blue-800 text-blue-200 transition-colors cursor-pointer border border-blue-700/50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600/20 hover:bg-rose-600/30 text-rose-200 border border-rose-500/30 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* KPI Statistics Strip */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
              <Inbox className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                Total Submissions
              </span>
              <span className="text-2xl font-heading font-black text-slate-900">
                {counts.all.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                Received Today
              </span>
              <span className="text-2xl font-heading font-black text-slate-900">
                {counts.today.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                Last 7 Days
              </span>
              <span className="text-2xl font-heading font-black text-slate-900">
                {counts.last7days.toLocaleString()}
              </span>
            </div>
          </div>
        </section>

        {/* Filters and Controls Card */}
        <section className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, phone, or message..."
              className="w-full h-11 pl-10 pr-9 rounded-xl text-sm bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Service Dropdown Filter */}
          <div className="w-full sm:w-60">
            <select
              value={serviceFilter}
              onChange={(e) => {
                setServiceFilter(e.target.value);
                setPage(1);
              }}
              className="w-full h-11 px-3.5 rounded-xl text-sm bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
            >
              <option value="">All Services</option>
              {(ALLOWED_SERVICES || []).map((svc) => (
                <option key={svc} value={svc}>
                  {svc}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Order */}
          <div className="w-full sm:w-44">
            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
                setPage(1);
              }}
              className="w-full h-11 px-3.5 rounded-xl text-sm bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </section>

        {/* Error notification */}
        {listError && (
          <div
            role="alert"
            className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold">Error loading dataset: </span>
              <span>{listError}</span>
            </div>
          </div>
        )}

        {/* Enquiries Table Card */}
        <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
          {/* Header count info */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing{' '}
              <strong className="text-slate-800">
                {total === 0 ? 0 : (page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)}
              </strong>{' '}
              of <strong className="text-slate-800">{total}</strong> total enquiries
            </span>
            <span>Page {page} of {totalPages}</span>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto min-h-[300px]">
            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mb-2" />
                <span className="text-sm">Fetching enquiries from database...</span>
              </div>
            ) : items.length === 0 ? (
              <div className="py-20 text-center text-slate-400">
                <Inbox className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <h3 className="text-base font-bold text-slate-700">No Enquiries Found</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  {debouncedQuery || serviceFilter
                    ? 'No results match the current search filters. Try clearing your search parameters.'
                    : 'There are currently no enquiries stored in the database.'}
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Service</th>
                    <th className="py-3 px-4">Message</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedEnquiry(item)}
                      className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                    >
                      {/* Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-500">
                        {formatDate(item.created_at)}
                      </td>

                      {/* Name */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-semibold text-slate-900 block group-hover:text-blue-600 transition-colors">
                          {item.name}
                        </span>
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="space-y-0.5">
                          <a
                            href={`mailto:${item.email}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs text-slate-700 hover:text-blue-600 block hover:underline"
                          >
                            {item.email}
                          </a>
                          <a
                            href={`tel:${item.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs text-slate-500 hover:text-blue-600 block font-mono"
                          >
                            {item.phone}
                          </a>
                        </div>
                      </td>

                      {/* Service */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getServiceBadgeStyle(
                            item.service
                          )}`}
                        >
                          {item.service}
                        </span>
                      </td>

                      {/* Message preview */}
                      <td className="py-3.5 px-4 max-w-xs truncate text-xs text-slate-600">
                        {item.message}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEnquiry(item);
                          }}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <span className="text-xs text-slate-500 font-medium">
                Page {page} of {totalPages}
              </span>

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </section>
      </main>

      {/* ========================================================================= */}
      {/* Detail Modal / Drawer                                                    */}
      {/* ========================================================================= */}
      {selectedEnquiry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setSelectedEnquiry(null)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Enquiry ID #{selectedEnquiry.id} • {formatDate(selectedEnquiry.created_at)}
                </span>
                <h3 className="font-heading font-extrabold text-2xl text-slate-900">
                  {selectedEnquiry.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-5">
              {/* Service Requested */}
              <div>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Requested Service
                </span>
                <span
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border ${getServiceBadgeStyle(
                    selectedEnquiry.service
                  )}`}
                >
                  {selectedEnquiry.service}
                </span>
              </div>

              {/* Contact Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email Box */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div className="min-w-0 flex-1 mr-2">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Email</span>
                    <a
                      href={`mailto:${selectedEnquiry.email}`}
                      className="text-sm font-semibold text-blue-600 hover:underline truncate block"
                    >
                      {selectedEnquiry.email}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(selectedEnquiry.email, 'email')}
                    title="Copy Email"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition-colors shrink-0"
                  >
                    {copiedField === 'email' ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Phone Box */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div className="min-w-0 flex-1 mr-2">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Telephone</span>
                    <a
                      href={`tel:${selectedEnquiry.phone}`}
                      className="text-sm font-semibold text-blue-600 hover:underline truncate block font-mono"
                    >
                      {selectedEnquiry.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <a
                      href={`https://wa.me/${selectedEnquiry.phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open WhatsApp"
                      className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopy(selectedEnquiry.phone, 'phone')}
                      title="Copy Phone"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
                    >
                      {copiedField === 'phone' ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Verbatim Message */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Full Enquiry Message
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(selectedEnquiry.message, 'message')}
                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
                  >
                    {copiedField === 'message' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Message</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto font-sans">
                  {selectedEnquiry.message}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
