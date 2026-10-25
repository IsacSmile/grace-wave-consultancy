import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Eye,
  EyeOff,
  Search,
  RefreshCw,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  Copy,
  Check,
  ExternalLink,
  X,
  ArrowRight,
  Inbox,
  Trash2,
  AlertTriangle,
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

  // Multi-select & Deletion state
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null); // null | { type: 'single'|'bulk', ids: number[], label?: string, count?: number }
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Ref for indeterminate state on select-all checkbox
  const selectAllCheckboxRef = useRef(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
      setPage(1);
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

  // Toast helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Selection helpers
  const pageIds = items.map((it) => it.id);
  const isAllOnPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));
  const isSomeOnPageSelected = pageIds.some((id) => selectedIds.includes(id)) && !isAllOnPageSelected;

  // Sync indeterminate DOM property
  useEffect(() => {
    if (selectAllCheckboxRef.current) {
      selectAllCheckboxRef.current.indeterminate = isSomeOnPageSelected;
    }
  }, [isSomeOnPageSelected]);

  const toggleSelectAllOnPage = () => {
    if (isAllOnPageSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const toggleSelectItem = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  // Delete Prompt Handlers
  const promptDeleteSingle = (item) => {
    setDeleteError(null);
    setDeleteTarget({
      type: 'single',
      ids: [item.id],
      label: item.name,
      count: 1,
    });
  };

  const promptDeleteBulk = (ids) => {
    if (!ids || ids.length === 0) return;
    setDeleteError(null);
    setDeleteTarget({
      type: 'bulk',
      ids: [...ids],
      count: ids.length,
    });
  };

  // Execute Deletion
  const executeDelete = async () => {
    if (!deleteTarget || !deleteTarget.ids.length) return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const res = await fetch('/api/admin?action=delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'gw-admin',
        },
        body: JSON.stringify({ ids: deleteTarget.ids }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        const deletedSet = new Set(deleteTarget.ids.map(Number));

        // Unselect deleted IDs
        setSelectedIds((prev) => prev.filter((id) => !deletedSet.has(Number(id))));

        // Close detail modal if deleted item was open
        if (selectedEnquiry && deletedSet.has(Number(selectedEnquiry.id))) {
          setSelectedEnquiry(null);
        }

        const count = data.deletedCount || deleteTarget.ids.length;
        showToast(`Successfully deleted ${count} ${count === 1 ? 'enquiry' : 'enquiries'}.`);
        setDeleteTarget(null);

        // Refresh data
        await fetchEnquiries();
      } else {
        setDeleteError(data.error || 'Failed to delete selected enquiry.');
      }
    } catch {
      setDeleteError('Network error while deleting enquiry. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginPassword.trim()) {
      setLoginError('Please enter your password.');
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
      setLoginError('Network error. Please try again.');
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
      // Ignore
    }
    setAuthStatus('unauthenticated');
    setItems([]);
    setSelectedIds([]);
  };

  // Helper: Copy to clipboard
  const handleCopy = (text, fieldName) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 1800);
    }
  };

  // Helper: Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return new Intl.DateTimeFormat('en-AE', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(d);
    } catch {
      return dateStr;
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // =========================================================================
  // RENDER: Loading Check
  // =========================================================================
  if (authStatus === 'checking') {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // =========================================================================
  // RENDER: Minimal Login Screen
  // =========================================================================
  if (authStatus === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans flex flex-col items-center justify-center p-4 antialiased selection:bg-slate-200">
        <div className="w-full max-w-[360px] animate-fade-in">
          {/* Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-7 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs tracking-wider mx-auto mb-4 shadow-xs">
                GW
              </div>
              <h1 className="font-heading font-semibold text-lg text-slate-900 tracking-tight">
                Grace Way Admin
              </h1>
              <p className="text-xs text-slate-500 mt-1 font-normal">
                Enquiry management portal
              </p>
            </div>

            {/* Error Notification */}
            {loginError && (
              <div
                role="alert"
                className="mb-4 p-3 rounded-xl bg-rose-50/80 border border-rose-200/60 text-rose-700 text-xs leading-relaxed animate-fade-in text-center"
              >
                {loginError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label htmlFor="admin-password" className="sr-only">
                  Password
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
                    placeholder="Enter password"
                    autoComplete="current-password"
                    autoFocus
                    className="w-full h-11 pl-3.5 pr-10 rounded-xl text-sm bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full h-11 rounded-xl text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoggingIn ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Subtext */}
          <p className="text-[11px] text-slate-400 text-center mt-5">
            Protected administrative area
          </p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: Clean Minimal Dashboard
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans flex flex-col antialiased selection:bg-slate-200 relative pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-medium flex items-center gap-2 animate-fade-in border border-slate-800"
        >
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </aside>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-20 bg-white border-b border-slate-200/70 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Brand + View Indicator */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-[11px] tracking-wider shrink-0">
              GW
            </div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-semibold text-sm text-slate-900 tracking-tight">
                Grace Way
              </span>
              <span className="text-slate-300">/</span>
              <span className="text-xs text-slate-500 font-normal">
                Enquiries
              </span>
              <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
                Portal
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={fetchEnquiries}
              disabled={isLoading}
              title="Refresh"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        {/* Metric Badges Strip (Minimalist) */}
        <section className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200/70 text-xs shadow-2xs">
            <span className="text-slate-400">Total</span>
            <span className="font-semibold text-slate-900">{counts.all}</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200/70 text-xs shadow-2xs">
            <span className="text-slate-400">Today</span>
            <span className="font-semibold text-slate-900">{counts.today}</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200/70 text-xs shadow-2xs">
            <span className="text-slate-400">Past 7 days</span>
            <span className="font-semibold text-slate-900">{counts.last7days}</span>
          </div>
        </section>

        {/* Filter & Search Bar */}
        <section className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search enquiries..."
              className="w-full h-9 pl-9 pr-8 rounded-xl text-xs bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Service Dropdown */}
          <div className="w-full sm:w-56">
            <select
              value={serviceFilter}
              onChange={(e) => {
                setServiceFilter(e.target.value);
                setPage(1);
              }}
              className="w-full h-9 px-3 rounded-xl text-xs bg-white border border-slate-200 text-slate-700 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors cursor-pointer shadow-2xs"
            >
              <option value="">All Services</option>
              {(ALLOWED_SERVICES || []).map((svc) => (
                <option key={svc} value={svc}>
                  {svc}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="w-full sm:w-36">
            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
                setPage(1);
              }}
              className="w-full h-9 px-3 rounded-xl text-xs bg-white border border-slate-200 text-slate-700 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors cursor-pointer shadow-2xs"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>
        </section>

        {/* Error notification */}
        {listError && (
          <div
            role="alert"
            className="p-3 rounded-xl bg-rose-50/80 border border-rose-200/60 text-rose-700 text-xs"
          >
            {listError}
          </div>
        )}

        {/* Table Card */}
        <section className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col">
          {/* Table Container */}
          <div className="overflow-x-auto min-h-[320px]">
            {isLoading ? (
              <div className="py-24 flex flex-col items-center justify-center text-slate-400">
                <RefreshCw className="w-5 h-5 animate-spin text-slate-900 mb-2" />
                <span className="text-xs">Loading enquiries...</span>
              </div>
            ) : items.length === 0 ? (
              <div className="py-24 text-center text-slate-400">
                <Inbox className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs text-slate-500 font-medium">No enquiries found</p>
                {(debouncedQuery || serviceFilter) && (
                  <p className="text-[11px] text-slate-400 mt-1">
                    Try clearing search or filter terms
                  </p>
                )}
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-medium text-slate-400 bg-slate-50/50">
                    {/* Checkbox column */}
                    <th className="w-10 py-3 px-3 text-center">
                      <input
                        ref={selectAllCheckboxRef}
                        type="checkbox"
                        checked={isAllOnPageSelected}
                        onChange={toggleSelectAllOnPage}
                        className="w-4 h-4 accent-slate-900 rounded cursor-pointer"
                        aria-label="Select all enquiries on this page"
                      />
                    </th>

                    {/* Serial Number # */}
                    <th className="w-12 py-3 px-3 text-center font-medium">
                      #
                    </th>

                    <th className="py-3 px-4 font-medium">Date</th>
                    <th className="py-3 px-4 font-medium">Client</th>
                    <th className="py-3 px-4 font-medium">Contact</th>
                    <th className="py-3 px-4 font-medium">Service</th>
                    <th className="py-3 px-4 font-medium">Message</th>
                    <th className="py-3 px-4 text-right font-medium w-28">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/70">
                  {items.map((item, index) => {
                    const isSelected = selectedIds.includes(item.id);
                    const rowNumber = (page - 1) * pageSize + index + 1;

                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedEnquiry(item)}
                        className={`hover:bg-slate-50/80 transition-colors cursor-pointer group ${
                          isSelected ? 'bg-slate-50/90' : ''
                        }`}
                      >
                        {/* Select Checkbox */}
                        <td
                          className="py-3.5 px-3 text-center whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectItem(item.id)}
                            className="w-4 h-4 accent-slate-900 rounded cursor-pointer"
                            aria-label={`Select enquiry #${rowNumber} from ${item.name}`}
                          />
                        </td>

                        {/* Serial Number */}
                        <td className="py-3.5 px-3 text-center whitespace-nowrap text-[11px] font-mono text-slate-400 select-none">
                          {rowNumber}
                        </td>

                        {/* Date */}
                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-400 text-[11px]">
                          {formatDate(item.created_at)}
                        </td>

                        {/* Name */}
                        <td className="py-3.5 px-4 whitespace-nowrap font-medium text-slate-900">
                          {item.name}
                        </td>

                        {/* Contact Info */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="space-y-0.5">
                            <a
                              href={`mailto:${item.email}`}
                              onClick={(e) => e.stopPropagation()}
                              className="text-slate-600 hover:text-slate-900 block"
                            >
                              {item.email}
                            </a>
                            <span className="text-[11px] text-slate-400 block font-mono">
                              {item.phone}
                            </span>
                          </div>
                        </td>

                        {/* Service Badge */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
                            {item.service}
                          </span>
                        </td>

                        {/* Message Preview */}
                        <td className="py-3.5 px-4 max-w-xs truncate text-slate-500">
                          {item.message}
                        </td>

                        {/* Row Actions: View and Delete */}
                        <td
                          className="py-3.5 px-4 text-right whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => setSelectedEnquiry(item)}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors text-[11px] font-medium cursor-pointer"
                            >
                              <span>View</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => promptDeleteSingle(item)}
                              className="p-1 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title={`Delete enquiry from ${item.name}`}
                              aria-label={`Delete enquiry from ${item.name}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Minimal Pagination Bar */}
          <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>
              {total === 0 ? '0' : `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, total)}`}{' '}
              of {total}
            </span>

            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  title="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[11px]">
                  {page} / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  title="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* ========================================================================= */}
      {/* Floating Bulk Action Bar (when selectedIds.length > 0)                    */}
      {/* ========================================================================= */}
      {selectedIds.length > 0 && (
        <aside
          aria-label="Selection actions"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-3 animate-fade-in border border-slate-800"
        >
          <div className="flex items-center gap-2 pr-3 border-r border-slate-700/80">
            <span className="w-5 h-5 rounded-full bg-white/20 text-white text-[11px] font-bold flex items-center justify-center">
              {selectedIds.length}
            </span>
            <span className="text-xs font-medium">
              {selectedIds.length === 1 ? 'selected' : 'selected'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => promptDeleteBulk(selectedIds)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-rose-600 hover:bg-rose-500 text-white transition-colors cursor-pointer shadow-xs active:scale-[0.98]"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Selected</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedIds([])}
            className="px-2.5 py-1.5 rounded-xl text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            Clear
          </button>
        </aside>
      )}

      {/* ========================================================================= */}
      {/* Clean Detail Modal                                                        */}
      {/* ========================================================================= */}
      {selectedEnquiry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs animate-fade-in"
          onClick={() => setSelectedEnquiry(null)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-2xl p-6 sm:p-7 shadow-xl border border-slate-200/80 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block mb-0.5">
                  ID #{selectedEnquiry.id} • {formatDate(selectedEnquiry.created_at)}
                </span>
                <h3 className="font-heading font-semibold text-lg text-slate-900 tracking-tight">
                  {selectedEnquiry.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-4">
              {/* Service */}
              <div>
                <span className="block text-[11px] font-medium text-slate-400 mb-1">
                  Service
                </span>
                <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-800">
                  {selectedEnquiry.service}
                </span>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Email Box */}
                <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/60 flex items-center justify-between">
                  <div className="min-w-0 flex-1 mr-2">
                    <span className="block text-[10px] text-slate-400 font-medium">Email</span>
                    <a
                      href={`mailto:${selectedEnquiry.email}`}
                      className="text-xs font-medium text-slate-800 hover:underline truncate block"
                    >
                      {selectedEnquiry.email}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(selectedEnquiry.email, 'email')}
                    title="Copy Email"
                    className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors shrink-0"
                  >
                    {copiedField === 'email' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Phone Box */}
                <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/60 flex items-center justify-between">
                  <div className="min-w-0 flex-1 mr-2">
                    <span className="block text-[10px] text-slate-400 font-medium">Phone</span>
                    <a
                      href={`tel:${selectedEnquiry.phone}`}
                      className="text-xs font-medium text-slate-800 hover:underline truncate block font-mono"
                    >
                      {selectedEnquiry.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-0.5 shrink-0">
                    <a
                      href={`https://wa.me/${selectedEnquiry.phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open WhatsApp"
                      className="p-1 rounded-md text-emerald-600 hover:bg-emerald-50 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopy(selectedEnquiry.phone, 'phone')}
                      title="Copy Phone"
                      className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
                    >
                      {copiedField === 'phone' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-medium text-slate-400">
                    Message
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(selectedEnquiry.message, 'message')}
                    className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800"
                  >
                    {copiedField === 'message' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/60 text-slate-800 text-xs whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto">
                  {selectedEnquiry.message}
                </div>
              </div>
            </div>

            {/* Modal Footer with Delete & Close buttons */}
            <div className="mt-6 pt-3.5 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => promptDeleteSingle(selectedEnquiry)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200/70 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Enquiry</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Delete Confirmation Modal (Single & Multi-Select)                         */}
      {/* ========================================================================= */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in"
          onClick={() => {
            if (!isDeleting) setDeleteTarget(null);
          }}
        >
          <div
            className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl border border-slate-200/90 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Warning Icon */}
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <Trash2 className="w-5 h-5" />
            </div>

            {/* Title */}
            <h3 className="font-heading font-semibold text-base text-slate-900 tracking-tight mb-1.5">
              {deleteTarget.type === 'single'
                ? 'Delete this enquiry?'
                : `Delete ${deleteTarget.count} enquiries?`}
            </h3>

            {/* Description */}
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              {deleteTarget.type === 'single' ? (
                <>
                  Are you sure you want to permanently delete the enquiry from{' '}
                  <span className="font-semibold text-slate-800">{deleteTarget.label}</span>?
                  This action cannot be undone.
                </>
              ) : (
                <>
                  Are you sure you want to permanently delete{' '}
                  <span className="font-semibold text-slate-800">
                    {deleteTarget.count} selected enquiries
                  </span>
                  ? This action cannot be undone.
                </>
              )}
            </p>

            {/* Error inside modal */}
            {deleteError && (
              <div
                role="alert"
                className="mb-4 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs"
              >
                {deleteError}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteTarget(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={executeDelete}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer shadow-xs"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
