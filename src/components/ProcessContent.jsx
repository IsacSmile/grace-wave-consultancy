import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowUpRight } from 'lucide-react';
import { useLenis } from './SmoothScroll';

export function ProcessContent({ steps, activeIndex }) {
  const containerRef = useRef(null);
  const [displayedIndex, setDisplayedIndex] = useState(activeIndex);
  const prevIndexRef = useRef(activeIndex);
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
    // Outgoing block fades and moves y 0 to -8 (0.15s power2.in)
    // Incoming block y 10 to 0 + opacity (0.35s power3.out)
    // gsap.killTweensOf + overwrite "auto" prevents tween stacking on fast scrolling
    gsap.killTweensOf(el);
    gsap.to(el, {
      opacity: 0,
      y: -8,
      duration: 0.15,
      ease: 'power2.in',
      overwrite: 'auto',
      onComplete: () => {
        setDisplayedIndex(activeIndex);
        gsap.fromTo(
          el,
          { opacity: 0, y: 10 },
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
  const isLastStep = displayedIndex === steps.length - 1;

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
        className="process-content-inner pr-5 sm:pr-8 max-w-[calc(100vw-var(--content-left)-20px)] lg:max-w-md"
      >
        {/* Title */}
        <h3 className="font-heading font-semibold text-base sm:text-lg lg:text-[28px] text-[#0A1F4D] tracking-tight leading-snug">
          {step.title}
        </h3>

        {/* Thin Gold Underline (32px x 2px) between title and text on lg only */}
        <div
          className="hidden lg:block w-8 h-[2px] bg-[#C5A059] my-4 rounded-full"
          aria-hidden="true"
        />

        {/* Description */}
        <p className="mt-2 lg:mt-0 text-[15px] lg:text-[18px] text-slate-600 leading-[1.6] line-clamp-4 lg:line-clamp-none">
          {step.text}
        </p>

        {/* Last Step Only: "Start your enquiry" button */}
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
