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
    <div className="space-y-6">
      {/* Section Overview Box */}
      <div className="bg-blue-50/60 border border-blue-200/70 rounded-xl p-4 text-xs text-blue-900 leading-relaxed">
        <strong>Hero Section:</strong> The top introduction of the homepage. You can edit the executive badge, the 2-line headline, description paragraph, call-to-action buttons, the 4 trust highlight chips, and the professional advisor portrait image.
      </div>

      {/* Basic Text Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Badge */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Badge Tag
          </label>
          <input
            type="text"
            value={data.badge || ''}
            onChange={(e) => handleChange('badge', e.target.value)}
            placeholder="e.g. Trusted Accounting & Tax Advisors"
            className="w-full h-10 px-3 rounded-xl text-xs bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-2xs"
          />
        </div>

        {/* Headline Line 1 */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Headline Line 1
          </label>
          <input
            type="text"
            value={data.headlineLine1 || ''}
            onChange={(e) => handleChange('headlineLine1', e.target.value)}
            placeholder="e.g. Smart Accounting."
            className="w-full h-10 px-3 rounded-xl text-xs bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-2xs"
          />
        </div>

        {/* Headline Line 2 */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Headline Line 2
          </label>
          <input
            type="text"
            value={data.headlineLine2 || ''}
            onChange={(e) => handleChange('headlineLine2', e.target.value)}
            placeholder="e.g. Stress-Free Compliance."
            className="w-full h-10 px-3 rounded-xl text-xs bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-2xs"
          />
        </div>

        {/* Supporting Description */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Supporting Description Paragraph
          </label>
          <textarea
            rows={3}
            value={data.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Grace Way Accounting delivers accounting, auditing..."
            className="w-full p-3 rounded-xl text-xs bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-2xs leading-relaxed"
          />
        </div>
      </div>

      {/* Call To Action Buttons */}
      <div className="pt-4 border-t border-slate-200/80">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
          Call to Action Buttons
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="text-xs font-semibold text-slate-800">Primary Button</h4>
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Button Text</label>
              <input
                type="text"
                value={data.primaryCtaText || ''}
                onChange={(e) => handleChange('primaryCtaText', e.target.value)}
                placeholder="Get a Free Enquiry"
                className="w-full h-9 px-3 rounded-lg text-xs bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Button Link</label>
              <input
                type="text"
                value={data.primaryCtaHref || ''}
                onChange={(e) => handleChange('primaryCtaHref', e.target.value)}
                placeholder="#contact"
                className="w-full h-9 px-3 rounded-lg text-xs bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="text-xs font-semibold text-slate-800">WhatsApp Button</h4>
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Button Text</label>
              <input
                type="text"
                value={data.secondaryCtaText || ''}
                onChange={(e) => handleChange('secondaryCtaText', e.target.value)}
                placeholder="Chat on WhatsApp"
                className="w-full h-9 px-3 rounded-lg text-xs bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">WhatsApp Link</label>
              <input
                type="text"
                value={data.secondaryCtaHref || ''}
                onChange={(e) => handleChange('secondaryCtaHref', e.target.value)}
                placeholder="https://wa.me/971569148255"
                className="w-full h-9 px-3 rounded-lg text-xs bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4 Trust Row Chips */}
      <div className="pt-4 border-t border-slate-200/80">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
          Trust Highlight Chips (4 Items)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {(data.trustRow || []).map((chip, idx) => (
            <div key={chip.id || idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">
                Chip #{idx + 1}
              </span>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Label</label>
                <input
                  type="text"
                  value={chip.label || ''}
                  onChange={(e) => handleTrustRowChange(idx, 'label', e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg text-xs bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Subtext</label>
                <input
                  type="text"
                  value={chip.desc || ''}
                  onChange={(e) => handleTrustRowChange(idx, 'desc', e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg text-xs bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Professional Advisor Portrait Image */}
      <div className="pt-4 border-t border-slate-200/80">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
          Hero Advisor Image
        </h3>
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

