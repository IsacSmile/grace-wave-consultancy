import React, { useState, useEffect, useCallback } from 'react';
import {
  Save,
  RotateCcw,
  ExternalLink,
  Check,
  AlertCircle,
  LayoutTemplate,
  TrendingUp,
  Briefcase,
  Layers,
  Milestone,
  MessageSquareQuote,
  Mail,
  ShieldCheck,
  Undo2,
  ChevronRight,
} from 'lucide-react';
import { defaultSiteContent } from '../../data/defaultContent';
import { useSiteContent } from '../../context/ContentContext';
import { HeroEditor } from './HeroEditor';
import { StatsEditor } from './StatsEditor';
import { CoreServicesEditor } from './CoreServicesEditor';
import { ServicesEditor } from './ServicesEditor';
import { ProcessEditor } from './ProcessEditor';
import { TestimonialsEditor } from './TestimonialsEditor';
import { ContactEditor } from './ContactEditor';
import { FooterEditor } from './FooterEditor';

const SECTIONS = [
  { id: 'hero', label: 'Hero Section', icon: LayoutTemplate, hint: 'Top banner, headline, description, actions, trust chips & advisor portrait' },
  { id: 'stats', label: 'Stats Strip', icon: TrendingUp, hint: 'Key credentials and metrics displayed directly beneath the Hero' },
  { id: 'coreServices', label: 'Our Core Services', icon: Briefcase, hint: 'Editorial service rows, deliverables, cursor images & custom assistance banner' },
  { id: 'serviceTabs', label: 'What We Deliver', icon: Layers, hint: 'Interactive service tabs, item breakdowns, badges and showcase imagery' },
  { id: 'process', label: 'How We Work', icon: Milestone, hint: 'Revolving 4-step client roadmap with deliverables & requirement tags' },
  { id: 'testimonials', label: 'Client Feedback', icon: MessageSquareQuote, hint: 'Executive testimonials, star ratings, quotes & client portraits' },
  { id: 'contact', label: 'Get In Touch', icon: Mail, hint: 'Firm contact details, office location, direct advisory enquiry form' },
  { id: 'footer', label: 'Footer & Brand', icon: ShieldCheck, hint: 'Official emblem logo, company description, social channels & copyright' },
];

export function ContentManager() {
  const { content: contextContent, broadcastUpdate } = useSiteContent();

  const [activeSection, setActiveSection] = useState('hero');
  const [formData, setFormData] = useState(() => JSON.parse(JSON.stringify(contextContent || defaultSiteContent)));
  const [savedData, setSavedData] = useState(() => JSON.parse(JSON.stringify(contextContent || defaultSiteContent)));

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  // Check if form has unsaved changes
  const isDirty = JSON.stringify(formData) !== JSON.stringify(savedData);

  // Fetch latest content from database on mount
  const fetchContent = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/admin?action=get_content');
      if (res.ok) {
        const data = await res.json();
        if (data.ok && data.content) {
          const merged = {
            ...defaultSiteContent,
            ...data.content,
          };
          setFormData(JSON.parse(JSON.stringify(merged)));
          setSavedData(JSON.parse(JSON.stringify(merged)));
          broadcastUpdate(merged);
        }
      }
    } catch {
      setErrorMessage('Could not load content from server. Using local defaults.');
    } finally {
      setIsLoading(false);
    }
  }, [broadcastUpdate]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  // Flash notification helper
  const notifySuccess = (msg) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  // Update a specific section
  const handleSectionUpdate = (sectionKey, newSectionData) => {
    setFormData((prev) => ({
      ...prev,
      [sectionKey]: newSectionData,
    }));
  };

  // Discard changes
  const handleDiscard = () => {
    setFormData(JSON.parse(JSON.stringify(savedData)));
    notifySuccess('Unsaved changes discarded.');
  };

  // Save changes to database
  const handleSave = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/admin?action=save_content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'gw-admin',
        },
        body: JSON.stringify({
          content: formData,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setSavedData(JSON.parse(JSON.stringify(formData)));
        broadcastUpdate(formData);
        notifySuccess('Website content saved successfully! Changes are live.');
      } else {
        setErrorMessage(data.error || 'Failed to save changes. Please try again.');
      }
    } catch {
      setErrorMessage('Network error while saving changes. Please check your connection.');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset section or all sections to defaults
  const handleResetToDefaults = async () => {
    setIsResetting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/admin?action=reset_content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'gw-admin',
        },
        body: JSON.stringify({
          key: activeSection, // Reset currently active section
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        const resetData = {
          ...formData,
          [activeSection]: JSON.parse(JSON.stringify(defaultSiteContent[activeSection])),
        };
        setFormData(resetData);
        setSavedData(resetData);
        broadcastUpdate(resetData);
        setConfirmResetOpen(false);
        notifySuccess(`Reset "${SECTIONS.find((s) => s.id === activeSection)?.label}" to defaults.`);
      } else {
        setErrorMessage(data.error || 'Failed to reset section.');
      }
    } catch {
      setErrorMessage('Network error while resetting section.');
    } finally {
      setIsResetting(false);
    }
  };

  // Keyboard shortcut: Ctrl+S / Cmd+S to save
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (isDirty && !isSaving) {
          handleSave();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDirty, isSaving, formData]);

  const activeSectionInfo = SECTIONS.find((s) => s.id === activeSection) || SECTIONS[0];
  const activeSectionIndex = SECTIONS.findIndex((s) => s.id === activeSection);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Toast Alert */}
      {statusMessage && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed top-6 right-6 z-50 bg-[#0F172A] text-white px-5 py-3 rounded-xl shadow-xl text-sm font-medium flex items-center gap-2.5 animate-fade-in border border-slate-800"
        >
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{statusMessage}</span>
        </aside>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div
          role="alert"
          className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center justify-between animate-fade-in shadow-2xs"
        >
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-rose-500 hover:text-rose-700 text-sm font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Toolbar / Action Bar */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900 tracking-tight">
              Website Content Studio
            </h2>
            {isDirty ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Unsaved changes
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Published live
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
            Content updates apply in real time across the public site while layout structure, styling, and GSAP animations remain preserved.
          </p>
        </div>

        {/* Global Buttons */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap shrink-0">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
            title="Open website in a new tab"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            <span>View Live Site</span>
          </a>

          {isDirty && (
            <button
              type="button"
              onClick={handleDiscard}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Discard</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setConfirmResetOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-rose-700 hover:bg-rose-50 border border-rose-200/70 transition-colors cursor-pointer"
            title="Reset current section to defaults"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
            <span className="hidden sm:inline">Reset Section</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#0F172A] hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
          >
            <Save className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
            <span>{isSaving ? 'Publishing...' : 'Save & Publish Live'}</span>
          </button>
        </div>
      </section>

      {/* Main Grid: Sidebar Section List + Active Section Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Sidebar Nav: Studio Outline */}
        <aside className="lg:col-span-4 xl:col-span-3 bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 shadow-2xs sticky top-20">
          <div className="flex items-center justify-between px-3 py-2 mb-2 border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-700 tracking-tight">
              Page Structure
            </span>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
              {SECTIONS.length} sections
            </span>
          </div>

          <nav className="space-y-1">
            {SECTIONS.map((sec, idx) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              const num = String(idx + 1).padStart(2, '0');
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setActiveSection(sec.id)}
                  className={`w-full group text-left px-3.5 py-3 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                    isActive
                      ? 'bg-[#0F172A] text-white shadow-xs font-medium'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`text-xs font-mono shrink-0 transition-colors ${
                        isActive ? 'text-[#C5A059] font-bold' : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    >
                      {num}
                    </span>
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'
                      }`}
                      strokeWidth={isActive ? 2 : 1.75}
                    />
                    <span className="text-sm truncate">
                      {sec.label}
                    </span>
                  </div>

                  {isActive ? (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059] shrink-0" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Section Editor Card: 8 cols on lg, 9 cols on xl */}
        <section className="lg:col-span-8 xl:col-span-9 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 lg:p-10 shadow-2xs space-y-8">
          {/* Section Header */}
          <div className="flex items-center justify-between pb-5 border-b border-slate-100 flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold text-[#C5A059] uppercase tracking-wider">
                  Section {String(activeSectionIndex + 1).padStart(2, '0')}
                </span>
                <span className="text-slate-300">/</span>
                <span className="text-xs text-slate-400 font-medium">Homepage Block</span>
              </div>
              <h3 className="font-heading font-bold text-xl sm:text-2xl text-slate-900 tracking-tight mt-1">
                {activeSectionInfo.label}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                {activeSectionInfo.hint}
              </p>
            </div>

            {/* Quick Save pill */}
            {isDirty && (
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#0F172A] hover:bg-slate-800 disabled:opacity-50 cursor-pointer shadow-xs transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            )}
          </div>

          {/* Render Active Section Editor */}
          {activeSection === 'hero' && (
            <HeroEditor
              data={formData.hero || defaultSiteContent.hero}
              onChange={(val) => handleSectionUpdate('hero', val)}
            />
          )}

          {activeSection === 'stats' && (
            <StatsEditor
              data={formData.stats || defaultSiteContent.stats}
              onChange={(val) => handleSectionUpdate('stats', val)}
            />
          )}

          {activeSection === 'coreServices' && (
            <CoreServicesEditor
              data={formData.coreServices || defaultSiteContent.coreServices}
              onChange={(val) => handleSectionUpdate('coreServices', val)}
            />
          )}

          {activeSection === 'serviceTabs' && (
            <ServicesEditor
              data={formData.serviceTabs || defaultSiteContent.serviceTabs}
              onChange={(val) => handleSectionUpdate('serviceTabs', val)}
            />
          )}

          {activeSection === 'process' && (
            <ProcessEditor
              data={formData.process || defaultSiteContent.process}
              onChange={(val) => handleSectionUpdate('process', val)}
            />
          )}

          {activeSection === 'testimonials' && (
            <TestimonialsEditor
              data={formData.testimonials || defaultSiteContent.testimonials}
              onChange={(val) => handleSectionUpdate('testimonials', val)}
            />
          )}

          {activeSection === 'contact' && (
            <ContactEditor
              data={formData.contact || defaultSiteContent.contact}
              onChange={(val) => handleSectionUpdate('contact', val)}
            />
          )}

          {activeSection === 'footer' && (
            <FooterEditor
              data={formData.footer || defaultSiteContent.footer}
              onChange={(val) => handleSectionUpdate('footer', val)}
            />
          )}

          {/* Bottom Save Bar */}
          <div className="pt-8 border-t border-slate-200 flex items-center justify-between flex-wrap gap-4">
            <span className="text-xs sm:text-sm text-slate-400">
              Shortcut: <kbd className="px-2 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-mono text-xs">Ctrl</kbd> + <kbd className="px-2 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-mono text-xs">S</kbd> to save
            </span>

            <button
              type="button"
              onClick={handleSave}
              disabled={!isDirty || isSaving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#0F172A] hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
            >
              <Save className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
              <span>{isSaving ? 'Saving...' : 'Save & Publish Live'}</span>
            </button>
          </div>
        </section>
      </div>

      {/* Confirmation Modal for Resetting to Defaults */}
      {confirmResetOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
        >
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-base text-slate-900">
                Reset {activeSectionInfo.label}?
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                This will restore this section&apos;s texts and images to their initial launch defaults. Custom edits for this section will be overwritten.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmResetOpen(false)}
                disabled={isResetting}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetToDefaults}
                disabled={isResetting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-2xs"
              >
                {isResetting ? 'Resetting...' : 'Yes, Reset to Default'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

