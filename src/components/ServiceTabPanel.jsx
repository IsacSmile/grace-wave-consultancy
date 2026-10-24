import React, { useState } from 'react';
import { ChevronDown, ArrowUpRight, TrendingUp, Compass, FileText } from 'lucide-react';
import { useLenis } from './SmoothScroll';
import { aboutData } from '../data/about';

const iconMap = {
  TrendingUp,
  Compass,
  FileText,
};

export function ServiceTabPanel({
  tab,
  isActive,
  imageRef,
  itemsRef,
  counterRef,
}) {
  const [openIndex, setOpenIndex] = useState(0);
  const { scrollTo } = useLenis();

  const expStat = aboutData.floatingStats[0] || {
    value: 25,
    suffix: '+',
    label: 'Years of UAE experience',
  };

  const handleEnquireClick = (e) => {
    e.preventDefault();
    window.dispatchEvent(
      new CustomEvent('enquiry:select-service', { detail: tab.serviceValue })
    );
    scrollTo('#contact', 76);
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      {/* Mobile: Image block is FIRST (order-1 lg:order-2) */}
      <div className="order-1 lg:order-2 lg:col-span-5 w-full flex justify-center lg:justify-end">
        <div className="relative rounded-3xl overflow-hidden w-full max-w-[360px] sm:max-w-[400px] lg:max-w-[440px] aspect-[4/3] lg:aspect-[4/5] bg-slate-100 shadow-sm border border-[#0B1B4D]/5">
          <img
            ref={imageRef}
            src={tab.image}
            alt={tab.imageAlt}
            width="800"
            height="1000"
            loading={isActive ? 'eager' : 'lazy'}
            decoding={isActive ? 'sync' : 'async'}
            className="w-full h-full object-cover object-center will-change-transform"
          />

          {/* Contrast Bottom Gradient */}
          <div
            className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#060E18]/85 via-[#060E18]/25 to-transparent"
            aria-hidden="true"
          />

          {/* Overlaid Dark Info Card (bottom-left): sleek & compact on mobile, scaled on desktop */}
          <div className="absolute bottom-2 left-2 xs:bottom-2.5 xs:left-2.5 sm:bottom-3 sm:left-3 md:bottom-5 md:left-5 z-10 bg-[#0B1B4D]/95 text-white rounded-xl sm:rounded-2xl p-2 xs:p-2.5 sm:p-3.5 md:p-5 max-w-[145px] xs:max-w-[160px] sm:max-w-[200px] md:max-w-[250px] shadow-lg border border-white/10 backdrop-blur-sm">
            {/* Top Row: Label + circular link button */}
            <div className="flex items-center justify-between gap-1.5 xs:gap-2 mb-1 xs:mb-1.5 md:mb-2.5">
              <span className="text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs font-semibold tracking-wider text-[#C5A059] uppercase truncate">
                UAE Experience
              </span>
              <button
                type="button"
                onClick={handleEnquireClick}
                aria-label={`Enquire about ${tab.tabLabel} UAE experience`}
                className="w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors relative before:absolute before:-inset-2 before:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white shrink-0"
              >
                <ArrowUpRight className="w-2.5 h-2.5 xs:w-3 xs:h-3 md:w-4 md:h-4 text-white" />
              </button>
            </div>

            {/* Bottom Row: Counter + Description */}
            <div className="space-y-0.5">
              <div className="flex items-baseline gap-0.5 xs:gap-1">
                <span
                  ref={counterRef}
                  className="font-heading font-black text-base xs:text-lg sm:text-2xl md:text-3xl text-white tracking-tight"
                  aria-label={`${expStat.value}${expStat.suffix} Years of UAE market experience`}
                >
                  {expStat.value}
                </span>
                <span className="font-heading font-bold text-xs xs:text-sm sm:text-xl md:text-2xl text-[#C5A059]">
                  {expStat.suffix}
                </span>
              </div>
              <p className="text-[8px] xs:text-[9px] sm:text-xs md:text-sm text-slate-300 font-medium leading-tight line-clamp-2 sm:line-clamp-none">
                Years of UAE market experience
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Left Column (Text): order-2 lg:order-1 */}
      <div className="order-2 lg:order-1 lg:col-span-7 w-full flex flex-col justify-start">
        {/* Intro with 2px gold vertical bar */}
        <div className="border-l-2 border-[#C5A059] pl-5 mb-6 md:mb-8">
          <p className="text-base sm:text-lg lg:text-xl font-medium text-[#0B1B4D] leading-[1.65]">
            {tab.intro}
          </p>
        </div>

        {/* ================= LAYOUT 1: Accordion (Accounting & Bookkeeping) ================= */}
        {tab.type === 'accordion' && (
          <div className="w-full">
            <div ref={itemsRef} className="space-y-3.5 w-full">
              {tab.items?.map((item, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div
                    key={item.title}
                    className={`service-accordion-item rounded-2xl border transition-all duration-300 overflow-hidden ${
                      isOpen
                        ? 'bg-[#F4F6FB] border-[#C5A059]/40 border-l-4 border-l-[#C5A059] shadow-xs'
                        : 'bg-white border-[#0B1B4D]/10 hover:border-[#0B1B4D]/20'
                    }`}
                  >
                    {/* Header Button (min 56px tall) */}
                    <button
                      type="button"
                      id={`accordion-btn-${tab.id}-${idx}`}
                      aria-expanded={isOpen}
                      aria-controls={`accordion-body-${tab.id}-${idx}`}
                      onClick={() => setOpenIndex((prev) => (prev === idx ? -1 : idx))}
                      className="w-full text-left min-h-[56px] px-5 py-4 flex items-center justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-2xl transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xs sm:text-sm font-bold text-[#C5A059] tabular-nums tracking-wider shrink-0 font-mono">
                          {String(idx + 1).padStart(2, '0')}.
                        </span>
                        <span className="text-base md:text-lg font-semibold text-[#0B1B4D]">
                          {item.title}
                        </span>
                      </div>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-300 ${
                            isOpen ? 'rotate-180 text-[#C5A059]' : 'text-slate-400'
                          }`}
                          aria-hidden="true"
                        />
                      </div>
                    </button>

                    {/* Animated Body */}
                    <div
                      id={`accordion-body-${tab.id}-${idx}`}
                      role="region"
                      aria-labelledby={`accordion-btn-${tab.id}-${idx}`}
                      className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                        isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="px-5 pb-5 pt-1 text-[15px] text-slate-600 leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 md:mt-8">
              <button
                type="button"
                onClick={handleEnquireClick}
                className="h-12 px-6 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 active:scale-[0.99] transition-all inline-flex items-center justify-center gap-2 w-full sm:w-auto min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <span>Enquire about {tab.tabLabel}</span>
                <ArrowUpRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </div>
        )}

        {/* ================= LAYOUT 2: 2-Column Bullet List (Taxation & Compliance - Image 1) ================= */}
        {tab.type === 'bullets' && (
          <div className="w-full">
            <div
              ref={itemsRef}
              className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-8 pt-1"
            >
              {tab.bullets?.map((bullet) => (
                <div
                  key={bullet}
                  className="service-panel-item flex items-center gap-3 py-1"
                >
                  <span className="text-[#C5A059] text-xs font-black shrink-0 leading-none">
                    ◆
                  </span>
                  <span className="text-sm sm:text-base font-semibold text-[#0B1B4D]">
                    {bullet}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 sm:mt-6">
              <button
                type="button"
                onClick={handleEnquireClick}
                className="h-12 px-7 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 active:scale-[0.99] transition-all inline-flex items-center justify-center gap-2 w-full sm:w-auto min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <span>Enquire about {tab.tabLabel}</span>
                <ArrowUpRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </div>
        )}

        {/* ================= LAYOUT 3: 3 Icon-Tile Feature Blocks (Audit & Advisory - Image 2) ================= */}
        {tab.type === 'features' && (
          <div className="w-full">
            <div ref={itemsRef} className="space-y-5 sm:space-y-6 mb-8 pt-1">
              {tab.features?.map((feat) => {
                const IconComponent = iconMap[feat.icon] || TrendingUp;
                return (
                  <div
                    key={feat.title}
                    className="service-panel-item flex items-start gap-4 sm:gap-4.5"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#0B1B4D] text-[#C5A059] flex items-center justify-center shrink-0 shadow-sm border border-[#0B1B4D]/10 mt-0.5">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-heading font-bold text-base sm:text-lg text-[#0B1B4D] leading-snug">
                        {feat.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1">
                        {feat.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 sm:mt-6">
              <button
                type="button"
                onClick={handleEnquireClick}
                className="h-12 px-7 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 active:scale-[0.99] transition-all inline-flex items-center justify-center gap-2 w-full sm:w-auto min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <span>Enquire about {tab.tabLabel}</span>
                <ArrowUpRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
