import React, { useState } from 'react';
import { ChevronDown, ArrowUpRight } from 'lucide-react';
import { useLenis } from './SmoothScroll';
import { aboutData } from '../data/about';

export function ServiceTabPanel({
  tab,
  isActive,
  panelRef,
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
    <div
      ref={panelRef}
      className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
    >
      {/* Mobile: Image block is FIRST (order-1 lg:order-2) */}
      <div className="order-1 lg:order-2 lg:col-span-6 w-full">
        <div className="relative rounded-3xl overflow-hidden w-full aspect-[4/3] lg:aspect-[4/5] bg-slate-100 shadow-sm border border-[#0B1B4D]/5">
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

          {/* Overlaid Dark Info Card (bottom-left) */}
          <div className="absolute bottom-3 left-3 md:bottom-6 md:left-6 z-10 bg-[#0B1B4D]/95 text-white rounded-2xl p-4 md:p-6 max-w-[280px] shadow-xl border border-white/10 backdrop-blur-sm">
            {/* Top Row: Label + 44px circular link button */}
            <div className="flex items-center justify-between gap-4 mb-3">
              <span className="text-[10px] md:text-xs font-semibold tracking-widest text-[#C5A059] uppercase">
                UAE Experience
              </span>
              <button
                type="button"
                onClick={handleEnquireClick}
                aria-label={`Enquire about ${tab.tabLabel} UAE experience`}
                className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors min-h-[44px] min-w-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white shrink-0"
              >
                <ArrowUpRight className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Bottom Row: Counter + Description */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-1">
                <span
                  ref={counterRef}
                  className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight"
                  aria-label={`${expStat.value}${expStat.suffix} Years of UAE market experience`}
                >
                  {expStat.value}
                </span>
                <span className="font-heading font-bold text-xl sm:text-2xl text-[#C5A059]">
                  {expStat.suffix}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-snug">
                Years of UAE market experience
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Left Column (Text): order-2 lg:order-1 */}
      <div className="order-2 lg:order-1 lg:col-span-6 w-full flex flex-col justify-start">
        {/* 1. Intro with 2px gold vertical bar */}
        <div className="border-l-2 border-[#C5A059] pl-5 mb-6 md:mb-8">
          <p className="text-lg md:text-xl font-medium text-[#0B1B4D] leading-[1.6] line-clamp-3">
            {tab.intro}
          </p>
        </div>

        {/* 2. Numbered Item List (Accordion, ONE open at a time) */}
        <div ref={itemsRef} className="space-y-3.5 w-full">
          {tab.items.map((item, idx) => {
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
                  onClick={() => setOpenIndex(prev => prev === idx ? -1 : idx)}
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

                {/* Animated Body (grid-template-rows 0fr to 1fr) */}
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

        {/* 3. Enquire Action Button */}
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
    </div>
  );
}
