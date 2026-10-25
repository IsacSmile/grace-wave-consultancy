import React, { useRef } from 'react';
import {
  BookOpenCheck,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  ArrowUpRight,
  ChevronDown,
  Check,
} from 'lucide-react';

const iconMap = {
  BookOpenCheck,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
};

/**
 * ServiceRow
 * Renders a single service row.
 * Handles desktop list view with cursor/keyboard previews and dimming,
 * as well as mobile/touch accordion view with smooth inline drawer expansion.
 */
export function ServiceRow({
  service,
  index,
  isOpen,
  onToggle,
  isHovered,
  isAnyHovered,
  onHover,
  onFocus,
  onBlur,
  onOverExpanded,
  isHoverCapable,
  prefersReducedMotion,
  onEnquire,
}) {
  const rowRef = useRef(null);
  const IconComponent = iconMap[service.icon] || BookOpenCheck;

  // Dimming logic for desktop: when another row is hovered, this row dims to 0.35 opacity
  const shouldDim =
    isHoverCapable && !prefersReducedMotion && isAnyHovered && !isHovered && !isOpen;

  return (
    <li
      ref={rowRef}
      className={`relative w-full border-b border-[#0A1F4D]/10 transition-opacity duration-300 ease-out ${
        shouldDim ? 'opacity-35' : 'opacity-100'
      }`}
    >
      {/* Interactive Trigger Row Button */}
      <button
        type="button"
        id={`service-header-${service.id}`}
        aria-expanded={isOpen}
        aria-controls={`service-panel-${service.id}`}
        onClick={() => onToggle(service.id, rowRef.current)}
        onMouseEnter={() => onHover(index)}
        onMouseLeave={() => onHover(-1)}
        onFocus={(e) => onFocus(index, e.currentTarget)}
        onBlur={onBlur}
        className="w-full text-left py-5 px-0 lg:py-10 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 transition-colors cursor-pointer select-none min-h-[72px] lg:min-h-0 active:bg-[#0A1F4D]/[0.03] lg:active:bg-transparent lg:rounded-xl"
      >
        {/* ================= DESKTOP LAYOUT (lg and up) ================= */}
        <div className="hidden lg:grid lg:grid-cols-12 lg:gap-6 lg:items-center">
          {/* Col 1: Index + Icon Tile (cols 1-3) */}
          <div className="lg:col-span-3 flex items-center gap-4 xl:gap-5">
            <span className="font-mono text-xl xl:text-2xl font-bold text-[#C5A059] tracking-wider shrink-0 w-8">
              {service.index}
            </span>
            <div className="w-12 h-12 xl:w-14 xl:h-14 rounded-2xl bg-[#0A1F4D] text-[#D4AF37] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300">
              <IconComponent className="w-6 h-6 xl:w-7 xl:h-7" />
            </div>
          </div>

          {/* Col 2: Large Title (cols 4-7) */}
          <div className="lg:col-span-5">
            <h3 className="font-heading font-bold text-2xl lg:text-3xl xl:text-4xl text-[#0B1B4D] tracking-tight transition-transform duration-300 ease-out group-hover:translate-x-3">
              {service.title}
            </h3>
          </div>

          {/* Col 3: One-line Short Description (cols 8-11) */}
          <div className="lg:col-span-3">
            <p className="text-slate-600 text-sm xl:text-base line-clamp-1">
              {service.short}
            </p>
          </div>

          {/* Col 4: Circular Arrow Button (col 12) */}
          <div className="lg:col-span-1 flex justify-end">
            <div
              className={`w-12 h-12 rounded-full border border-[#0B1B4D]/20 flex items-center justify-center shrink-0 transition-all duration-300 ${
                isOpen
                  ? 'bg-[#0A1F4D] border-[#0A1F4D] text-[#D4AF37] rotate-90'
                  : 'group-hover:bg-[#0A1F4D] group-hover:border-[#0A1F4D] group-hover:text-[#D4AF37] group-hover:rotate-45 text-[#0B1B4D]'
              }`}
            >
              <ArrowUpRight className="w-5 h-5 transition-transform duration-300" />
            </div>
          </div>
        </div>

        {/* ================= MOBILE / TOUCH LAYOUT (< lg) ================= */}
        <div className="lg:hidden grid grid-cols-[44px_1fr_36px] items-center gap-4 w-full">
          {/* Col 1: 44px Icon Tile */}
          <div className="w-[44px] h-[44px] rounded-xl bg-[#0A1F4D] text-[#D4AF37] flex items-center justify-center shrink-0">
            <IconComponent className="w-5 h-5" />
          </div>

          {/* Col 2: Text Column (small index above title) */}
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] tracking-[0.18em] font-medium text-[#C5A059] mb-0.5">
              {service.index}
            </span>
            <h3 className="text-[17px] font-semibold text-[#0B1B4D] leading-[1.3] tracking-tight text-balance">
              {service.title}
            </h3>
          </div>

          {/* Col 3: 36px Chevron Circle */}
          <div className="flex justify-end shrink-0">
            <div className="w-9 h-9 rounded-full bg-white border border-[#0A1F4D]/15 flex items-center justify-center shrink-0">
              <ChevronDown
                className={`w-4 h-4 text-[#0B1B4D] transition-transform duration-300 transform-gpu ${
                  isOpen ? 'rotate-180' : 'rotate-0'
                }`}
              />
            </div>
          </div>
        </div>
      </button>

      {/* Bottom Hairline: Gold line that draws in on hover/open */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C5A059] origin-left pointer-events-none transition-transform duration-300 ease-out z-10"
        style={{
          transform: isHovered || isOpen ? 'scaleX(1)' : 'scaleX(0)',
        }}
        aria-hidden="true"
      />

      {/* ================= EXPANDED ACCORDION PANEL ================= */}
      <div
        id={`service-panel-${service.id}`}
        role="region"
        aria-labelledby={`service-header-${service.id}`}
        onMouseEnter={() => onOverExpanded(true)}
        onMouseLeave={() => onOverExpanded(false)}
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${
          isOpen
            ? 'grid-rows-[1fr] opacity-100'
            : 'grid-rows-[0fr] opacity-0 pointer-events-none'
        }`}
      >
        <div className="overflow-hidden">
          <div className="pt-1 pb-6 lg:pb-6 lg:pt-1.5">
            {/* --- Mobile View Order: Image -> Intro Line -> Bullets -> Enquire Button --- */}
            <div className="lg:hidden flex flex-col">
              {/* 1. Image: aspect-[16/10], rounded-2xl, object-cover, no shadow */}
              <div className="overflow-hidden rounded-2xl">
                <img
                  src={service.image}
                  alt={service.imageAlt}
                  width="800"
                  height="500"
                  loading="lazy"
                  className={`w-full aspect-[16/10] object-cover transition-all duration-500 ease-out transform-gpu ${
                    isOpen ? 'scale-100 opacity-100' : 'scale-[1.04] opacity-0'
                  }`}
                />
              </div>

              {/* 2. Intro line: 12px gap (mt-3), text-[15px], slate-600, leading-relaxed, max 2 to 3 lines */}
              <p className="mt-3 text-[15px] text-slate-600 leading-relaxed font-normal line-clamp-3">
                {service.description}
              </p>

              {/* 3. 3 short bullets: 12px gap (mt-3), gold check 18px, text-[15px] medium, navy, gap-2.5 */}
              <ul className="mt-3 flex flex-col gap-2.5">
                {service.bullets.map((bullet, bIdx) => (
                  <li key={bIdx} className="flex items-center gap-2.5">
                    <Check
                      className="w-[18px] h-[18px] text-[#C5A059] shrink-0"
                      strokeWidth={2.5}
                    />
                    <span className="text-[15px] font-medium text-[#0B1B4D] leading-snug">
                      {bullet}
                    </span>
                  </li>
                ))}
              </ul>

              {/* 4. Enquire Now button: 20px gap (mt-5), full-width, h-12, rounded-xl, text-[15px], brand blue */}
              <button
                type="button"
                onClick={() => onEnquire(service.serviceValue)}
                className="mt-5 w-full h-12 rounded-xl text-[15px] font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                <span>Enquire Now</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            {/* --- Desktop View: Editorial 2-Column Expansion --- */}
            <div className="hidden lg:grid lg:grid-cols-12 lg:gap-6 items-center bg-white/70 backdrop-blur-md rounded-2xl p-5 xl:p-6 border border-slate-200/80 shadow-xs">
              <div className="lg:col-span-4 rounded-xl overflow-hidden shadow-sm aspect-[4/3] max-h-[220px]">
                <img
                  src={service.image}
                  alt={service.imageAlt}
                  width="800"
                  height="1000"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="lg:col-span-8 flex flex-col justify-between h-full py-1">
                <div>
                  <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-3.5 line-clamp-2">
                    {service.description}
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-3 gap-2.5 xl:gap-3 mb-5">
                    {service.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-50 text-[#C5A059] flex items-center justify-center shrink-0 border border-[#C5A059]/30">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                        <span className="text-sm xl:text-base text-[#0B1B4D] font-medium leading-snug">
                          {bullet}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => onEnquire(service.serviceValue)}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 xl:py-3 rounded-xl text-base font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 active:scale-[0.99] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer whitespace-nowrap"
                  >
                    <span>Enquire about {service.title}</span>
                    <ArrowUpRight className="w-4 h-4 shrink-0" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </li>
  );
}
