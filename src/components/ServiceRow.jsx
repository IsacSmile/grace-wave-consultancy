import React, { useRef } from 'react';
import {
  BookOpenCheck,
  ShieldAlert,
  TrendingUp,
  ArrowUpRight,
  ChevronDown,
  Check,
} from 'lucide-react';

const iconMap = {
  BookOpenCheck,
  ShieldAlert,
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
        onMouseLeave={() => onHover(null)}
        onFocus={(e) => onFocus(index, e.currentTarget)}
        onBlur={onBlur}
        className="w-full text-left py-6 sm:py-8 lg:py-10 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 rounded-xl transition-colors cursor-pointer select-none"
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
        <div className="lg:hidden flex items-center justify-between gap-3 min-h-[64px]">
          <div className="flex items-center gap-3.5 flex-1 min-w-0">
            <span className="font-mono text-base font-bold text-[#C5A059] shrink-0">
              {service.index}
            </span>
            <div className="w-11 h-11 rounded-2xl bg-[#0A1F4D] text-[#D4AF37] flex items-center justify-center shrink-0 shadow-sm">
              <IconComponent className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-lg xs:text-xl text-[#0B1B4D] leading-snug truncate">
              {service.title}
            </h3>
          </div>

          <div className="shrink-0 pl-2">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 ${
                isOpen
                  ? 'bg-[#0A1F4D] text-[#D4AF37] border-[#0A1F4D] rotate-180'
                  : 'bg-white text-slate-500 border-slate-200'
              }`}
            >
              <ChevronDown className="w-5 h-5" />
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
          <div className="pb-8 pt-2">
            {/* --- Mobile View Order: Image -> Description -> Bullets -> Enquire Button --- */}
            <div className="lg:hidden flex flex-col gap-5">
              <div className="overflow-hidden rounded-2xl bg-slate-100 border border-slate-200/80 shadow-xs">
                <img
                  src={service.image}
                  alt={service.imageAlt}
                  width="800"
                  height="1000"
                  loading="lazy"
                  className={`w-full aspect-[16/10] object-cover transition-all duration-500 ease-out ${
                    isOpen ? 'scale-100 opacity-100' : 'scale-105 opacity-80'
                  }`}
                />
              </div>

              <p className="text-base text-slate-600 leading-relaxed font-normal">
                {service.description}
              </p>

              <ul className="space-y-3">
                {service.bullets.map((bullet, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-amber-50 text-[#C5A059] flex items-center justify-center shrink-0 mt-0.5 border border-[#C5A059]/30">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-sm xs:text-base text-slate-700 font-medium leading-snug">
                      {bullet}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => onEnquire(service.serviceValue)}
                className="w-full h-12 rounded-xl text-base font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.99] transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer"
              >
                <span>Enquire Now</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            {/* --- Desktop View: Editorial 2-Column Expansion --- */}
            <div className="hidden lg:grid lg:grid-cols-12 lg:gap-8 items-center bg-white/70 backdrop-blur-md rounded-2xl p-6 xl:p-8 border border-slate-200/80 shadow-xs">
              <div className="lg:col-span-4 rounded-xl overflow-hidden shadow-sm aspect-[4/3] max-h-[280px]">
                <img
                  src={service.image}
                  alt={service.imageAlt}
                  width="800"
                  height="1000"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="lg:col-span-8 flex flex-col justify-between h-full">
                <div>
                  <p className="text-slate-600 text-base xl:text-lg leading-relaxed mb-5">
                    {service.description}
                  </p>
                  <ul className="grid grid-cols-1 gap-2.5 mb-6">
                    {service.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-amber-50 text-[#C5A059] flex items-center justify-center shrink-0 mt-0.5 border border-[#C5A059]/30">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                        <span className="text-sm xl:text-base text-slate-700 font-medium">
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
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 active:scale-[0.99] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer"
                  >
                    <span>Enquire about {service.title}</span>
                    <ArrowUpRight className="w-4 h-4" />
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
