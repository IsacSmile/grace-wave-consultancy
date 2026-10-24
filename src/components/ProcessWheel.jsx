import React from 'react';

export function ProcessWheel({
  steps,
  wheelRef,
  arcRef,
  itemRefs,
  activeIndex,
  onStepSelect,
}) {
  const handleKeyDown = (e, idx) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIdx = Math.min(idx + 1, steps.length - 1);
      onStepSelect(nextIdx);
      const nextBtn = itemRefs.current[nextIdx]?.querySelector('button');
      nextBtn?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIdx = Math.max(idx - 1, 0);
      onStepSelect(prevIdx);
      const prevBtn = itemRefs.current[prevIdx]?.querySelector('button');
      prevBtn?.focus();
    }
  };

  return (
    <div
      ref={wheelRef}
      className="process-wheel-center absolute top-0 left-0 w-0 h-0 pointer-events-none will-change-transform z-10"
      style={{
        left: 'calc(var(--dotX) - var(--R))',
        top: 'var(--cy)',
        transformOrigin: '0 0',
      }}
      aria-hidden="true"
    >
      {/* Huge Circle Arc: center is at wheel origin, width/height = 2*R, left/top = -R */}
      <div
        ref={arcRef}
        className="process-arc absolute rounded-full border border-[#0A1F4D]/[0.12] pointer-events-none"
        style={{
          width: 'calc(2 * var(--R))',
          height: 'calc(2 * var(--R))',
          left: 'calc(-1 * var(--R))',
          top: 'calc(-1 * var(--R))',
        }}
        aria-hidden="true"
      />

      {/* Step Items positioned along the wheel circumference */}
      {steps.map((step, idx) => (
        <div
          key={step.id}
          ref={(el) => (itemRefs.current[idx] = el)}
          className="process-wheel-item absolute top-0 left-0 flex items-center pointer-events-auto"
          style={{
            '--d': idx,
            transformOrigin: '0 0',
            transform: `rotate(calc(${idx} * var(--step))) translate(var(--R), -50%)`,
          }}
          data-hidden={idx > 1}
        >
          {/* Dot on the Arc (centered exactly on circumference at translateX(-50%)) */}
          <div
            className="process-step-dot absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
            aria-hidden="true"
          />

          {/* Step Number: Tilted with wheel, button with 48px hit area and focus ring */}
          <button
            type="button"
            onClick={() => onStepSelect(idx)}
            onFocus={() => onStepSelect(idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className="process-step-num ml-4 sm:ml-6 font-heading font-extrabold text-5xl sm:text-6xl lg:text-8xl tracking-tight leading-none min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 cursor-pointer select-none text-left"
            aria-label={`Step ${step.number}: ${step.title}`}
            aria-current={activeIndex === idx ? 'step' : undefined}
          >
            {step.number}
          </button>
        </div>
      ))}
    </div>
  );
}
