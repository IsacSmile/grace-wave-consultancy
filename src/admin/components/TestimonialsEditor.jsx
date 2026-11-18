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
    <div className="space-y-6">
      {/* Overview Box */}
      <div className="bg-blue-50/60 border border-blue-200/70 rounded-xl p-4 text-xs text-blue-900 leading-relaxed">
        <strong>Client Feedback Section:</strong> As seen in your screenshot titled &ldquo;What our clients say&rdquo;, this displays testimonial slides with client photo, star rating, quote, author name and job title. You can add new reviews, delete reviews, edit quotes, and upload custom client portraits!
      </div>

      {/* Global Section Header */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            Section Badge Tag
          </label>
          <input
            type="text"
            value={data.badge || ''}
            onChange={(e) => handleGlobalChange('badge', e.target.value)}
            placeholder="CLIENT FEEDBACK"
            className="w-full h-9 px-3 rounded-lg text-xs bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            Section Title
          </label>
          <input
            type="text"
            value={data.title || ''}
            onChange={(e) => handleGlobalChange('title', e.target.value)}
            placeholder="What our clients say"
            className="w-full h-9 px-3 rounded-lg text-xs bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900"
          />
        </div>
      </div>

      {/* Testimonials List Pills */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Reviews ({items.length})
          </span>
          <button
            type="button"
            onClick={handleAddTestimonial}
            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Review</span>
          </button>
        </div>

        <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1 no-scrollbar">
          {items.map((item, idx) => (
            <button
              key={item.id || idx}
              type="button"
              onClick={() => setSelectedIdx(idx)}
              className={`pb-2 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
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
      <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h4 className="text-sm font-bold text-slate-900">
            Editing Review #{selectedIdx + 1}
          </h4>
          {items.length > 1 && (
            <button
              type="button"
              onClick={() => handleRemoveTestimonial(selectedIdx)}
              className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete this review</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Client Name
            </label>
            <input
              type="text"
              value={currentItem.name || ''}
              onChange={(e) => handleItemChange('name', e.target.value)}
              placeholder="e.g. Tariq Al-Mansoor"
              className="w-full h-9 px-3 rounded-lg text-xs bg-white border border-slate-200 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Job Title / Role
            </label>
            <input
              type="text"
              value={currentItem.role || ''}
              onChange={(e) => handleItemChange('role', e.target.value)}
              placeholder="e.g. Finance Manager"
              className="w-full h-9 px-3 rounded-lg text-xs bg-white border border-slate-200 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Rating (1 to 5 Stars)
            </label>
            <div className="flex items-center gap-2 h-9 px-3 rounded-lg bg-slate-50 border border-slate-200">
              {[1, 2, 3, 4, 5].map((starVal) => (
                <button
                  key={starVal}
                  type="button"
                  onClick={() => handleItemChange('rating', starVal)}
                  className="p-0.5 cursor-pointer hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-4 h-4 ${
                      starVal <= (currentItem.rating || 5)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-slate-700 ml-1 font-mono">
                {currentItem.rating || 5}/5
              </span>
            </div>
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Client Quote
            </label>
            <textarea
              rows={3}
              value={currentItem.quote || ''}
              onChange={(e) => handleItemChange('quote', e.target.value)}
              placeholder="The team keeps our books accurate and on time..."
              className="w-full p-3 rounded-lg text-xs bg-white border border-slate-200 leading-relaxed font-normal italic"
            />
          </div>
        </div>

        {/* Client Photo */}
        <div className="pt-4 border-t border-slate-100">
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

