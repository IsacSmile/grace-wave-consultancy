import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowUpRight, ShieldCheck, CheckCircle2, FileText, TrendingUp } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { siteConfig } from '../data/siteConfig';
import { useLenis } from './SmoothScroll';
import { useReducedMotion } from '../hooks/useReducedMotion';

import advisor1200 from '../assets/hero/advisor-1200w.webp';
import advisor768 from '../assets/hero/advisor-768w.webp';
import advisor480 from '../assets/hero/advisor-480w.webp';

const trustIconMap = {
  accounting: FileText,
  'tax-filing': ShieldCheck,
  compliance: CheckCircle2,
  advisory: TrendingUp,
};

export function Hero() {
  const heroRef = useRef(null);
  const badgeRef = useRef(null);
  const h1Line1Ref = useRef(null);
  const h1Line2Ref = useRef(null);
  const descRef = useRef(null);
  const ctaButtonsRef = useRef(null);
  const trustRowRef = useRef(null);
  const imageContainerRef = useRef(null);
  const advisorImgRef = useRef(null);
  const backdropFrameRef = useRef(null);

  const { scrollTo } = useLenis();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !heroRef.current) return;

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 1024;

      if (isMobile) {
        // Mobile Animation: text group fades up with stagger, image fades in and rises 24px, chips stagger last
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.fromTo(
          [badgeRef.current, h1Line1Ref.current, h1Line2Ref.current, descRef.current],
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, delay: 0.1 }
        );

        if (advisorImgRef.current) {
          tl.fromTo(
            advisorImgRef.current,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
            '-=0.3'
          );
        }

        if (trustRowRef.current) {
          const chips = trustRowRef.current.querySelectorAll('.hero-trust-chip');
          tl.fromTo(
            chips,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.4, stagger: 0.06 },
            '-=0.2'
          );
        }
      } else {
        // Desktop Animation: clean, crisp entrance
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.fromTo(
          badgeRef.current,
          { opacity: 0, y: -12 },
          { opacity: 1, y: 0, duration: 0.5, delay: 0.1 }
        );

        tl.fromTo(
          [h1Line1Ref.current, h1Line2Ref.current],
          { y: '100%', opacity: 0 },
          { y: '0%', opacity: 1, duration: 0.75, stagger: 0.12, ease: 'power4.out' },
          '-=0.2'
        );

        tl.fromTo(
          descRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5 },
          '-=0.3'
        );

        tl.fromTo(
          ctaButtonsRef.current ? ctaButtonsRef.current.children : [],
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.45, stagger: 0.08 },
          '-=0.3'
        );

        tl.fromTo(
          trustRowRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.5 },
          '-=0.2'
        );

        if (backdropFrameRef.current) {
          tl.fromTo(
            backdropFrameRef.current,
            { opacity: 0, scale: 0.95 },
            { opacity: 1, scale: 1, duration: 0.7, ease: 'power2.out' },
            '-=0.6'
          );
        }

        tl.fromTo(
          advisorImgRef.current,
          { opacity: 0, y: 40, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: 'power3.out' },
          '-=0.6'
        );
      }
    }, heroRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const handleEnquiryClick = (e) => {
    e.preventDefault();
    scrollTo('#contact', 76);
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      style={{ '--face-window': '24svh' }}
      className="relative w-full min-h-[100svh] lg:min-h-0 flex flex-col justify-between lg:block bg-[#F8FAFF] text-slate-800 overflow-hidden hero-viewport-height pt-0 lg:pt-28 xl:pt-32 pb-0 lg:pb-16 xl:pb-20"
    >
      {/* Mobile Readability Overlay */}
      <div
        className="lg:hidden absolute inset-0 pointer-events-none z-[2]"
        style={{
          background:
            'linear-gradient(180deg, rgba(248, 250, 255, 0.98) 0%, rgba(248, 250, 255, 0.90) 25%, rgba(248, 250, 255, 0) 38%, rgba(248, 250, 255, 0) 65%, rgba(248, 250, 255, 0.65) 80%, rgba(248, 250, 255, 0.92) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Content Container */}
      <div className="relative z-10 w-full flex-1 lg:flex-initial max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 flex flex-col justify-between lg:block min-h-[100svh] lg:min-h-0 pt-[84px] lg:pt-0 pb-6 lg:pb-0">
        <div className="w-full flex-1 lg:flex-initial flex flex-col justify-between lg:grid lg:grid-cols-12 lg:gap-10 lg:items-center">
          
          {/* ================= LEFT / CONTENT COLUMN ================= */}
          <div className="relative z-20 w-full flex-1 lg:flex-initial flex flex-col justify-between lg:block lg:col-span-7 text-left pb-0">
            
            {/* TOP GROUP */}
            <div className="relative z-30">
              {/* 1. Refined Executive Tag Badge */}
              <div className="mb-3 sm:mb-4 lg:mb-5">
                <div
                  ref={badgeRef}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-navy-900/5 border border-[#0B1B4D]/10 text-[#0B1B4D] text-xs sm:text-sm font-semibold tracking-wide"
                >
                  <span className="w-2 h-2 rounded-full bg-[#C5A059]" aria-hidden="true" />
                  <span>{siteConfig.hero.badge}</span>
                </div>
              </div>

              {/* 2. Headline */}
              <h1 className="font-heading font-bold text-2xl xs:text-3xl sm:text-4xl md:text-[2.65rem] lg:text-[2.85rem] xl:text-[3.35rem] tracking-tight text-[#0B1B4D] leading-tight sm:leading-[1.18] mb-3 sm:mb-4 lg:mb-6 max-w-none flex flex-col gap-1 sm:gap-2 lg:gap-2">
                <span className="block overflow-hidden py-0.5 sm:py-1">
                  <span ref={h1Line1Ref} className="block whitespace-nowrap leading-tight sm:leading-[1.18]">
                    {siteConfig.hero.headlineLine1}
                  </span>
                </span>
                <span className="block overflow-hidden py-0.5 sm:py-1">
                  <span ref={h1Line2Ref} className="block text-[#0B1B4D] sm:text-[#132B4F] whitespace-nowrap leading-tight sm:leading-[1.18]">
                    {siteConfig.hero.headlineLine2}
                  </span>
                </span>
              </h1>

              {/* 3. Supporting Paragraph */}
              <p
                ref={descRef}
                className="text-[14px] xs:text-[15px] sm:text-base lg:text-lg text-slate-600 font-normal leading-relaxed max-w-xl mb-3 sm:mb-5 lg:mb-8 line-clamp-3 lg:line-clamp-none"
              >
                {siteConfig.hero.description}
              </p>
            </div>

            {/* MIDDLE: Face Window Spacer (Mobile) */}
            <div
              className="w-full shrink-0 lg:hidden pointer-events-none"
              style={{ height: 'var(--face-window, 24svh)' }}
              aria-hidden="true"
            />

            {/* BOTTOM GROUP */}
            <div className="relative z-30 w-full">
              {/* 4. Action Buttons (Desktop Only) */}
              <div
                ref={ctaButtonsRef}
                className="hidden lg:flex lg:flex-row items-center gap-3.5 w-full lg:max-w-none mb-10"
              >
                <a
                  href="#contact"
                  onClick={handleEnquiryClick}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-white bg-[#0A1F4D] hover:bg-[#132B4F] shadow-sm hover:shadow transition-all min-h-[48px] h-12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A1F4D]"
                >
                  <span>{siteConfig.hero.primaryCta.text}</span>
                  <ArrowUpRight className="w-4 h-4 text-[#C5A059]" />
                </a>

                <a
                  href={siteConfig.hero.secondaryCta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-base font-semibold text-[#0B1B4D] bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 shadow-2xs transition-all min-h-[48px] h-12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                >
                  <WhatsAppIcon className="w-4 h-4 text-emerald-600" />
                  <span>{siteConfig.hero.secondaryCta.text}</span>
                </a>
              </div>

              {/* 5. Trust Chips: Clean Structured Cards */}
              <div
                ref={trustRowRef}
                className="pt-0 lg:pt-6 border-t-0 lg:border-t border-slate-200/80 max-w-xl w-full"
              >
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-3.5">
                  {siteConfig.hero.trustRow.map((item) => {
                    const Icon = trustIconMap[item.id] || CheckCircle2;
                    return (
                      <div
                        key={item.id}
                        className="hero-trust-chip flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl bg-white/90 border border-slate-200/90 shadow-2xs hover:border-[#0B1B4D]/20 transition-colors"
                      >
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-navy-50 text-[#0B1B4D] flex items-center justify-center shrink-0">
                          <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0B1B4D]" />
                        </div>
                        <div className="text-left leading-tight truncate">
                          <div className="text-xs font-semibold text-[#0B1B4D] truncate">{item.label}</div>
                          <div className="text-[11px] text-slate-500 hidden lg:block mt-0.5">{item.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

          {/* ================= RIGHT COLUMN (ADVISOR PORTRAIT + ARCHITECTURAL BACKDROP) ================= */}
          <div
            ref={imageContainerRef}
            className="static lg:relative lg:col-span-5 flex items-end justify-center lg:self-center w-full mt-0"
          >
            {/* Composition Wrapper */}
            <div className="static lg:relative w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[460px] flex items-end justify-center">
              
              {/* Architectural Framed Backdrop (Desktop Only) */}
              <div
                ref={backdropFrameRef}
                className="hidden lg:block absolute bottom-0 left-1/2 -translate-x-1/2 w-[340px] xl:w-[380px] h-[480px] xl:h-[520px] rounded-t-[140px] rounded-b-2xl bg-gradient-to-b from-slate-200/50 via-slate-100/30 to-transparent border border-slate-200/70 pointer-events-none -z-10"
                aria-hidden="true"
              />

              {/* Professional Person Cutout Image */}
              <img
                ref={advisorImgRef}
                src={advisor768}
                srcSet={`${advisor480} 480w, ${advisor768} 768w, ${advisor1200} 1200w`}
                sizes="(max-width: 1023px) 100vw, 50vw"
                width={510}
                height={900}
                alt="Grace Way Accounting Corporate Financial Advisor"
                loading="eager"
                fetchpriority="high"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[65svh] sm:h-[68svh] lg:h-auto w-auto max-w-none object-contain object-bottom pointer-events-none z-0 lg:static lg:transform-none lg:w-full lg:max-w-none lg:z-10 drop-shadow-sm"
              />

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
