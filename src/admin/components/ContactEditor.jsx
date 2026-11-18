import React from 'react';

export function ContactEditor({ data, onChange }) {
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
        <strong>Get In Touch / Contact Section:</strong> As shown in your screenshot, this section displays the &ldquo;Turning Challenges into Opportunities&rdquo; heading, narrative text, office address, contact telephone numbers, email address, social proof trust badge, and the direct enquiry consultation form header.
      </div>

      {/* Main Narrative & Header */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Section Header & Narrative
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Badge Tag
            </label>
            <input
              type="text"
              value={data.badge || ''}
              onChange={(e) => handleChange('badge', e.target.value)}
              placeholder="Get In Touch"
              className="w-full h-9 px-3 rounded-lg text-xs bg-white border border-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Heading Title
            </label>
            <input
              type="text"
              value={data.heading || ''}
              onChange={(e) => handleChange('heading', e.target.value)}
              placeholder="Turning Challenges into Opportunities"
              className="w-full h-9 px-3 rounded-lg text-xs bg-white border border-slate-200 font-semibold"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Narrative Copy
            </label>
            <textarea
              rows={3}
              value={data.narrative || ''}
              onChange={(e) => handleChange('narrative', e.target.value)}
              placeholder="Make the decision to move forward. Commit your vision to clarity..."
              className="w-full p-2.5 rounded-lg text-xs bg-white border border-slate-200 leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* Contact Details */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Business Contact Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Physical Office Address
            </label>
            <input
              type="text"
              value={data.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="BC-894183, 26th Floor, Amber Gem Tower, Ajman, United Arab Emirates"
              className="w-full h-9 px-3 rounded-lg text-xs bg-white border border-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Primary Phone
            </label>
            <input
              type="text"
              value={data.phonePrimary || ''}
              onChange={(e) => handleChange('phonePrimary', e.target.value)}
              placeholder="+971 56 914 8255"
              className="w-full h-9 px-3 rounded-lg text-xs bg-white border border-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Secondary Phone
            </label>
            <input
              type="text"
              value={data.phoneSecondary || ''}
              onChange={(e) => handleChange('phoneSecondary', e.target.value)}
              placeholder="+971 50 595 7886"
              className="w-full h-9 px-3 rounded-lg text-xs bg-white border border-slate-200"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Contact Email
            </label>
            <input
              type="email"
              value={data.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="info@gracewayaccounting.com"
              className="w-full h-9 px-3 rounded-lg text-xs bg-white border border-slate-200"
            />
          </div>
        </div>
      </div>

      {/* Social Proof Trust Badge */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Social Proof Badge (Below Contact Details)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Badge Counter Text
            </label>
            <input
              type="text"
              value={data.trustBadgeCount || ''}
              onChange={(e) => handleChange('trustBadgeCount', e.target.value)}
              placeholder="Trusted by 500+"
              className="w-full h-9 px-3 rounded-lg text-xs bg-white border border-slate-200 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Badge Subtext
            </label>
            <input
              type="text"
              value={data.trustBadgeText || ''}
              onChange={(e) => handleChange('trustBadgeText', e.target.value)}
              placeholder="Businesses across the UAE"
              className="w-full h-9 px-3 rounded-lg text-xs bg-white border border-slate-200"
            />
          </div>
        </div>
      </div>

      {/* Direct Enquiry Consultation Form Card */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Direct Enquiry Form Card Header
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Form Badge
            </label>
            <input
              type="text"
              value={data.formBadge || ''}
              onChange={(e) => handleChange('formBadge', e.target.value)}
              placeholder="DIRECT ENQUIRY"
              className="w-full h-9 px-3 rounded-lg text-xs bg-white border border-slate-200 font-semibold"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Form Card Title
            </label>
            <input
              type="text"
              value={data.formTitle || ''}
              onChange={(e) => handleChange('formTitle', e.target.value)}
              placeholder="Consult With Our Senior Advisors"
              className="w-full h-9 px-3 rounded-lg text-xs bg-white border border-slate-200 font-semibold"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Form Subtitle
            </label>
            <input
              type="text"
              value={data.formSubtitle || ''}
              onChange={(e) => handleChange('formSubtitle', e.target.value)}
              placeholder="Please provide your details below, and our team will get back to you promptly."
              className="w-full h-9 px-3 rounded-lg text-xs bg-white border border-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Submit Button Text
            </label>
            <input
              type="text"
              value={data.formButtonText || ''}
              onChange={(e) => handleChange('formButtonText', e.target.value)}
              placeholder="Send Message"
              className="w-full h-9 px-3 rounded-lg text-xs bg-white border border-slate-200 font-semibold"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

