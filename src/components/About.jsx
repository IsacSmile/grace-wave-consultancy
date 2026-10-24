import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { aboutData } from '../data/about';
import { useLenis } from './SmoothScroll';
import { useReducedMotion } from '../hooks/useReducedMotion';

import about1000 from '../assets/about/about-1000w.webp';
import about768 from '../assets/about/about-768w.webp';
import about480 from '../assets/about/about-480w.webp';

gsap.registerPlugin(ScrollTrigger);

export function About() {
  const sectionRef = useRef(null);
  const imageWrapperRef = useRef(null);
  const imageInnerRef = useRef(null);
  const floatingCardsRef = useRef(null);
  const textContentRef = useRef(null);

  const { scrollTo } = useLenis();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!sectionRef.current) return;

    const statNumbers = sectionRef.current.querySelectorAll('.about-stat-number');
    const cards = floatingCardsRef.current ? floatingCardsRef.current.children : [];

    // Reduced motion: show final state immediately
    if (prefersReducedMotion) {
      statNumbers.forEach((el, idx) => {
        if (el && aboutData.floatingStats[idx]) {
          el.textContent = aboutData.floatingStats[idx].value.toLocaleString();
        }
      });
      return;
    }

    const ctx = gsap.context(() => {
      // Main Entrance Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
      });

      // 1. Image block entrance (fade + translateY)
      tl.fromTo(
        imageWrapperRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );

      // 2. Floating stat cards pop in with stagger
      tl.fromTo(
        cards,
        { opacity: 0, y: 24, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.15, ease: 'back.out(1.4)' },
        '-=0.4'
      );

      // 3. Stat numbers count up
      statNumbers.forEach((numEl, idx) => {
        const targetVal = aboutData.floatingStats[idx]?.value || 0;
        const counterObj = { val: 0 };

        tl.to(
          counterObj,
          {
            val: targetVal,
            duration: 2.0,
            ease: 'power2.out',
            snap: { val: 1 },
            onUpdate: () => {
              if (numEl) {
                numEl.textContent = Math.round(counterObj.val).toLocaleString();
              }
            },
          },
          '<'
        );
      });

      // 4. Text block elements stagger in
      if (textContentRef.current) {
        const textElements = textContentRef.current.querySelectorAll('.about-reveal-el');
        tl.fromTo(
          textElements,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' },
          '-=1.8'
        );
      }

      // 5. Desktop-only subtle inner image parallax (keeps outer container strictly equal height)
      if (window.innerWidth >= 1024 && imageInnerRef.current) {
        gsap.fromTo(
          imageInnerRef.current,
          { scale: 1.08, yPercent: -4 },
          {
            scale: 1,
            yPercent: 4,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const handleCtaClick = (e) => {
    e.preventDefault();
    scrollTo(aboutData.cta.href, 76);
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      aria-labelledby="about-heading"
      className="relative w-full bg-white py-20 md:py-28 lg:py-32 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-stretch">
          
          {/* ================= COLUMN 1: IMAGE BLOCK (MOBILE FIRST, EQUAL HEIGHT ON LG) ================= */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-stretch w-full h-full">
            <div
              ref={imageWrapperRef}
              className="relative w-full h-full min-h-[380px] sm:min-h-[460px] lg:min-h-full rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 bg-slate-100 flex flex-col"
              style={prefersReducedMotion ? { opacity: 1, transform: 'none' } : undefined}
            >
              {/* Photo Container - Fills 100% of the column height on desktop */}
              <div className="relative w-full h-full min-h-[380px] sm:min-h-[460px] lg:min-h-full flex-1 overflow-hidden aspect-[4/5] lg:aspect-auto">
                <img
                  ref={imageInnerRef}
                  src={about768}
                  srcSet={`${about480} 480w, ${about768} 768w, ${about1000} 1000w`}
                  sizes="(max-width: 640px) 480px, (max-width: 1024px) 768px, 1000px"
                  width={aboutData.image.width}
                  height={aboutData.image.height}
                  alt={aboutData.image.alt}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover object-center transform will-change-transform"
                />

                {/* Subtle gradient overlay at bottom for guaranteed text contrast */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-navy-950/75 via-navy-950/25 to-transparent pointer-events-none"
                  aria-hidden="true"
                />
              </div>

              {/* Two Floating Stat Cards (Overlapping bottom-left of the photo) */}
              <div
                ref={floatingCardsRef}
                className="absolute bottom-4 left-4 right-4 sm:right-auto sm:left-6 sm:bottom-6 flex flex-wrap sm:flex-nowrap gap-3 z-10"
              >
                {aboutData.floatingStats.map((stat) => {
                  const isFrosted = stat.style === 'frosted';

                  return (
                    <div
                      key={stat.id}
                      className={`flex-1 sm:flex-initial rounded-2xl p-3.5 sm:p-4 min-w-[130px] sm:min-w-[150px] shadow-lg transition-transform ${
                        isFrosted
                          ? 'bg-navy-950/40 backdrop-blur-md text-white border border-white/20'
                          : 'bg-[#E0F2FE] border border-sky-200 text-[#0B1B4D]'
                      }`}
                      style={prefersReducedMotion ? { opacity: 1, transform: 'none' } : undefined}
                    >
                      {/* Screen reader full text */}
                      <span className="sr-only">
                        {stat.value}{stat.suffix} {stat.label}
                      </span>

                      {/* Visual Counter + Suffix */}
                      <div
                        aria-hidden="true"
                        className="font-heading font-black text-2xl sm:text-3xl md:text-4xl tracking-tight leading-none"
                      >
                        <span className="about-stat-number">
                          {prefersReducedMotion ? stat.value.toLocaleString() : '0'}
                        </span>
                        <span className={isFrosted ? 'text-[#38BDF8]' : 'text-[#0066FF]'}>
                          {stat.suffix}
                        </span>
                      </div>

                      <div
                        className={`text-[11px] sm:text-xs font-semibold mt-1 leading-tight ${
                          isFrosted ? 'text-slate-100' : 'text-slate-700'
                        }`}
                      >
                        {stat.label}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

          {/* ================= COLUMN 2: TEXT BLOCK ================= */}
          <div
            ref={textContentRef}
            className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center h-full py-1 lg:py-2 text-left relative z-10"
          >
            {/* 0. Subtle Gold Accent Bar */}
            <div
              className="about-reveal-el w-12 h-0.5 bg-[#C5A059] rounded-full mb-5 md:mb-6"
              aria-hidden="true"
            />

            {/* 1. Small Uppercase Badge Pill */}
            <div className="about-reveal-el mb-5 md:mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-200/90 text-[#0B1B4D] text-xs font-semibold uppercase tracking-[0.14em] shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>{aboutData.badge}</span>
              </span>
            </div>

            {/* 2. H2 Heading (Bold Navy, Balanced Line Wrapping) */}
            <h2
              id="about-heading"
              className="about-reveal-el font-heading font-bold text-3xl sm:text-4xl lg:text-5xl xl:text-[3.25rem] text-[#0B1B4D] tracking-tight leading-[1.15] text-balance mb-5 md:mb-6 max-w-xl"
            >
              {aboutData.heading}
            </h2>

            {/* 3. Concise Supporting Paragraph */}
            <p className="about-reveal-el text-base md:text-lg text-slate-600 font-normal leading-[1.7] max-w-xl text-pretty mb-6">
              {aboutData.paragraph}
            </p>

            {/* 4. Three Checklist Items */}
            <div className="about-reveal-el space-y-3.5 mb-8">
              {aboutData.points.map((point) => (
                <div key={point} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                  <span className="text-sm sm:text-base font-semibold text-slate-800">
                    {point}
                  </span>
                </div>
              ))}
            </div>

            {/* 5. CTA Row */}
            <div className="about-reveal-el flex items-center gap-3.5">
              <a
                href={aboutData.cta.href}
                onClick={handleCtaClick}
                className="group inline-flex items-center gap-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-full"
                aria-label={`${aboutData.cta.text} - Navigate to contact form`}
              >
                {/* Circular Brand-Blue Button */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-600 group-hover:bg-blue-700 text-white flex items-center justify-center shadow-md shadow-blue-500/25 group-hover:shadow-lg transition-all transform group-hover:scale-105 active:scale-95 shrink-0">
                  <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                {/* Text Link */}
                <span className="text-base sm:text-lg font-bold text-[#0B1B4D] group-hover:text-blue-600 transition-colors">
                  {aboutData.cta.text}
                </span>
              </a>
            </div>

            {/* Decorative Halftone SVG Grid Pattern (Hidden on mobile) */}
            <div
              className="hidden lg:block absolute -right-4 -bottom-10 w-44 h-44 -z-10 pointer-events-none opacity-20"
              aria-hidden="true"
            >
              <svg width="176" height="176" fill="none" xmlns="http://www.w3.org/2000/svg">
                <pattern id="about-halftone-pattern" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="2" fill="#0066FF" />
                </pattern>
                <rect width="176" height="176" fill="url(#about-halftone-pattern)" />
              </svg>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
