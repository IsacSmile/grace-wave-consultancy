import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export function ProcessEditor({ data, onChange }) {
  const [activeStepIdx, setActiveStepIdx] = useState(0);

  const steps = Array.isArray(data.steps) ? data.steps : [];
  const currentStep = steps[activeStepIdx] || steps[0] || {};

  const handleGlobalChange = (field, value) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handleCurrentStepChange = (field, value) => {
    const updatedSteps = [...steps];
    updatedSteps[activeStepIdx] = {
      ...updatedSteps[activeStepIdx],
      [field]: value,
    };
    handleGlobalChange('steps', updatedSteps);
  };

  // Checklist points handlers
  const handlePointChange = (idx, value) => {
    const points = [...(currentStep.points || [])];
    points[idx] = value;
    handleCurrentStepChange('points', points);
  };

  const handleAddPoint = () => {
    const points = [...(currentStep.points || [])];
    points.push('New step deliverable');
    handleCurrentStepChange('points', points);
  };

  const handleRemovePoint = (idx) => {
    const points = [...(currentStep.points || [])];
    if (points.length <= 1) return;
    points.splice(idx, 1);
    handleCurrentStepChange('points', points);
  };

  // youProvide tags handlers ("What we may need from you")
  const handleTagChange = (idx, value) => {
    const tags = [...(currentStep.youProvide || [])];
    tags[idx] = value;
    handleCurrentStepChange('youProvide', tags);
  };

  const handleAddTag = () => {
    const tags = [...(currentStep.youProvide || [])];
    tags.push('Required document or info');
    handleCurrentStepChange('youProvide', tags);
  };

  const handleRemoveTag = (idx) => {
    const tags = [...(currentStep.youProvide || [])];
    if (tags.length <= 1) return;
    tags.splice(idx, 1);
    handleCurrentStepChange('youProvide', tags);
  };

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Global Badge */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 shadow-2xs">
        <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
          Section Badge Tag
        </label>
        <input
          type="text"
          value={data.badge || ''}
          onChange={(e) => handleGlobalChange('badge', e.target.value)}
          placeholder="HOW WE WORK"
          className="w-full sm:w-72 h-11 px-4 rounded-xl text-sm bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900 shadow-2xs transition-colors"
        />
      </div>

      {/* Step Switcher */}
      <div>
        <div className="flex border-b border-slate-200 gap-3">
          {steps.map((step, idx) => (
            <button
              key={step.id || idx}
              type="button"
              onClick={() => setActiveStepIdx(idx)}
              className={`pb-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
                activeStepIdx === idx
                  ? 'border-[#C5A059] text-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              Step {step.number || `0${idx + 1}`}: {step.title || 'Untitled'}
            </button>
          ))}
        </div>
      </div>

      {/* Step Card Editor */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 space-y-6 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
              Step Number
            </label>
            <input
              type="text"
              value={currentStep.number || ''}
              onChange={(e) => handleCurrentStepChange('number', e.target.value)}
              placeholder="01"
              className="w-full h-11 px-4 rounded-xl text-sm bg-white border border-slate-200 font-mono font-bold shadow-2xs"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
              Step Title
            </label>
            <input
              type="text"
              value={currentStep.title || ''}
              onChange={(e) => handleCurrentStepChange('title', e.target.value)}
              placeholder="Enquiry"
              className="w-full h-11 px-4 rounded-xl text-sm bg-white border border-slate-200 font-semibold shadow-2xs"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
              Step Narrative Description
            </label>
            <textarea
              rows={3}
              value={currentStep.text || ''}
              onChange={(e) => handleCurrentStepChange('text', e.target.value)}
              placeholder="Reach us by form, call or WhatsApp and tell us what you need."
              className="w-full p-3.5 rounded-xl text-sm bg-white border border-slate-200 leading-relaxed shadow-2xs"
            />
          </div>
        </div>

        {/* Checklist Points */}
        <div className="pt-6 border-t border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <h5 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
              Checklist Bullet Points
            </h5>
            <button
              type="button"
              onClick={handleAddPoint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-semibold cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Point</span>
            </button>
          </div>

          <div className="space-y-3">
            {(currentStep.points || []).map((point, pIdx) => (
              <div key={pIdx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-200 shadow-2xs">
                <span className="text-emerald-600 font-bold text-sm">✓</span>
                <input
                  type="text"
                  value={point}
                  onChange={(e) => handlePointChange(pIdx, e.target.value)}
                  className="flex-1 h-10 px-3.5 rounded-lg text-sm bg-white border border-slate-200"
                />
                {(currentStep.points || []).length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemovePoint(pIdx)}
                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-white"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* What we may need from you tags */}
        <div className="pt-6 border-t border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
                What We May Need From You (Requirement Chips)
              </h5>
              <span className="text-xs text-slate-500">
                Pill tags displayed below the step checklist
              </span>
            </div>
            <button
              type="button"
              onClick={handleAddTag}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-semibold cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Chip</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(currentStep.youProvide || []).map((tag, tIdx) => (
              <div key={tIdx} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50/80 border border-slate-200 shadow-2xs">
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => handleTagChange(tIdx, e.target.value)}
                  placeholder="e.g. Your business name"
                  className="flex-1 h-9 px-3 rounded-lg text-sm bg-white border border-slate-200 font-medium"
                />
                {(currentStep.youProvide || []).length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tIdx)}
                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-white"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

