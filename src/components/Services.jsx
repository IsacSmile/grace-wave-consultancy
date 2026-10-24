import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteConfig } from '../data/siteConfig';
import { servicesData } from '../data/services';
import { ServiceRow } from './ServiceRow';
import { ServiceCursorPreview } from './ServiceCursorPreview';
import { SectionHeading } from './SectionHeading';
import { useHoverCapable } from '../hooks/useHoverCapable';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useLenis } from './SmoothScroll';

gsap.registerPlugin(ScrollTrigger);

/**
 * Services Component (Redesigned Editorial Interactive Layout)
 * Replaces old card grid and ServiceDetail sections.
 * Features:
 * - Desktop: Hover row with 1px hairlines, GSAP floating cursor preview with velocity tilt and crossfade,
 *   keyboard-accessible fixed preview, and expand-on-click drawer.
 * - Mobile/Touch: Clean accordion with first row open by default, 64px+ touch targets, inline lazy WebP images,
 *   3 checklist bullets, and Lenis auto-scroll.
 */
export function Services() {
  const isHoverCapable = useHoverCapable();
  const prefersReducedMotion = useReducedMotion();
  const { scrollTo } = useLenis();

  const sectionRef = useRef(null);
  const listRef = useRef(null);

  // First row (01 Accounting & Bookkeeping) open by default as requested
  const [openId, setOpenId] = useState(servicesData[0].id);

  // Desktop hover tracking
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [isOverExpanded, setIsOverExpanded] = useState(false);

  // Desktop keyboard focus tracking
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [focusedElement, setFocusedElement] = useState(null);


  // Scroll animations with GSAP ScrollTrigger for service rows
  useEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Rows fade up (translateY 30px) with stagger 0.12s, start 'top 80%', once: true
      if (listRef.current) {
        const rowElements = listRef.current.children;
        gsap.fromTo(
          rowElements,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: listRef.current,
              start: 'top 80%',
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // Toggle row accordion
  const handleToggle = (id, rowElement) => {
    setOpenId((prev) => {
      const next = prev === id ? null : id;
      // After opening, if the row top is off-screen, smooth-scroll with lenis.scrollTo so the row header is visible below navbar
      if (next !== null && rowElement) {
        setTimeout(() => {
          const rect = rowElement.getBoundingClientRect();
          const navbarHeight = 84;
          if (rect.top < navbarHeight) {
            scrollTo(rowElement, navbarHeight + 8);
          }
          ScrollTrigger.refresh();
        }, 120);
      } else {
        setTimeout(() => ScrollTrigger.refresh(), 200);
      }
      return next;
    });
  };

  // Enquire action: scrolls via Lenis to #contact and preselects service in EnquiryForm
  const handleEnquire = (serviceValue) => {
    window.dispatchEvent(
      new CustomEvent('enquiry:select-service', { detail: serviceValue })
    );
    window.dispatchEvent(
      new CustomEvent('select-service', { detail: serviceValue })
    );
    scrollTo('#contact', 76);
  };

  // Keyboard navigation handlers
  const handleFocus = (index, element) => {
    setFocusedIndex(index);
    setFocusedElement(element);
  };

  const handleBlur = () => {
    setFocusedIndex(-1);
    setFocusedElement(null);
  };

  const isAnyOpen = openId !== null;
  const isAnyHovered = hoveredIndex !== -1 && hoveredIndex !== null && hoveredIndex >= 0;

  return (
    <section
      id="services"
      ref={sectionRef}
      aria-labelledby="services-title"
      className="relative py-20 md:py-28 lg:py-32 bg-[#F8FAFF] text-slate-800 overflow-hidden"
    >
      {/* Background Soft Ambient Light */}
      <div
        className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-100/40 blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 left-10 w-[450px] h-[450px] rounded-full bg-teal-50/50 blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* ================= SECTION HEADER ================= */}
        <SectionHeading
          badge={siteConfig.services.sectionBadge}
          title={siteConfig.services.title}
          subtitle={siteConfig.services.subtitle}
          id="services-title"
        />

        {/* ================= EDITORIAL SERVICE ROWS ================= */}
        <div className="relative">
          <ul
            ref={listRef}
            className="relative flex flex-col w-full divide-y-0"
            role="list"
          >
            {servicesData.map((service, index) => (
              <ServiceRow
                key={service.id}
                service={service}
                index={index}
                isOpen={openId === service.id}
                onToggle={handleToggle}
                isHovered={hoveredIndex === index}
                isAnyHovered={isAnyHovered}
                onHover={setHoveredIndex}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onOverExpanded={setIsOverExpanded}
                isHoverCapable={isHoverCapable}
                prefersReducedMotion={prefersReducedMotion}
                onEnquire={handleEnquire}
              />
            ))}
          </ul>

          {/* Desktop Floating Cursor Preview (Only mounted on hover-capable pointer devices) */}
          {isHoverCapable && !prefersReducedMotion && (
            <ServiceCursorPreview
              services={servicesData}
              containerRef={listRef}
              activeHoverIndex={hoveredIndex}
              openId={openId}
              isOverExpanded={isOverExpanded}
              focusedIndex={focusedIndex}
              focusedElement={focusedElement}
              isHoverCapable={isHoverCapable}
            />
          )}
        </div>

        {/* ================= TAILORED ASSISTANCE BANNER ================= */}
        <div className="mt-14 md:mt-20 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#071328] via-[#0A1F4D] to-[#071328] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-blue-900/40">
          <div className="text-center md:text-left">
            <h3 className="font-heading font-bold text-lg sm:text-xl text-white mb-1.5">
              {siteConfig.services.ctaBanner.title}
            </h3>
            <p className="text-sm sm:text-base text-slate-300">
              {siteConfig.services.ctaBanner.subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleEnquire('Other')}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm sm:text-base font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 active:scale-[0.99] transition-all shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <span>{siteConfig.services.ctaBanner.buttonText}</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
