import React, { useState, useEffect, useCallback } from 'react';
import {
  Save,
  RotateCcw,
  ExternalLink,
  Check,
  AlertCircle,
  Sparkles,
  BarChart3,
  Layers,
  Workflow,
  MessageSquareQuote,
  Mail,
  PanelBottom,
  Undo2,
} from 'lucide-react';
import { defaultSiteContent } from '../../data/defaultContent';
import { useSiteContent } from '../../context/ContentContext';
import { HeroEditor } from './HeroEditor';
import { StatsEditor } from './StatsEditor';
import { ServicesEditor } from './ServicesEditor';
import { ProcessEditor } from './ProcessEditor';
import { TestimonialsEditor } from './TestimonialsEditor';
import { ContactEditor } from './ContactEditor';
import { FooterEditor } from './FooterEditor';

const SECTIONS = [
  { id: 'hero', label: 'Hero Section', icon: Sparkles, desc: 'Headline, description, CTAs, trust chips, advisor photo' },
  { id: 'stats', label: 'Stats Strip', icon: BarChart3, desc: 'Years experience, core services, emirates covered' },
  { id: 'serviceTabs', label: 'What We Deliver', icon: Layers, desc: '3 service tabs, intros, items, images & badges' },
  { id: 'process', label: 'How We Work', icon: Workflow, desc: '4-step rotating process with checklist & tags' },
  { id: 'testimonials', label: 'Client Feedback', icon: MessageSquareQuote, desc: 'Client reviews, ratings, quotes, portraits' },
  { id: 'contact', label: 'Get In Touch', icon: Mail, desc: 'Contact details, narrative, social proof, consult form' },
  { id: 'footer', label: 'Footer & Brand', icon: PanelBottom, desc: 'Logo, tagline, social links, copyright' },
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

  return (
    <div className="space-y-8">
      {/* Toast Alert */}
      {statusMessage && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-medium flex items-center gap-2.5 animate-fade-in border border-slate-800"
        >
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{statusMessage}</span>
        </aside>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div
          role="alert"
          className="p-4 sm:p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center justify-between animate-fade-in shadow-2xs"
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
      <section className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-6">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900 tracking-tight">
              Website Content Manager
            </h2>
            {isDirty && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                Unsaved Changes
              </span>
            )}
            {!isDirty && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                All changes live
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
            Edit text content and images for each section. Layout, styling and animations remain 100% intact.
          </p>
        </div>

        {/* Global Buttons */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap shrink-0">
          {/* View Website Link */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
            title="Open website in a new tab"
          >
            <ExternalLink className="w-4 h-4 text-slate-500" />
            <span>View Live Site</span>
          </a>

          {/* Discard Button (if dirty) */}
          {isDirty && (
            <button
              type="button"
              onClick={handleDiscard}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
            >
              <Undo2 className="w-4 h-4" />
              <span>Discard</span>
            </button>
          )}

          {/* Reset to Defaults */}
          <button
            type="button"
            onClick={() => setConfirmResetOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200/70 transition-colors cursor-pointer"
            title="Reset current section to defaults"
          >
            <RotateCcw className="w-4 h-4 text-rose-500" />
            <span className="hidden sm:inline">Reset Section</span>
          </button>

          {/* Save Button */}
          <button
            type="button"
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
          >
            <Save className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
            <span>{isSaving ? 'Publishing...' : 'Save & Publish Live'}</span>
          </button>
        </div>
      </section>

      {/* Main Grid: Sidebar Section List + Active Section Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Sidebar Nav: 4 cols on lg, 3 cols on xl */}
        <aside className="lg:col-span-4 xl:col-span-3 bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs space-y-2 sticky top-20">
          <div className="px-3 py-2 mb-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Website Sections
            </span>
          </div>

          {SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setActiveSection(sec.id)}
                className={`w-full text-left p-3.5 rounded-xl transition-all flex items-start gap-3.5 cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    isActive ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className={`text-sm font-bold ${isActive ? 'text-white' : 'text-slate-900'}`}>
                    {sec.label}
                  </div>
                  <div
                    className={`text-xs truncate mt-0.5 leading-snug ${
                      isActive ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {sec.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </aside>

        {/* Section Editor Card: 8 cols on lg, 9 cols on xl */}
        <section className="lg:col-span-8 xl:col-span-9 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 lg:p-10 shadow-2xs space-y-8">
          {/* Section Header */}
          <div className="flex items-center justify-between pb-5 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Editing Section
              </span>
              <h3 className="font-heading font-bold text-xl sm:text-2xl text-slate-900 tracking-tight mt-0.5">
                {activeSectionInfo.label}
              </h3>
            </div>

            {/* Quick Save pill */}
            {isDirty && (
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 cursor-pointer shadow-2xs"
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
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md cursor-pointer"
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

