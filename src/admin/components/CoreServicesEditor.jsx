import React, { useState } from 'react';
import { ImageInput } from './ImageInput';
import { Plus, Trash2 } from 'lucide-react';
import { servicesData } from '../../data/services';

const ICON_OPTIONS = [
  { value: 'BookOpenCheck', label: 'Book & Check (Accounting)' },
  { value: 'ShieldCheck', label: 'Shield & Check (Tax & Compliance)' },
  { value: 'TrendingUp', label: 'Trending Up (Audit & Advisory)' },
  { value: 'Briefcase', label: 'Briefcase (Corporate)' },
  { value: 'Calculator', label: 'Calculator (Financial)' },
  { value: 'FileCheck2', label: 'File & Check (Compliance)' },
  { value: 'Scale', label: 'Scale of Justice (Regulatory)' },
];

export function CoreServicesEditor({ data, onChange }) {
  const [activeItemIdx, setActiveItemIdx] = useState(0);

  const items = Array.isArray(data?.items) ? data.items : [];
  const currentItem = items[activeItemIdx] || items[0] || {};

  const handleGlobalChange = (field, value) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handleCurrentItemChange = (field, value) => {
    const updated = [...items];
    updated[activeItemIdx] = {
      ...updated[activeItemIdx],
      [field]: value,
    };
    handleGlobalChange('items', updated);
  };

  // Bullet points handlers
  const handleBulletChange = (bIdx, value) => {
    const bullets = [...(currentItem.bullets || [])];
    bullets[bIdx] = value;
    handleCurrentItemChange('bullets', bullets);
  };

  const handleAddBullet = () => {
    const bullets = [...(currentItem.bullets || [])];
    bullets.push('New key deliverable');
    handleCurrentItemChange('bullets', bullets);
  };

  const handleRemoveBullet = (bIdx) => {
    const bullets = [...(currentItem.bullets || [])];
    if (bullets.length <= 1) return;
    bullets.splice(bIdx, 1);
    handleCurrentItemChange('bullets', bullets);
  };

  const defaultPreview = servicesData[activeItemIdx]?.image || servicesData[0]?.image;

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Section Heading Settings */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-4 shadow-2xs">
        <h4 className="text-sm font-semibold text-slate-900">
          Section Headline & Subtitle
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Badge Tag
            </label>
            <input
              type="text"
              value={data?.badge || ''}
              onChange={(e) => handleGlobalChange('badge', e.target.value)}
              placeholder="Our Core Services"
              className="w-full h-11 px-4 rounded-xl text-sm bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900 shadow-2xs transition-colors"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Main Section Title
            </label>
            <input
              type="text"
              value={data?.title || ''}
              onChange={(e) => handleGlobalChange('title', e.target.value)}
              placeholder="Comprehensive Accounting & Financial Solutions"
              className="w-full h-11 px-4 rounded-xl text-sm bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900 shadow-2xs transition-colors"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Subtitle
            </label>
            <input
              type="text"
              value={data?.subtitle || ''}
              onChange={(e) => handleGlobalChange('subtitle', e.target.value)}
              placeholder="Accounting, auditing, tax, compliance and advisory support for UAE businesses."
              className="w-full h-11 px-4 rounded-xl text-sm bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900 shadow-2xs transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Services Switcher Tabs */}
      <div className="pt-2">
        <div className="flex border-b border-slate-200 gap-3">
          {items.map((svc, idx) => (
            <button
              key={svc.id || idx}
              type="button"
              onClick={() => setActiveItemIdx(idx)}
              className={`pb-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
                activeItemIdx === idx
                  ? 'border-[#C5A059] text-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              Service 0{idx + 1}: {svc.title || `Service ${idx + 1}`}
            </button>
          ))}
        </div>
      </div>

      {/* Active Service Item Editor */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 space-y-6 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-mono font-semibold text-[#C5A059]">
              Row {currentItem.index || `0${activeItemIdx + 1}`}
            </span>
            <h4 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
              {currentItem.title}
            </h4>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
              Service Title
            </label>
            <input
              type="text"
              value={currentItem.title || ''}
              onChange={(e) => handleCurrentItemChange('title', e.target.value)}
              placeholder="e.g. Accounting & Bookkeeping"
              className="w-full h-11 px-4 rounded-xl text-sm bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
              Icon
            </label>
            <select
              value={currentItem.icon || 'BookOpenCheck'}
              onChange={(e) => handleCurrentItemChange('icon', e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl text-sm bg-white border border-slate-200 text-slate-700 focus:outline-none focus:border-slate-900 cursor-pointer shadow-2xs"
            >
              {ICON_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
              One-Line Summary (Desktop Row Preview)
            </label>
            <input
              type="text"
              value={currentItem.short || ''}
              onChange={(e) => handleCurrentItemChange('short', e.target.value)}
              placeholder="e.g. Accounting, bookkeeping, software and e-invoicing."
              className="w-full h-11 px-4 rounded-xl text-sm bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900 shadow-2xs"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
              Detailed Overview Description
            </label>
            <textarea
              rows={3}
              value={currentItem.description || ''}
              onChange={(e) => handleCurrentItemChange('description', e.target.value)}
              placeholder="Accurate books are the foundation of smart business decisions..."
              className="w-full p-3.5 rounded-xl text-sm bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900 leading-relaxed shadow-2xs"
            />
          </div>
        </div>

        {/* Deliverable Bullets */}
        <div className="pt-6 border-t border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <h5 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
              Deliverable Bullets (3 Key Points)
            </h5>
            <button
              type="button"
              onClick={handleAddBullet}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-semibold cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Bullet</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(currentItem.bullets || []).map((bullet, bIdx) => (
              <div key={bIdx} className="flex items-center gap-2 p-3 rounded-xl bg-slate-50/80 border border-slate-200 shadow-2xs">
                <span className="w-5 h-5 rounded-full bg-amber-50 text-[#C5A059] flex items-center justify-center shrink-0 border border-[#C5A059]/30 text-xs font-bold">
                  ✓
                </span>
                <input
                  type="text"
                  value={bullet}
                  onChange={(e) => handleBulletChange(bIdx, e.target.value)}
                  className="flex-1 h-9 px-2.5 rounded-lg text-sm bg-white border border-slate-200 font-medium"
                />
                {(currentItem.bullets || []).length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveBullet(bIdx)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-white cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Cursor & Expansion Photo */}
        <div className="pt-6 border-t border-slate-100 space-y-4">
          <h5 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
            Floating Cursor Preview & Drawer Image
          </h5>
          <ImageInput
            label={`Photo for ${currentItem.title}`}
            value={currentItem.customImage || ''}
            onChange={(val) => handleCurrentItemChange('customImage', val)}
            defaultPreview={defaultPreview}
            recommendedDimensions="800x1000px JPG/WEBP"
            aspectRatio="aspect-[4/5]"
          />
        </div>
      </div>

      {/* Tailored Assistance Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-slate-900">
            Bottom Custom Financial Assistance Banner
          </h4>
          <span className="text-xs text-slate-400">Dark callout bar beneath service rows</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Banner Title
            </label>
            <input
              type="text"
              value={data?.ctaBannerTitle || ''}
              onChange={(e) => handleGlobalChange('ctaBannerTitle', e.target.value)}
              placeholder="Need custom financial assistance for your enterprise?"
              className="w-full h-11 px-4 rounded-xl text-sm bg-white border border-slate-200 text-slate-900 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Banner Subtitle
            </label>
            <input
              type="text"
              value={data?.ctaBannerSubtitle || ''}
              onChange={(e) => handleGlobalChange('ctaBannerSubtitle', e.target.value)}
              placeholder="Speak directly with our consultancy team to structure a tailored plan."
              className="w-full h-11 px-4 rounded-xl text-sm bg-white border border-slate-200 text-slate-900 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Button Text
            </label>
            <input
              type="text"
              value={data?.ctaBannerButtonText || ''}
              onChange={(e) => handleGlobalChange('ctaBannerButtonText', e.target.value)}
              placeholder="Request Service Consultation"
              className="w-full h-11 px-4 rounded-xl text-sm bg-white border border-slate-200 font-semibold text-slate-900 shadow-2xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

