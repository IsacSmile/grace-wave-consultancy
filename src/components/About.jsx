import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Check } from 'lucide-react';
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
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' }
      );

      // 2. Floating stat cards pop in with stagger
      tl.fromTo(
        cards,
        { opacity: 0, y: 20, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.12, ease: 'power2.out' },
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
            duration: 1.8,
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
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: 'power3.out' },
          '-=1.6'
        );
      }

      // 5. Desktop-only subtle inner image parallax
      if (window.innerWidth >= 1024 && imageInnerRef.current) {
        gsap.fromTo(
          imageInnerRef.current,
          { scale: 1.05, yPercent: -3 },
          {
            scale: 1,
            yPercent: 3,
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
      className="relative w-full bg-white py-18 md:py-24 lg:py-28 overflow-hidden border-b border-slate-200/60"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-stretch">
          
          {/* ================= COLUMN 1: IMAGE BLOCK ================= */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-stretch w-full h-full">
            <div
              ref={imageWrapperRef}
              className="relative w-full h-full min-h-[380px] sm:min-h-[440px] lg:min-h-full rounded-2xl overflow-hidden shadow-sm border border-slate-200/90 bg-slate-100 flex flex-col"
              style={prefersReducedMotion ? { opacity: 1, transform: 'none' } : undefined}
            >
              {/* Photo Container */}
              <div className="relative w-full h-full min-h-[380px] sm:min-h-[440px] lg:min-h-full flex-1 overflow-hidden aspect-[4/5] lg:aspect-auto">
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
                  className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/30 to-transparent pointer-events-none"
                  aria-hidden="true"
                />
              </div>

              {/* Two Unified Floating Stat Cards */}
              <div
                ref={floatingCardsRef}
                className="absolute bottom-4 left-4 right-4 sm:right-auto sm:left-6 sm:bottom-6 flex flex-wrap sm:flex-nowrap gap-3 z-10"
              >
                {aboutData.floatingStats.map((stat) => (
                  <div
                    key={stat.id}
                    className="flex-1 sm:flex-initial rounded-xl p-3.5 sm:p-4 min-w-[130px] sm:min-w-[150px] shadow-md bg-navy-950/80 backdrop-blur-md text-white border border-white/15"
                    style={prefersReducedMotion ? { opacity: 1, transform: 'none' } : undefined}
                  >
                    {/* Screen reader full text */}
                    <span className="sr-only">
                      {stat.value}{stat.suffix} {stat.label}
                    </span>

                    {/* Visual Counter + Suffix */}
                    <div
                      aria-hidden="true"
                      className="font-heading font-bold text-2xl sm:text-3xl tracking-tight leading-none tabular-nums"
                    >
                      <span className="about-stat-number">
                        {prefersReducedMotion ? stat.value.toLocaleString() : '0'}
                      </span>
                      <span className="text-[#C5A059] ml-0.5">
                        {stat.suffix}
                      </span>
                    </div>

                    <div className="text-[11px] sm:text-xs font-medium mt-1.5 leading-tight text-slate-200">
                      {stat.label}
                    </div>
                  </div>
                ))}
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
              className="about-reveal-el w-10 h-0.5 bg-[#C5A059] mb-4 md:mb-5"
              aria-hidden="true"
            />

            {/* 1. Refined Executive Tag Badge */}
            <div className="about-reveal-el mb-4 md:mb-5">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-navy-50 border border-[#0B1B4D]/10 text-[#0B1B4D] text-xs font-semibold tracking-wide">
                <span>{aboutData.badge}</span>
              </span>
            </div>

            {/* 2. H2 Heading */}
            <h2
              id="about-heading"
              className="about-reveal-el font-heading font-bold text-2xl sm:text-3xl lg:text-4xl xl:text-[2.65rem] text-[#0B1B4D] tracking-tight leading-[1.18] text-balance mb-4 md:mb-5 max-w-xl"
            >
              {aboutData.heading}
            </h2>

            {/* 3. Supporting Paragraph */}
            <p className="about-reveal-el text-base md:text-lg text-slate-600 font-normal leading-[1.7] max-w-xl text-pretty mb-6">
              {aboutData.paragraph}
            </p>

            {/* 4. Three Checklist Items */}
            <div className="about-reveal-el space-y-3 mb-8">
              {aboutData.points.map((point) => (
                <div key={point} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-md bg-[#0A1F4D]/10 text-[#0A1F4D] flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <span className="text-sm sm:text-base font-medium text-slate-800">
                    {point}
                  </span>
                </div>
              ))}
            </div>

            {/* 5. Cohesive CTA Button */}
            <div className="about-reveal-el flex items-center">
              <a
                href={aboutData.cta.href}
                onClick={handleCtaClick}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0A1F4D] hover:bg-[#132B4F] text-white font-semibold text-base transition-colors shadow-2xs hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A1F4D]"
                aria-label={`${aboutData.cta.text} - Navigate to contact form`}
              >
                <span>{aboutData.cta.text}</span>
                <ArrowUpRight className="w-4 h-4 text-[#C5A059]" />
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
