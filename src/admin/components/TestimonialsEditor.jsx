import React, { useState } from 'react';
import { ImageInput } from './ImageInput';
import { Plus, Trash2, Star } from 'lucide-react';
import client1 from '../../assets/testimonials/client-1.webp';
import client2 from '../../assets/testimonials/client-2.webp';
import client3 from '../../assets/testimonials/client-3.webp';

const DEFAULT_CLIENT_PREVIEWS = [client1, client2, client3];

export function TestimonialsEditor({ data, onChange }) {
  const [selectedIdx, setSelectedIdx] = useState(0);

  const items = Array.isArray(data.items) ? data.items : [];
  const currentItem = items[selectedIdx] || items[0] || {};

  const handleGlobalChange = (field, value) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handleItemChange = (field, value) => {
    const updated = [...items];
    updated[selectedIdx] = {
      ...updated[selectedIdx],
      [field]: value,
    };
    handleGlobalChange('items', updated);
  };

  const handleAddTestimonial = () => {
    const newItem = {
      id: `testimonial-${Date.now()}`,
      name: 'Client Name',
      role: 'Executive Director',
      quote: 'Exceptional service and dedicated advisors that transformed our compliance workflows.',
      rating: 5,
      customImage: '',
    };
    const updated = [...items, newItem];
    handleGlobalChange('items', updated);
    setSelectedIdx(updated.length - 1);
  };

  const handleRemoveTestimonial = (idx) => {
    if (items.length <= 1) {
      alert('You must have at least one client review.');
      return;
    }
    const updated = items.filter((_, i) => i !== idx);
    handleGlobalChange('items', updated);
    setSelectedIdx(Math.max(0, idx - 1));
  };

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Overview Box */}
      <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-5 sm:p-6 text-xs sm:text-sm text-blue-950 leading-relaxed shadow-2xs">
        <strong>Client Feedback Section:</strong> As seen in your screenshot titled &ldquo;What our clients say&rdquo;, this displays testimonial slides with client photo, star rating, quote, author name and job title. You can add new reviews, delete reviews, edit quotes, and upload custom client portraits!
      </div>

      {/* Global Section Header */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-50/80 border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 shadow-2xs">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Section Badge Tag
          </label>
          <input
            type="text"
            value={data.badge || ''}
            onChange={(e) => handleGlobalChange('badge', e.target.value)}
            placeholder="CLIENT FEEDBACK"
            className="w-full h-11 px-4 rounded-xl text-sm bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900 shadow-2xs transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Section Title
          </label>
          <input
            type="text"
            value={data.title || ''}
            onChange={(e) => handleGlobalChange('title', e.target.value)}
            placeholder="What our clients say"
            className="w-full h-11 px-4 rounded-xl text-sm bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900 shadow-2xs transition-colors"
          />
        </div>
      </div>

      {/* Testimonials List Pills */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
            Reviews ({items.length})
          </span>
          <button
            type="button"
            onClick={handleAddTestimonial}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-semibold cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Review</span>
          </button>
        </div>

        <div className="flex border-b border-slate-200 gap-3 overflow-x-auto pb-1 no-scrollbar">
          {items.map((item, idx) => (
            <button
              key={item.id || idx}
              type="button"
              onClick={() => setSelectedIdx(idx)}
              className={`pb-3 px-4 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                selectedIdx === idx
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              #{idx + 1}: {item.name || 'Anonymous'}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Testimonial Detail Editor */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 space-y-6 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h4 className="text-base sm:text-lg font-bold text-slate-900">
            Editing Review #{selectedIdx + 1}
          </h4>
          {items.length > 1 && (
            <button
              type="button"
              onClick={() => handleRemoveTestimonial(selectedIdx)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-semibold cursor-pointer transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete this review</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
              Client Name
            </label>
            <input
              type="text"
              value={currentItem.name || ''}
              onChange={(e) => handleItemChange('name', e.target.value)}
              placeholder="e.g. Tariq Al-Mansoor"
              className="w-full h-11 px-4 rounded-xl text-sm bg-white border border-slate-200 font-medium shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
              Job Title / Role
            </label>
            <input
              type="text"
              value={currentItem.role || ''}
              onChange={(e) => handleItemChange('role', e.target.value)}
              placeholder="e.g. Finance Manager"
              className="w-full h-11 px-4 rounded-xl text-sm bg-white border border-slate-200 font-medium shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
              Rating (1 to 5 Stars)
            </label>
            <div className="flex items-center gap-2 h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
              {[1, 2, 3, 4, 5].map((starVal) => (
                <button
                  key={starVal}
                  type="button"
                  onClick={() => handleItemChange('rating', starVal)}
                  className="p-1 cursor-pointer hover:scale-115 transition-transform"
                >
                  <Star
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      starVal <= (currentItem.rating || 5)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs sm:text-sm font-bold text-slate-700 ml-2 font-mono">
                {currentItem.rating || 5}/5
              </span>
            </div>
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
              Client Quote
            </label>
            <textarea
              rows={4}
              value={currentItem.quote || ''}
              onChange={(e) => handleItemChange('quote', e.target.value)}
              placeholder="The team keeps our books accurate and on time..."
              className="w-full p-4 rounded-xl text-sm bg-white border border-slate-200 leading-relaxed font-normal italic shadow-2xs"
            />
          </div>
        </div>

        {/* Client Photo */}
        <div className="pt-6 border-t border-slate-100">
          <ImageInput
            label="Client Portrait Photo"
            value={currentItem.customImage || ''}
            onChange={(val) => handleItemChange('customImage', val)}
            defaultPreview={DEFAULT_CLIENT_PREVIEWS[selectedIdx % DEFAULT_CLIENT_PREVIEWS.length]}
            recommendedDimensions="640x800px Portrait JPG/WEBP"
            aspectRatio="aspect-[4/5]"
          />
        </div>
      </div>
    </div>
  );
}

