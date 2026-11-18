import React from 'react';
import { ImageInput } from './ImageInput';
import mainLogo from '../../assets/logo/gwa-logo.png';

export function FooterEditor({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Overview Box */}
      <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-5 sm:p-6 text-xs sm:text-sm text-blue-950 leading-relaxed shadow-2xs">
        <strong>Footer & Brand Section:</strong> As shown in your screenshot, this section displays the Grace Way Accounting emblem logo, the company tagline, the social profile link icons (WhatsApp, LinkedIn, Instagram, X), and the bottom copyright notice. Updating the logo here also automatically updates the navigation header logo!
      </div>

      {/* Logo & Tagline */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-5 shadow-2xs">
        <h3 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
          Brand Logo & Tagline
        </h3>

        <div>
          <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
            Brand Tagline / Description
          </label>
          <input
            type="text"
            value={data.tagline || ''}
            onChange={(e) => handleChange('tagline', e.target.value)}
            placeholder="Accounting, auditing, tax, compliance and advisory support for UAE businesses."
            className="w-full h-11 px-4 rounded-xl text-sm bg-white border border-slate-200 text-slate-900 shadow-2xs"
          />
        </div>

        <ImageInput
          label="Company Logo"
          value={data.customLogo || ''}
          onChange={(val) => handleChange('customLogo', val)}
          defaultPreview={mainLogo}
          recommendedDimensions="400x160px PNG or SVG with transparency"
          aspectRatio="aspect-[2/1]"
        />
      </div>

      {/* Social Media Links */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-5 shadow-2xs">
        <h3 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
          Social Media Links (Circular Icon Buttons)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
              WhatsApp Link
            </label>
            <input
              type="text"
              value={data.whatsappUrl || ''}
              onChange={(e) => handleChange('whatsappUrl', e.target.value)}
              placeholder="https://wa.me/971569148255"
              className="w-full h-11 px-4 rounded-xl text-sm bg-white border border-slate-200 text-slate-900 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
              LinkedIn Profile URL
            </label>
            <input
              type="text"
              value={data.linkedinUrl || ''}
              onChange={(e) => handleChange('linkedinUrl', e.target.value)}
              placeholder="https://www.linkedin.com/company/grace-way"
              className="w-full h-11 px-4 rounded-xl text-sm bg-white border border-slate-200 text-slate-900 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
              Instagram Profile URL
            </label>
            <input
              type="text"
              value={data.instagramUrl || ''}
              onChange={(e) => handleChange('instagramUrl', e.target.value)}
              placeholder="https://www.instagram.com/graceway"
              className="w-full h-11 px-4 rounded-xl text-sm bg-white border border-slate-200 text-slate-900 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
              X (Twitter) Profile URL
            </label>
            <input
              type="text"
              value={data.xUrl || ''}
              onChange={(e) => handleChange('xUrl', e.target.value)}
              placeholder="https://x.com/graceway"
              className="w-full h-11 px-4 rounded-xl text-sm bg-white border border-slate-200 text-slate-900 shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* Copyright Notice */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-4 shadow-2xs">
        <h3 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
          Copyright Text
        </h3>
        <input
          type="text"
          value={data.copyright || ''}
          onChange={(e) => handleChange('copyright', e.target.value)}
          placeholder="© 2026 Grace Way Accounting FZC LLC. All rights reserved."
          className="w-full h-11 px-4 rounded-xl text-sm bg-white border border-slate-200 font-medium text-slate-900 shadow-2xs"
        />
      </div>
    </div>
  );
}

