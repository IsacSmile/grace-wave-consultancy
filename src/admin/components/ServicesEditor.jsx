import React, { useState } from 'react';
import { ImageInput } from './ImageInput';
import { Plus, Trash2, ChevronRight } from 'lucide-react';
import accountingImg from '../../assets/services/accounting.webp';
import taxationImg from '../../assets/services/taxation.webp';
import auditImg from '../../assets/services/audit-advisory.webp';

const DEFAULT_PREVIEWS = [accountingImg, taxationImg, auditImg];

export function ServicesEditor({ data, onChange }) {
  const [activeTabIdx, setActiveTabIdx] = useState(0);

  const tabs = Array.isArray(data.tabs) ? data.tabs : [];
  const currentTab = tabs[activeTabIdx] || tabs[0] || {};

  const handleGlobalChange = (field, value) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handleCurrentTabChange = (field, value) => {
    const updatedTabs = [...tabs];
    updatedTabs[activeTabIdx] = {
      ...updatedTabs[activeTabIdx],
      [field]: value,
    };
    handleGlobalChange('tabs', updatedTabs);
  };

  // Accordion item handler (for Tab 1)
  const handleAccordionItemChange = (itemIdx, field, value) => {
    const items = [...(currentTab.items || [])];
    items[itemIdx] = {
      ...items[itemIdx],
      [field]: value,
    };
    handleCurrentTabChange('items', items);
  };

  const handleAddAccordionItem = () => {
    const items = [...(currentTab.items || [])];
    items.push({
      title: 'New Service Item',
      text: 'Description of service deliverables.',
    });
    handleCurrentTabChange('items', items);
  };

  const handleRemoveAccordionItem = (idx) => {
    const items = [...(currentTab.items || [])];
    if (items.length <= 1) return;
    items.splice(idx, 1);
    handleCurrentTabChange('items', items);
  };

  // Bullet handler (for Tab 2)
  const handleBulletChange = (bIdx, value) => {
    const bullets = [...(currentTab.bullets || [])];
    bullets[bIdx] = value;
    handleCurrentTabChange('bullets', bullets);
  };

  const handleAddBullet = () => {
    const bullets = [...(currentTab.bullets || [])];
    bullets.push('New Compliance Deliverable');
    handleCurrentTabChange('bullets', bullets);
  };

  const handleRemoveBullet = (bIdx) => {
    const bullets = [...(currentTab.bullets || [])];
    if (bullets.length <= 1) return;
    bullets.splice(bIdx, 1);
    handleCurrentTabChange('bullets', bullets);
  };

  // Feature cards handler (for Tab 3)
  const handleFeatureChange = (fIdx, field, value) => {
    const features = [...(currentTab.features || [])];
    features[fIdx] = {
      ...features[fIdx],
      [field]: value,
    };
    handleCurrentTabChange('features', features);
  };

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Section Overview Box */}
      <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-5 sm:p-6 text-xs sm:text-sm text-blue-950 leading-relaxed shadow-2xs">
        <strong>What We Deliver Section:</strong> This corresponds to the screenshot titled &ldquo;What We Deliver: Accounting, tax and advisory support, in detail&rdquo;. It contains three interactive service tabs. You can customize the section badge, headline, subtitle, each tab&apos;s title and intro text, the accordion/bullet items, the enquiry button text, and each tab&apos;s preview image and experience badge!
      </div>

      {/* Global Section Heading Settings */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-4 shadow-2xs">
        <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
          Section Header
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Badge Tag
            </label>
            <input
              type="text"
              value={data.badge || ''}
              onChange={(e) => handleGlobalChange('badge', e.target.value)}
              placeholder="WHAT WE DELIVER"
              className="w-full h-11 px-4 rounded-xl text-sm bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900 shadow-2xs transition-colors"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Main Section Title
            </label>
            <input
              type="text"
              value={data.title || ''}
              onChange={(e) => handleGlobalChange('title', e.target.value)}
              placeholder="Accounting, tax and advisory support, in detail"
              className="w-full h-11 px-4 rounded-xl text-sm bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900 shadow-2xs transition-colors"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Subtitle
            </label>
            <input
              type="text"
              value={data.subtitle || ''}
              onChange={(e) => handleGlobalChange('subtitle', e.target.value)}
              placeholder="Choose a service to see what is included."
              className="w-full h-11 px-4 rounded-xl text-sm bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900 shadow-2xs transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Tabs Switcher Navigation */}
      <div className="pt-2">
        <div className="flex border-b border-slate-200 gap-3">
          {tabs.map((tab, idx) => (
            <button
              key={tab.id || idx}
              type="button"
              onClick={() => setActiveTabIdx(idx)}
              className={`pb-3 px-5 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTabIdx === idx
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              Tab #{idx + 1}: {tab.tabLabel || `Tab ${idx + 1}`}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Specific Content */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 space-y-6 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h4 className="text-base sm:text-lg font-bold text-slate-900">
              Editing: {currentTab.tabLabel}
            </h4>
            <span className="text-xs text-slate-500">
              Layout format: {currentTab.type || (activeTabIdx === 0 ? 'Accordion' : activeTabIdx === 1 ? 'Bullets' : 'Feature Cards')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
              Tab Label
            </label>
            <input
              type="text"
              value={currentTab.tabLabel || ''}
              onChange={(e) => handleCurrentTabChange('tabLabel', e.target.value)}
              placeholder="Accounting & Bookkeeping"
              className="w-full h-11 px-4 rounded-xl text-sm bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
              CTA Button Text
            </label>
            <input
              type="text"
              value={currentTab.buttonText || ''}
              onChange={(e) => handleCurrentTabChange('buttonText', e.target.value)}
              placeholder="Enquire about this service"
              className="w-full h-11 px-4 rounded-xl text-sm bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900 shadow-2xs"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
              Tab Introduction Narrative
            </label>
            <textarea
              rows={3}
              value={currentTab.intro || ''}
              onChange={(e) => handleCurrentTabChange('intro', e.target.value)}
              placeholder="Organised records and accurate accounts, so you always know where your business stands."
              className="w-full p-3.5 rounded-xl text-sm bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900 leading-relaxed shadow-2xs"
            />
          </div>
        </div>

        {/* Dynamic Items Editor Depending on Tab */}
        {/* TAB 1: Accordion Items */}
        {activeTabIdx === 0 && (
          <div className="pt-5 border-t border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h5 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
                Accordion Items (Numbered 01, 02, etc.)
              </h5>
              <button
                type="button"
                onClick={handleAddAccordionItem}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-semibold cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-4">
              {(currentTab.items || []).map((item, iIdx) => (
                <div key={iIdx} className="p-4 sm:p-5 rounded-xl bg-slate-50/80 border border-slate-200 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 font-mono">
                      Item {String(iIdx + 1).padStart(2, '0')}.
                    </span>
                    {(currentTab.items || []).length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveAccordionItem(iIdx)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-white"
                        title="Delete item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={item.title || ''}
                    onChange={(e) => handleAccordionItemChange(iIdx, 'title', e.target.value)}
                    placeholder="e.g. Financial Record Management"
                    className="w-full h-10 px-3.5 rounded-lg text-sm bg-white border border-slate-200 font-medium"
                  />
                  <input
                    type="text"
                    value={item.text || ''}
                    onChange={(e) => handleAccordionItemChange(iIdx, 'text', e.target.value)}
                    placeholder="e.g. Systematic recording of invoices, bills and expenses."
                    className="w-full h-10 px-3.5 rounded-lg text-sm bg-white border border-slate-200 text-slate-600"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: Bullet points */}
        {activeTabIdx === 1 && (
          <div className="pt-5 border-t border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h5 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
                Compliance Checklist Bullets
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(currentTab.bullets || []).map((bullet, bIdx) => (
                <div key={bIdx} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50/80 border border-slate-200 shadow-2xs">
                  <span className="text-[#C5A059] text-sm font-bold">◆</span>
                  <input
                    type="text"
                    value={bullet}
                    onChange={(e) => handleBulletChange(bIdx, e.target.value)}
                    className="flex-1 h-9 px-3 rounded-lg text-sm bg-white border border-slate-200 font-medium"
                  />
                  {(currentTab.bullets || []).length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveBullet(bIdx)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-white"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Feature cards */}
        {activeTabIdx === 2 && (
          <div className="pt-5 border-t border-slate-100 space-y-4">
            <h5 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
              Strategic Advisory Feature Blocks (3 Blocks)
            </h5>
            <div className="space-y-4">
              {(currentTab.features || []).map((feat, fIdx) => (
                <div key={fIdx} className="p-4 sm:p-5 rounded-xl bg-slate-50/80 border border-slate-200 space-y-3 shadow-2xs">
                  <span className="text-xs font-bold text-slate-500">
                    Feature #{fIdx + 1}
                  </span>
                  <input
                    type="text"
                    value={feat.title || ''}
                    onChange={(e) => handleFeatureChange(fIdx, 'title', e.target.value)}
                    placeholder="e.g. Financial Planning"
                    className="w-full h-10 px-3.5 rounded-lg text-sm bg-white border border-slate-200 font-medium"
                  />
                  <textarea
                    rows={2}
                    value={feat.text || ''}
                    onChange={(e) => handleFeatureChange(fIdx, 'text', e.target.value)}
                    placeholder="Plan ahead with realistic numbers..."
                    className="w-full p-3 rounded-lg text-sm bg-white border border-slate-200 text-slate-600"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Preview Image & UAE Experience Badge */}
        <div className="pt-6 border-t border-slate-200 space-y-5">
          <h5 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
            Tab Image & Floating Experience Badge
          </h5>

          <ImageInput
            label={`Image for ${currentTab.tabLabel}`}
            value={currentTab.customImage || ''}
            onChange={(val) => handleCurrentTabChange('customImage', val)}
            defaultPreview={DEFAULT_PREVIEWS[activeTabIdx]}
            recommendedDimensions="800x1000px JPG/WEBP"
            aspectRatio="aspect-[4/5]"
          />

          <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 shadow-2xs">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Badge Tag
              </label>
              <input
                type="text"
                value={currentTab.badgeText || 'UAE EXPERIENCE'}
                onChange={(e) => handleCurrentTabChange('badgeText', e.target.value)}
                placeholder="UAE EXPERIENCE"
                className="w-full h-10 px-3.5 rounded-xl text-sm bg-white border border-slate-200 font-medium shadow-2xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Experience Number
              </label>
              <input
                type="text"
                value={currentTab.badgeValue !== undefined ? currentTab.badgeValue : 25}
                onChange={(e) => handleCurrentTabChange('badgeValue', e.target.value)}
                placeholder="25"
                className="w-full h-10 px-3.5 rounded-xl text-sm bg-white border border-slate-200 font-medium shadow-2xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Subtext
              </label>
              <input
                type="text"
                value={currentTab.badgeSubtext || 'Years of UAE market experience'}
                onChange={(e) => handleCurrentTabChange('badgeSubtext', e.target.value)}
                placeholder="Years of UAE market experience"
                className="w-full h-10 px-3.5 rounded-xl text-sm bg-white border border-slate-200 font-medium shadow-2xs"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

