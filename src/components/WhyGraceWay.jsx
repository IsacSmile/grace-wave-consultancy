import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { whyGraceWayData } from '../data/whyGraceWay';
import { WhyTile } from './WhyTile';
import { Reveal } from './Reveal';
import { useLenis } from './SmoothScroll';
import { useHoverCapable } from '../hooks/useHoverCapable';
import { useReducedMotion } from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export function WhyGraceWay() {
  const sectionRef = useRef(null);
  const outerCardRef = useRef(null);
  const counterRef = useRef(null);
  const imageRefs = useRef([]);
  const tileRefs = useRef([]);

  const { scrollTo } = useLenis();
  const isHoverCapable = useHoverCapable();
  const prefersReducedMotion = useReducedMotion();

  const handleEnquiryClick = (e) => {
    e.preventDefault();
    scrollTo('#contact', 76);
  };

  useEffect(() => {
    if (prefersReducedMotion || !outerCardRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Outer card entrance: rises 40px + fades, start "top 85%", once: true
      gsap.fromTo(
        outerCardRef.current,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: outerCardRef.current,
            start: 'top 85%',
            once: true,
          },
        }
      );

      // 2. Bento tiles entrance: fade + translateY 24px + scale 0.98 to 1, stagger 0.1s, start "top 80%", once: true
      const tileEls = outerCardRef.current.querySelectorAll('.why-bento-tile');
      if (tileEls.length > 0) {
        gsap.fromTo(
          tileEls,
          { opacity: 0, y: 24, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.65,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: outerCardRef.current,
              start: 'top 80%',
              once: true,
            },
          }
        );
      }

      // 3. Counter: runs once when Tile 3 appears
      const tile3 = whyGraceWayData.tiles.find((t) => t.id === 'experience');
      const tile3El = tileRefs.current[2];
      if (counterRef.current && tile3) {
        const counterObj = { val: 0 };
        gsap.to(counterObj, {
          val: tile3.statValue,
          duration: 1.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: tile3El || counterRef.current,
            start: 'top 80%',
            once: true,
          },
          onUpdate: () => {
            if (counterRef.current) {
              counterRef.current.textContent = Math.round(counterObj.val).toString();
            }
          },
          onComplete: () => {
            if (counterRef.current) {
              counterRef.current.textContent = tile3.statValue.toString();
            }
          },
        });
      }

      // 4. Desktop-only light scroll-linked parallax on image tiles (y: -3% to 3%, transform only)
      if (window.innerWidth >= 1024) {
        imageRefs.current.forEach((imgEl) => {
          if (!imgEl) return;
          gsap.fromTo(
            imgEl,
            { yPercent: -3 },
            {
              yPercent: 3,
              ease: 'none',
              scrollTrigger: {
                trigger: imgEl.closest('.why-bento-tile') || outerCardRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.2,
              },
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const tile1 = whyGraceWayData.tiles[0]; // Experienced professionals (soft gold)
  const tile2 = whyGraceWayData.tiles[1]; // Innovative solutions (soft blue)
  const tile3 = whyGraceWayData.tiles[2]; // 25+ years (wide image)
  const tile4 = whyGraceWayData.tiles[3]; // Compliance first (image)

  return (
    <section
      id="why"
      ref={sectionRef}
      aria-labelledby="why-heading"
      className="bg-[#F8FAFF] py-16 md:py-24 lg:py-28 relative overflow-hidden border-b border-slate-200/60"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Large White Rounded Outer Card */}
        <div
          ref={outerCardRef}
          className="bg-white rounded-3xl p-4 md:p-6 lg:p-7 border border-slate-200/80 shadow-2xs relative"
        >
          {/* Bento Grid: 1 col on mobile, 2 col on md, 3 col on lg */}
          <ul
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:auto-rows-[minmax(280px,1fr)] gap-3 md:gap-4 lg:gap-5 list-none p-0 m-0"
            role="list"
          >
            {/* ================= 1. HEADING CELL ================= */}
            <li
              className="order-1 col-span-1 md:col-span-2 lg:col-span-1 flex flex-col justify-center px-3 py-5 md:p-5 lg:px-5 lg:py-3 rounded-2xl"
            >
              <Reveal
                stagger={0.1}
                y={24}
                start="top 80%"
                once={true}
                className="flex flex-col justify-center h-full"
              >
                {/* Gold Accent Bar */}
                <div
                  className="w-10 h-0.5 bg-[#C5A059] mb-4 md:mb-5"
                  aria-hidden="true"
                />

                {/* Refined Tag Badge */}
                <div className="mb-3.5 md:mb-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold tracking-wide bg-navy-50 border border-[#0B1B4D]/10 text-[#0B1B4D]">
                    <span>{whyGraceWayData.header.badge}</span>
                  </span>
                </div>

                {/* Heading Title */}
                <h2
                  id="why-heading"
                  className="font-heading font-bold text-2xl sm:text-3xl lg:text-[2rem] text-[#0B1B4D] tracking-tight leading-[1.2] text-balance mb-3 md:mb-4"
                >
                  {whyGraceWayData.header.title}
                </h2>

                {/* Subtitle */}
                <p className="text-sm md:text-base text-slate-600 font-normal leading-[1.65] text-pretty">
                  {whyGraceWayData.header.subtitle}
                </p>

                {/* CTA inside cell on mobile / tablet */}
                <div className="mt-5 sm:mt-6 lg:hidden">
                  <a
                    href="#contact"
                    onClick={handleEnquiryClick}
                    className="h-12 px-6 rounded-xl font-semibold text-white bg-[#0A1F4D] hover:bg-[#132B4F] active:scale-[0.99] transition-colors inline-flex items-center justify-center gap-2 w-full sm:w-auto min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A1F4D]"
                  >
                    <span>{whyGraceWayData.header.cta.text}</span>
                    <ArrowUpRight className="w-4 h-4 text-[#C5A059] shrink-0" />
                  </a>
                </div>
              </Reveal>
            </li>

            {/* ================= 2. TILE 3 (25+ Image Tile - Wide on lg) ================= */}
            <WhyTile
              tile={tile3}
              tileRef={(el) => (tileRefs.current[2] = el)}
              imageRef={(el) => (imageRefs.current[0] = el)}
              counterRef={counterRef}
              isHoverCapable={isHoverCapable}
              prefersReducedMotion={prefersReducedMotion}
              className="order-2 md:order-2 lg:order-4 col-span-1 md:col-span-2 lg:col-span-2 min-h-[260px] md:min-h-[280px] lg:min-h-[280px]"
            />

            {/* ================= 3. TILE 1 (Soft Gold: Experienced Professionals) ================= */}
            <WhyTile
              tile={tile1}
              tileRef={(el) => (tileRefs.current[0] = el)}
              isHoverCapable={isHoverCapable}
              prefersReducedMotion={prefersReducedMotion}
              className="order-3 md:order-3 lg:order-2 col-span-1 md:col-span-1 lg:col-span-1 min-h-[220px] md:min-h-[240px] lg:min-h-[280px]"
            />

            {/* ================= 4. TILE 2 (Soft Blue: Innovative Solutions) ================= */}
            <WhyTile
              tile={tile2}
              tileRef={(el) => (tileRefs.current[1] = el)}
              isHoverCapable={isHoverCapable}
              prefersReducedMotion={prefersReducedMotion}
              className="order-4 md:order-4 lg:order-3 col-span-1 md:col-span-1 lg:col-span-1 min-h-[220px] md:min-h-[240px] lg:min-h-[280px]"
            />

            {/* ================= 5. TILE 4 (Image: Compliance First) ================= */}
            <WhyTile
              tile={tile4}
              tileRef={(el) => (tileRefs.current[3] = el)}
              imageRef={(el) => (imageRefs.current[1] = el)}
              isHoverCapable={isHoverCapable}
              prefersReducedMotion={prefersReducedMotion}
              className="order-5 md:order-5 lg:order-5 col-span-1 md:col-span-2 lg:col-span-1 min-h-[260px] md:min-h-[240px] lg:min-h-[280px]"
            />
          </ul>

          {/* Desktop CTA below the bento grid */}
          <div className="hidden lg:flex justify-center mt-6 pt-2">
            <a
              href="#contact"
              onClick={handleEnquiryClick}
              className="h-12 px-7 rounded-xl font-semibold text-white bg-[#0A1F4D] hover:bg-[#132B4F] shadow-2xs active:scale-[0.99] transition-colors inline-flex items-center justify-center gap-2 min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A1F4D]"
            >
              <span>{whyGraceWayData.header.cta.text}</span>
              <ArrowUpRight className="w-4 h-4 text-[#C5A059] shrink-0" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

