import React from 'react';
import { ImageInput } from './ImageInput';
import defaultAdvisorImg from '../../assets/hero/advisor-768w.webp';

export function HeroEditor({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handleTrustRowChange = (index, field, value) => {
    const updated = [...(data.trustRow || [])];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    handleChange('trustRow', updated);
  };

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Basic Text Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Badge */}
        <div className="md:col-span-2">
          <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
            Badge Tag
          </label>
          <input
            type="text"
            value={data.badge || ''}
            onChange={(e) => handleChange('badge', e.target.value)}
            placeholder="e.g. Trusted Accounting & Tax Advisors"
            className="w-full h-11 px-4 rounded-xl text-sm bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-2xs transition-colors"
          />
        </div>

        {/* Headline Line 1 */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
            Headline Line 1
          </label>
          <input
            type="text"
            value={data.headlineLine1 || ''}
            onChange={(e) => handleChange('headlineLine1', e.target.value)}
            placeholder="e.g. Smart Accounting."
            className="w-full h-11 px-4 rounded-xl text-sm bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-2xs transition-colors"
          />
        </div>

        {/* Headline Line 2 */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
            Headline Line 2
          </label>
          <input
            type="text"
            value={data.headlineLine2 || ''}
            onChange={(e) => handleChange('headlineLine2', e.target.value)}
            placeholder="e.g. Stress-Free Compliance."
            className="w-full h-11 px-4 rounded-xl text-sm bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-2xs transition-colors"
          />
        </div>

        {/* Supporting Description */}
        <div className="md:col-span-2">
          <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
            Supporting Description Paragraph
          </label>
          <textarea
            rows={4}
            value={data.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Grace Way Accounting delivers accounting, auditing..."
            className="w-full p-4 rounded-xl text-sm bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-2xs leading-relaxed transition-colors"
          />
        </div>
      </div>

      {/* Call To Action Buttons */}
      <div className="pt-6 sm:pt-8 border-t border-slate-100">
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-slate-900">
            Call to Action Buttons
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Primary enquiry trigger and instant WhatsApp consultation links
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-4">
            <span className="text-xs font-semibold text-slate-800 block">Primary Button</span>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Button Text</label>
              <input
                type="text"
                value={data.primaryCtaText || ''}
                onChange={(e) => handleChange('primaryCtaText', e.target.value)}
                placeholder="Get a Free Enquiry"
                className="w-full h-11 px-4 rounded-xl text-sm bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900 shadow-2xs transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Button Target Link</label>
              <input
                type="text"
                value={data.primaryCtaHref || ''}
                onChange={(e) => handleChange('primaryCtaHref', e.target.value)}
                placeholder="#contact"
                className="w-full h-11 px-4 rounded-xl text-sm bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900 shadow-2xs transition-colors"
              />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-4">
            <span className="text-xs font-semibold text-slate-800 block">WhatsApp Direct Action</span>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Button Text</label>
              <input
                type="text"
                value={data.secondaryCtaText || ''}
                onChange={(e) => handleChange('secondaryCtaText', e.target.value)}
                placeholder="Chat on WhatsApp"
                className="w-full h-11 px-4 rounded-xl text-sm bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900 shadow-2xs transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">WhatsApp Link</label>
              <input
                type="text"
                value={data.secondaryCtaHref || ''}
                onChange={(e) => handleChange('secondaryCtaHref', e.target.value)}
                placeholder="https://wa.me/971569148255"
                className="w-full h-11 px-4 rounded-xl text-sm bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900 shadow-2xs transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4 Trust Row Chips */}
      <div className="pt-6 sm:pt-8 border-t border-slate-100">
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-slate-900">
            Trust Highlights (4 Pillars)
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Key practice areas displayed on the trust cards directly under the hero actions
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4 sm:gap-5">
          {(data.trustRow || []).map((chip, idx) => (
            <div key={chip.id || idx} className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3.5 shadow-2xs">
              <span className="text-xs font-mono font-semibold text-[#C5A059] block">
                0{idx + 1}
              </span>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Label</label>
                <input
                  type="text"
                  value={chip.label || ''}
                  onChange={(e) => handleTrustRowChange(idx, 'label', e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl text-sm bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900 shadow-2xs transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Subtext</label>
                <input
                  type="text"
                  value={chip.desc || ''}
                  onChange={(e) => handleTrustRowChange(idx, 'desc', e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl text-sm bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900 shadow-2xs transition-colors"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Professional Advisor Portrait Image */}
      <div className="pt-6 sm:pt-8 border-t border-slate-100">
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-slate-900">
            Hero Advisor Portrait
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Cutout or executive portrait image featured prominently in the hero section
          </p>
        </div>
        <ImageInput
          label="Advisor Portrait Photo"
          value={data.customImage || ''}
          onChange={(val) => handleChange('customImage', val)}
          defaultPreview={defaultAdvisorImg}
          recommendedDimensions="768x900px transparent/portrait cutout"
          aspectRatio="aspect-[4/5]"
        />
      </div>
    </div>
  );
}

