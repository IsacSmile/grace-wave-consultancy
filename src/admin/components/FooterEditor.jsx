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
    <div className="space-y-6">
      {/* Overview Box */}
      <div className="bg-blue-50/60 border border-blue-200/70 rounded-xl p-4 text-xs text-blue-900 leading-relaxed">
        <strong>Footer & Brand Section:</strong> As shown in your screenshot, this section displays the Grace Way Accounting emblem logo, the company tagline, the social profile link icons (WhatsApp, LinkedIn, Instagram, X), and the bottom copyright notice. Updating the logo here also automatically updates the navigation header logo!
      </div>

      {/* Logo & Tagline */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Brand Logo & Tagline
        </h3>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Brand Tagline / Description
          </label>
          <input
            type="text"
            value={data.tagline || ''}
            onChange={(e) => handleChange('tagline', e.target.value)}
            placeholder="Accounting, auditing, tax, compliance and advisory support for UAE businesses."
            className="w-full h-9 px-3 rounded-lg text-xs bg-white border border-slate-200"
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
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Social Media Links (Circular Icon Buttons)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              WhatsApp Link
            </label>
            <input
              type="text"
              value={data.whatsappUrl || ''}
              onChange={(e) => handleChange('whatsappUrl', e.target.value)}
              placeholder="https://wa.me/971569148255"
              className="w-full h-9 px-3 rounded-lg text-xs bg-white border border-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              LinkedIn Profile URL
            </label>
            <input
              type="text"
              value={data.linkedinUrl || ''}
              onChange={(e) => handleChange('linkedinUrl', e.target.value)}
              placeholder="https://www.linkedin.com/company/grace-way"
              className="w-full h-9 px-3 rounded-lg text-xs bg-white border border-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Instagram Profile URL
            </label>
            <input
              type="text"
              value={data.instagramUrl || ''}
              onChange={(e) => handleChange('instagramUrl', e.target.value)}
              placeholder="https://www.instagram.com/graceway"
              className="w-full h-9 px-3 rounded-lg text-xs bg-white border border-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              X (Twitter) Profile URL
            </label>
            <input
              type="text"
              value={data.xUrl || ''}
              onChange={(e) => handleChange('xUrl', e.target.value)}
              placeholder="https://x.com/graceway"
              className="w-full h-9 px-3 rounded-lg text-xs bg-white border border-slate-200"
            />
          </div>
        </div>
      </div>

      {/* Copyright Notice */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Copyright Text
        </h3>
        <input
          type="text"
          value={data.copyright || ''}
          onChange={(e) => handleChange('copyright', e.target.value)}
          placeholder="© 2026 Grace Way Accounting FZC LLC. All rights reserved."
          className="w-full h-9 px-3 rounded-lg text-xs bg-white border border-slate-200 font-medium"
        />
      </div>
    </div>
  );
}

