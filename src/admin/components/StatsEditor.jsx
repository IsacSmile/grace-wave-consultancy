import React from 'react';
import { Plus, Trash2, Award, FileCheck2, MapPin, Users, ThumbsUp, Smile } from 'lucide-react';

const ICON_OPTIONS = [
  { value: 'Award', label: 'Award Ribbon' },
  { value: 'FileCheck2', label: 'File / Document' },
  { value: 'MapPin', label: 'Map Location Pin' },
  { value: 'Users', label: 'Users Team' },
  { value: 'ThumbsUp', label: 'Thumbs Up' },
  { value: 'Smile', label: 'Satisfied Smile' },
];

export function StatsEditor({ data, onChange }) {
  const statsList = Array.isArray(data) ? data : [];

  const handleStatChange = (index, field, value) => {
    const updated = [...statsList];
    updated[index] = {
      ...updated[index],
      [field]: field === 'value' ? (value === '' ? '' : Number(value) || 0) : value,
    };
    onChange(updated);
  };

  const handleAddStat = () => {
    const newStat = {
      id: `stat-${Date.now()}`,
      value: 10,
      suffix: '+',
      label: 'New Metric',
      icon: 'Award',
    };
    onChange([...statsList, newStat]);
  };

  const handleRemoveStat = (index) => {
    if (statsList.length <= 1) {
      alert('You must have at least one stat item.');
      return;
    }
    const updated = statsList.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      {/* Informative Header */}
      <div className="bg-blue-50/60 border border-blue-200/70 rounded-xl p-4 text-xs text-blue-900 leading-relaxed">
        <strong>Stats Strip Section:</strong> Highlight counters that appear directly below the Hero section. As seen in your screenshot, this displays figures such as &ldquo;25+ Years of UAE Experience&rdquo;, &ldquo;9 Core Services&rdquo;, and &ldquo;7 Emirates Covered&rdquo;. The counter animation automatically scales to whatever number you set.
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statsList.map((stat, idx) => (
          <div
            key={stat.id || idx}
            className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 relative group"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-800">
                Stat Card #{idx + 1}
              </span>
              {statsList.length > 2 && (
                <button
                  type="button"
                  onClick={() => handleRemoveStat(idx)}
                  className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                  title="Remove this stat"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Value & Suffix */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Numeric Value
                </label>
                <input
                  type="number"
                  value={stat.value}
                  onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                  placeholder="25"
                  className="w-full h-9 px-3 rounded-lg text-xs bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Suffix (+, K, %)
                </label>
                <input
                  type="text"
                  value={stat.suffix || ''}
                  onChange={(e) => handleStatChange(idx, 'suffix', e.target.value)}
                  placeholder="+"
                  className="w-full h-9 px-3 rounded-lg text-xs bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>
            </div>

            {/* Label */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Label Text
              </label>
              <input
                type="text"
                value={stat.label || ''}
                onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                placeholder="Years of UAE Experience"
                className="w-full h-9 px-3 rounded-lg text-xs bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900"
              />
            </div>

            {/* Icon */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Icon
              </label>
              <select
                value={stat.icon || 'Award'}
                onChange={(e) => handleStatChange(idx, 'icon', e.target.value)}
                className="w-full h-9 px-2.5 rounded-lg text-xs bg-white border border-slate-200 text-slate-700 focus:outline-none focus:border-slate-900 cursor-pointer"
              >
                {ICON_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      {statsList.length < 4 && (
        <button
          type="button"
          onClick={handleAddStat}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-800 bg-white border border-dashed border-slate-300 hover:border-slate-500 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Highlight Stat</span>
        </button>
      )}
    </div>
  );
}

