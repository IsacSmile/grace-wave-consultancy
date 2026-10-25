import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Check, Phone, Mail, ArrowUpRight } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { siteConfig } from '../data/siteConfig';
import { useLenis } from './SmoothScroll';

export function ProcessContent({ steps, activeIndex }) {
  const containerRef = useRef(null);
  const [displayedIndex, setDisplayedIndex] = useState(activeIndex);
  const { scrollTo } = useLenis();

  const handleEnquiryClick = (e) => {
    e.preventDefault();
    scrollTo('#contact', 76);
  };

  useEffect(() => {
    if (activeIndex === displayedIndex) return;

    const el = containerRef.current;
    if (!el) {
      setDisplayedIndex(activeIndex);
      return;
    }

    // GSAP imperative change animation:
    // Outgoing block fades and moves y 0 to -12 (0.15s power2.in)
    // Incoming block y 16 to 0 + opacity (0.35s power3.out)
    // gsap.killTweensOf + overwrite "auto" prevents tween stacking on fast scrolling
    gsap.killTweensOf(el);
    gsap.to(el, {
      opacity: 0,
      y: -12,
      duration: 0.15,
      ease: 'power2.in',
      overwrite: 'auto',
      onComplete: () => {
        setDisplayedIndex(activeIndex);
        gsap.fromTo(
          el,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
            ease: 'power3.out',
            overwrite: 'auto',
          }
        );
      },
    });
  }, [activeIndex, displayedIndex]);

  const step = steps[displayedIndex] || steps[0];
  const isFirstStep = displayedIndex === 0;
  const isLastStep = displayedIndex === steps.length - 1;
  const primaryPhone = siteConfig.business.phones[0]?.tel || '+971569148255';
  const whatsappUrl = siteConfig.business.whatsapp;

  return (
    <div
      className="process-content-wrapper absolute z-20 pointer-events-auto"
      style={{
        left: 'var(--content-left)',
        top: 'var(--cy)',
        transform: 'translateY(-50%)',
      }}
    >
      <div
        ref={containerRef}
        className="process-content-inner relative pr-5 sm:pr-8 lg:pr-0 max-w-md lg:max-w-none text-left select-text"
      >
        {/* Decorative 1px horizontal line from right edge of active number to content block (lg+) */}
        <div
          className="process-connector-line hidden lg:block"
          aria-hidden="true"
        />

        {/* Step Title */}
        <h3 className="font-heading font-semibold text-lg sm:text-xl lg:text-[32px] text-[#0A1F4D] tracking-tight leading-snug lg:leading-[1.2]">
          {step.title}
        </h3>

        {/* Thin Gold Underline (32px x 2px) on lg only */}
        <div
          className="hidden lg:block w-8 h-[2px] bg-[#C5A059] my-3.5 lg:my-4 rounded-full"
          aria-hidden="true"
        />

        {/* Step Description */}
        <p className="mt-1.5 lg:mt-0 text-[14px] sm:text-[15px] lg:text-[18px] text-slate-600 leading-[1.6]">
          {step.text}
        </p>

        {/* A. "What happens" checklist: 3 rows, gold Check icon (18px) + text (15px mobile / 17px lg, navy, medium) */}
        {step.points && step.points.length > 0 && (
          <div className="mt-4 lg:mt-6 pt-3.5 lg:pt-5 border-t border-[#0A1F4D]/10">
            <ul className="space-y-2 lg:space-y-2.5">
              {step.points.map((point, idx) => (
                <li
                  key={idx}
                  className={`flex items-center gap-2.5 ${
                    idx === 2 ? 'process-row-3 process-short-hide' : ''
                  }`}
                >
                  <div className="w-[18px] h-[18px] rounded-full bg-[#C5A059]/15 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-[#C5A059] stroke-[2.5]" />
                  </div>
                  <span className="text-[14px] sm:text-[15px] lg:text-[17px] text-[#0A1F4D] font-medium leading-snug">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* B. "What we may need from you" (lg and up only; hidden on mobile) */}
        {step.youProvide && step.youProvide.length > 0 && (
          <div className="process-chips-block hidden lg:block mt-5 lg:mt-6 pt-3.5 lg:pt-5 border-t border-[#0A1F4D]/10">
            <span className="block text-[11px] font-bold text-[#C5A059] uppercase tracking-[0.14em] mb-2">
              What we may need from you
            </span>
            <div className="flex flex-wrap gap-2">
              {step.youProvide.map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs lg:text-sm text-slate-700 bg-slate-50 border border-[#0A1F4D]/[0.12] leading-none"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* C. Step 1 only: Contact row (Call, WhatsApp, Form) */}
        {isFirstStep && (
          <div className="mt-5 lg:mt-6 pt-1 flex items-center gap-2 sm:gap-3">
            {/* Call */}
            <a
              href={`tel:${primaryPhone}`}
              className="h-11 lg:h-12 px-4 lg:px-5 rounded-xl text-xs sm:text-sm font-semibold text-[#0A1F4D] bg-slate-50 hover:bg-slate-100 border border-slate-200/90 shadow-sm transition-all inline-flex items-center justify-center gap-2 flex-1 sm:flex-initial"
            >
              <Phone className="w-3.5 h-3.5 text-gold-600 shrink-0" />
              <span>Call</span>
            </a>

            {/* WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-11 lg:h-12 px-4 lg:px-5 rounded-xl text-xs sm:text-sm font-semibold text-emerald-950 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/90 shadow-sm transition-all inline-flex items-center justify-center gap-2 flex-1 sm:flex-initial"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>WhatsApp</span>
            </a>

            {/* Form (hidden on mobile, visible sm+) */}
            <a
              href="#contact"
              onClick={handleEnquiryClick}
              className="hidden sm:inline-flex h-11 lg:h-12 px-4 lg:px-5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-navy-950 hover:bg-navy-900 shadow-sm transition-all items-center justify-center gap-2"
            >
              <Mail className="w-3.5 h-3.5 text-gold-400 shrink-0" />
              <span>Form</span>
            </a>
          </div>
        )}

        {/* D. Step 4 only: "Start your enquiry" button */}
        {isLastStep && (
          <div className="mt-5 lg:mt-6 pt-1">
            <a
              href="#contact"
              onClick={handleEnquiryClick}
              className="h-12 px-6 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 active:scale-[0.99] transition-all inline-flex items-center justify-center gap-2 min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <span>Start your enquiry</span>
              <ArrowUpRight className="w-4 h-4 shrink-0" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
