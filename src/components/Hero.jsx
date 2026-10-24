import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, MessageCircle, ShieldCheck, CheckCircle2, FileText, TrendingUp, Sparkles } from 'lucide-react';
import { siteConfig } from '../data/siteConfig';
import { useLenis } from './SmoothScroll';
import { useReducedMotion } from '../hooks/useReducedMotion';

import advisor1200 from '../assets/hero/advisor-1200w.webp';
import advisor768 from '../assets/hero/advisor-768w.webp';
import advisor480 from '../assets/hero/advisor-480w.webp';

gsap.registerPlugin(ScrollTrigger);

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
  const rotatedSquareRef = useRef(null);
  const circleTealRef = useRef(null);
  const circleBlueRef = useRef(null);
  const dotsPatternRef = useRef(null);

  const { scrollTo } = useLenis();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !heroRef.current) return;

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 1024;

      if (isMobile) {
        // Mobile Animation: text group fades up with stagger, image fades in and rises 24px, chips stagger last
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        // 1. Top text group fades up with stagger
        tl.fromTo(
          [badgeRef.current, h1Line1Ref.current, h1Line2Ref.current, descRef.current],
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, delay: 0.1 }
        );

        // 2. Person image fades in and rises 24px (transform and opacity only)
        if (advisorImgRef.current) {
          tl.fromTo(
            advisorImgRef.current,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
            '-=0.3'
          );
        }

        // 3. Trust chips stagger last
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
        // Desktop Animation: existing full-feature entrance, floating and parallax
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        // Badge fades in
        tl.fromTo(
          badgeRef.current,
          { opacity: 0, y: -16 },
          { opacity: 1, y: 0, duration: 0.5, delay: 0.1 }
        );

        // H1 line by line reveal (mask + translateY)
        tl.fromTo(
          [h1Line1Ref.current, h1Line2Ref.current],
          { y: '100%', opacity: 0 },
          { y: '0%', opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power4.out' },
          '-=0.2'
        );

        // Paragraph & buttons fade up with stagger
        tl.fromTo(
          descRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.4'
        );

        tl.fromTo(
          ctaButtonsRef.current ? ctaButtonsRef.current.children : [],
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
          '-=0.4'
        );

        // Trust row fade in
        tl.fromTo(
          trustRowRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5 },
          '-=0.2'
        );

        // Person image slides up from bottom with slight scale (0.96 to 1)
        tl.fromTo(
          advisorImgRef.current,
          { opacity: 0, y: 60, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out' },
          '-=0.7'
        );

        // Decorative shapes pop in (scale + opacity stagger)
        const shapes = [
          rotatedSquareRef.current,
          circleTealRef.current,
          circleBlueRef.current,
          dotsPatternRef.current,
        ].filter(Boolean);

        tl.fromTo(
          shapes,
          { opacity: 0, scale: 0.6 },
          { opacity: 1, scale: 1, duration: 0.6, stagger: 0.08, ease: 'back.out(1.5)' },
          '-=0.6'
        );

        // Continuous subtle floating (y +/-10px, 4 to 6s yoyo) on circles (desktop only)
        if (circleTealRef.current) {
          gsap.to(circleTealRef.current, {
            y: -12,
            duration: 4.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        }
        if (circleBlueRef.current) {
          gsap.to(circleBlueRef.current, {
            y: 10,
            duration: 5.2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: 0.5,
          });
        }

        // Light scroll parallax on decorative shapes (desktop only)
        if (rotatedSquareRef.current) {
          gsap.to(rotatedSquareRef.current, {
            y: 50,
            rotation: 50,
            ease: 'none',
            scrollTrigger: {
              trigger: heroRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: 1,
            },
          });
        }
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
      className="relative w-full min-h-[100svh] flex flex-col justify-between bg-[#F8FAFF] text-slate-800 overflow-hidden hero-viewport-height lg:pt-24"
    >
      {/* Background Subtle Organic Squiggles (CSS/SVG, Desktop Only) */}
      <svg
        className="hidden lg:block absolute top-12 left-0 w-full h-full pointer-events-none opacity-40 -z-10"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M-50 200 C 150 120, 250 320, 450 220 C 650 120, 750 280, 950 180 C 1150 80, 1300 240, 1500 150"
          stroke="#E2E8F0"
          strokeWidth="1.5"
          strokeDasharray="6 6"
          fill="none"
        />
        <path
          d="M100 650 C 300 550, 400 750, 650 620 C 900 490, 1100 680, 1400 580"
          stroke="#E2E8F0"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>

      {/* Layer 1 (Mobile Soft Decor): Single blue rounded square & teal circle behind her */}
      <div
        className="lg:hidden absolute inset-0 pointer-events-none z-[1] overflow-hidden"
        aria-hidden="true"
      >
        {/* Soft Blue Rounded Square */}
        <div className="absolute bottom-[24svh] left-1/2 -translate-x-1/2 w-44 h-44 rounded-3xl bg-gradient-to-br from-blue-600 to-sky-500 rotate-45 opacity-20 shadow-lg blur-[1px]" />
        {/* Small Teal Circle */}
        <div className="absolute bottom-[44svh] right-[6%] w-10 h-10 rounded-full bg-[#14B8A6] opacity-35 shadow-sm" />
      </div>

      {/* Layer 2 (Mobile Readability Overlay): Gradient ensuring AA text contrast while keeping face 100% uncovered */}
      <div
        className="lg:hidden absolute inset-0 pointer-events-none z-[2]"
        style={{
          background:
            'linear-gradient(180deg, rgba(248, 250, 255, 0.98) 0%, rgba(248, 250, 255, 0.90) 25%, rgba(248, 250, 255, 0) 38%, rgba(248, 250, 255, 0) 65%, rgba(248, 250, 255, 0.65) 80%, rgba(248, 250, 255, 0.92) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Layer 3 (Content Container): Flexible on mobile, two-column grid on desktop */}
      <div className="relative z-10 w-full flex-1 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 flex flex-col justify-between min-h-[100svh] lg:min-h-0 pt-[84px] pb-6 lg:pt-0 lg:pb-8 lg:flex lg:items-center">
        <div className="w-full flex-1 flex flex-col justify-between lg:grid lg:grid-cols-12 lg:gap-8 lg:items-center">
          
          {/* ================= LEFT / CONTENT COLUMN ================= */}
          <div className="relative z-20 w-full flex-1 flex flex-col justify-between lg:block lg:flex-initial lg:col-span-7 text-left pb-0 lg:pb-8">
            
            {/* TOP GROUP: Positioned above her head */}
            <div className="relative z-30">
              {/* 1. Small Pill Badge */}
              <div className="mb-2.5 sm:mb-4 lg:mb-5">
                <div
                  ref={badgeRef}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200/90 text-teal-800 text-xs sm:text-sm font-semibold shadow-xs"
                >
                  <span className="w-5 h-5 rounded-full bg-teal-500 text-white flex items-center justify-center shrink-0">
                    <Sparkles className="w-3 h-3" />
                  </span>
                  <span>{siteConfig.hero.badge}</span>
                </div>
              </div>

              {/* 2. Bold H1 (Strictly 2 Lines with Mask) */}
              <h1 className="font-heading font-black text-[1.55rem] xs:text-[1.85rem] sm:text-4xl md:text-[2.65rem] lg:text-[2.85rem] xl:text-[3.4rem] tracking-tight text-[#0B1B4D] leading-tight sm:leading-[1.2] mb-2.5 sm:mb-4 lg:mb-6 max-w-none flex flex-col gap-1 sm:gap-2 lg:gap-2.5">
                <span className="block overflow-hidden py-0.5 sm:py-1">
                  <span ref={h1Line1Ref} className="block whitespace-nowrap leading-tight sm:leading-[1.2]">
                    {siteConfig.hero.headlineLine1}
                  </span>
                </span>
                <span className="block overflow-hidden py-0.5 sm:py-1">
                  <span ref={h1Line2Ref} className="block text-[#0066FF] whitespace-nowrap leading-tight sm:leading-[1.2]">
                    {siteConfig.hero.headlineLine2}
                  </span>
                </span>
              </h1>

              {/* 3. Supporting Paragraph (clamped to 3 lines on mobile) */}
              <p
                ref={descRef}
                className="text-[14px] xs:text-[15px] sm:text-base lg:text-lg text-slate-700 font-normal leading-relaxed max-w-xl mb-2 sm:mb-4 lg:mb-8 line-clamp-3 lg:line-clamp-none"
              >
                {siteConfig.hero.description}
              </p>
            </div>

            {/* MIDDLE: Face Window Spacer (Uncovers her face and shoulders) */}
            <div
              className="w-full shrink-0 lg:hidden pointer-events-none"
              style={{ height: 'var(--face-window, 24svh)' }}
              aria-hidden="true"
            />

            {/* BOTTOM GROUP: Over her torso, layered on frosted surfaces */}
            <div className="relative z-30 w-full">
              {/* 4. Action Buttons (Desktop Only) */}
              <div
                ref={ctaButtonsRef}
                className="hidden lg:flex lg:flex-row items-center gap-3.5 w-full lg:max-w-none mb-10"
              >
                <a
                  href="#contact"
                  onClick={handleEnquiryClick}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-base font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 active:scale-[0.99] transition-all min-h-[48px] h-12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <span>{siteConfig.hero.primaryCta.text}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>

                <a
                  href={siteConfig.hero.secondaryCta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-base font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/20 active:scale-[0.99] transition-all min-h-[48px] h-12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                >
                  <MessageCircle className="w-4 h-4 text-teal-100" />
                  <span>{siteConfig.hero.secondaryCta.text}</span>
                </a>
              </div>

              {/* 5. Trust Chips: 2x2 Frosted Cards on Mobile, 4 in row on Desktop */}
              <div
                ref={trustRowRef}
                className="pt-0 lg:pt-6 border-t-0 lg:border-t border-slate-200/80 max-w-xl w-full"
              >
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
                  {siteConfig.hero.trustRow.map((item) => {
                    const Icon = trustIconMap[item.id] || CheckCircle2;
                    return (
                      <div
                        key={item.id}
                        className="hero-trust-chip flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-white/80 backdrop-blur-md border border-white/60 shadow-xs"
                      >
                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </div>
                        <div className="text-left leading-tight truncate">
                          <div className="text-xs font-bold text-[#0B1B4D] truncate">{item.label}</div>
                          <div className="text-[10px] text-slate-500 hidden lg:block">{item.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

          {/* ================= RIGHT COLUMN (PERSON + DESKTOP DECORATIVE SHAPES) ================= */}
          <div
            ref={imageContainerRef}
            className="static lg:relative lg:col-span-5 flex items-end justify-center self-end w-full mt-0"
          >
            {/* Composition Wrapper */}
            <div className="static lg:relative w-full max-w-[340px] sm:max-w-[420px] lg:max-w-[480px] flex items-end justify-center">
              
              {/* Desktop Decorative Shape 1: Soft Light Radial Glow behind the person */}
              <div
                className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-sky-200/50 via-teal-100/40 to-transparent blur-2xl pointer-events-none -z-10"
                aria-hidden="true"
              />

              {/* Desktop Decorative Shape 2: Large Rounded-Square Rotated ~45deg in Brand Blue */}
              <div
                ref={rotatedSquareRef}
                className="hidden lg:block absolute top-[28%] sm:top-[24%] left-[16%] sm:left-[18%] w-52 h-52 sm:w-72 sm:h-72 rounded-[2.5rem] sm:rounded-[3rem] bg-gradient-to-br from-blue-600 to-sky-500 rotate-45 shadow-2xl ring-8 ring-purple-400/30 -z-10 pointer-events-none"
                aria-hidden="true"
              />

              {/* Desktop Decorative Shape 3: Solid Teal Circle (Top Left floating) */}
              <div
                ref={circleTealRef}
                className="hidden lg:block absolute top-[18%] left-[2%] sm:left-[5%] w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-[#14B8A6] shadow-lg shadow-teal-500/30 -z-10 pointer-events-none"
                aria-hidden="true"
              />

              {/* Desktop Decorative Shape 4: Solid Blue Circle (Bottom Right floating) */}
              <div
                ref={circleBlueRef}
                className="hidden lg:block absolute bottom-[25%] right-[-5%] w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#38BDF8] shadow-md shadow-sky-400/30 -z-10 pointer-events-none"
                aria-hidden="true"
              />

              {/* Desktop Decorative Shape 5: SVG Dot Grid Pattern */}
              <div
                ref={dotsPatternRef}
                className="hidden lg:block absolute top-[10%] right-[5%] w-24 h-24 -z-10 pointer-events-none opacity-40"
                aria-hidden="true"
              >
                <svg width="96" height="96" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <pattern id="dot-pattern" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="2" fill="#0D9488" />
                  </pattern>
                  <rect width="96" height="96" fill="url(#dot-pattern)" />
                </svg>
              </div>

              {/* Layer 0: Professional Person Cutout Image (Single DOM <img>, LCP) */}
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
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[65svh] sm:h-[68svh] lg:h-auto w-auto max-w-none object-contain object-bottom pointer-events-none z-0 lg:static lg:transform-none lg:w-full lg:max-w-none lg:z-10 drop-shadow-xl"
              />

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
