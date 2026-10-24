import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Sparkles } from 'lucide-react';
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
  const [isInView, setIsInView] = useState(true);

  const { scrollTo } = useLenis();
  const isHoverCapable = useHoverCapable();
  const prefersReducedMotion = useReducedMotion();

  const handleEnquiryClick = (e) => {
    e.preventDefault();
    scrollTo('#contact', 76);
  };

  // IntersectionObserver to pause blob animations when section is off-screen
  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || !outerCardRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Outer card entrance: rises 40px + fades, start "top 85%", once: true
      gsap.fromTo(
        outerCardRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: outerCardRef.current,
            start: 'top 85%',
            once: true,
          },
        }
      );

      // 2. Bento tiles entrance: fade + translateY 32px + scale 0.97 to 1, stagger 0.1s, start "top 80%", once: true
      const tileEls = outerCardRef.current.querySelectorAll('.why-bento-tile');
      if (tileEls.length > 0) {
        gsap.fromTo(
          tileEls,
          { opacity: 0, y: 32, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.1,
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
      className="bg-[#F8FAFF] py-16 md:py-24 lg:py-28 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Large White Rounded Outer Card with Soft Shadow (0 30px 80px -30px navy/15%), no border */}
        <div
          ref={outerCardRef}
          className="bg-white rounded-[28px] md:rounded-[36px] p-3 md:p-5 lg:p-5 shadow-[0_30px_80px_-30px_rgba(11,27,77,0.15)] relative"
        >
          {/* Bento Grid: 1 col on mobile, 2 col on md, 3 col on lg */}
          <ul
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:auto-rows-[minmax(300px,1fr)] gap-3 md:gap-4 lg:gap-5 list-none p-0 m-0"
            role="list"
          >
            {/* ================= 1. HEADING CELL ================= */}
            <li
              className="order-1 col-span-1 md:col-span-2 lg:col-span-1 flex flex-col justify-center px-3 py-6 md:p-6 lg:px-6 lg:py-4 rounded-3xl"
            >
              <Reveal
                stagger={0.1}
                y={24}
                start="top 80%"
                once={true}
                className="flex flex-col justify-center h-full"
              >
                {/* 48px Gold Accent Bar */}
                <div
                  className="w-12 h-0.5 bg-[#C5A059] rounded-full mb-4 md:mb-5"
                  aria-hidden="true"
                />

                {/* Pill Badge */}
                <div className="mb-3.5 md:mb-4">
                  <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-[0.14em] bg-blue-50 border border-blue-200/90 text-[#0B1B4D] shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
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
                    className="h-12 px-6 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 active:scale-[0.99] transition-all inline-flex items-center justify-center gap-2 w-full sm:w-auto min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    <span>{whyGraceWayData.header.cta.text}</span>
                    <ArrowUpRight className="w-4 h-4 shrink-0" />
                  </a>
                </div>
              </Reveal>
            </li>

            {/* ================= 2. TILE 3 (25+ Image Tile - Wide on lg) ================= */}
            {/* Mobile order: 2 (placed right after heading cell for maximum impact) */}
            <WhyTile
              tile={tile3}
              tileRef={(el) => (tileRefs.current[2] = el)}
              imageRef={(el) => (imageRefs.current[0] = el)}
              counterRef={counterRef}
              isHoverCapable={isHoverCapable}
              prefersReducedMotion={prefersReducedMotion}
              isInView={isInView}
              className="order-2 md:order-2 lg:order-4 col-span-1 md:col-span-2 lg:col-span-2 min-h-[260px] md:min-h-[300px] lg:min-h-[300px]"
            />

            {/* ================= 3. TILE 1 (Soft Gold: Experienced Professionals) ================= */}
            <WhyTile
              tile={tile1}
              tileRef={(el) => (tileRefs.current[0] = el)}
              isHoverCapable={isHoverCapable}
              prefersReducedMotion={prefersReducedMotion}
              isInView={isInView}
              className="order-3 md:order-3 lg:order-2 col-span-1 md:col-span-1 lg:col-span-1 min-h-[220px] md:min-h-[240px] lg:min-h-[300px]"
            />

            {/* ================= 4. TILE 2 (Soft Blue: Innovative Solutions) ================= */}
            <WhyTile
              tile={tile2}
              tileRef={(el) => (tileRefs.current[1] = el)}
              isHoverCapable={isHoverCapable}
              prefersReducedMotion={prefersReducedMotion}
              isInView={isInView}
              className="order-4 md:order-4 lg:order-3 col-span-1 md:col-span-1 lg:col-span-1 min-h-[220px] md:min-h-[240px] lg:min-h-[300px]"
            />

            {/* ================= 5. TILE 4 (Image: Compliance First) ================= */}
            <WhyTile
              tile={tile4}
              tileRef={(el) => (tileRefs.current[3] = el)}
              imageRef={(el) => (imageRefs.current[1] = el)}
              isHoverCapable={isHoverCapable}
              prefersReducedMotion={prefersReducedMotion}
              isInView={isInView}
              className="order-5 md:order-5 lg:order-5 col-span-1 md:col-span-2 lg:col-span-1 min-h-[260px] md:min-h-[240px] lg:min-h-[300px]"
            />
          </ul>

          {/* Desktop CTA below the bento grid (shown on lg+ if cell gets cramped) */}
          <div className="hidden lg:flex justify-center mt-6 pt-2">
            <a
              href="#contact"
              onClick={handleEnquiryClick}
              className="h-12 px-8 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 active:scale-[0.99] transition-all inline-flex items-center justify-center gap-2 min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <span>{whyGraceWayData.header.cta.text}</span>
              <ArrowUpRight className="w-4 h-4 shrink-0" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

