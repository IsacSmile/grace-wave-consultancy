import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Phone, Clock, MapPin, Sparkles } from 'lucide-react';
import { siteConfig } from '../data/siteConfig';
import { EnquiryForm } from './EnquiryForm';
import { useReducedMotion } from '../hooks/useReducedMotion';

import contactBg from '../assets/contact/contact-bg.webp';

gsap.registerPlugin(ScrollTrigger);

export function Contact() {
  const sectionRef = useRef(null);
  const bgImgRef = useRef(null);
  const leftContentRef = useRef(null);
  const formCardRef = useRef(null);
  const dividerRef = useRef(null);

  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Desktop Background Parallax
      if (window.innerWidth >= 1024 && bgImgRef.current) {
        gsap.fromTo(
          bgImgRef.current,
          { yPercent: -5 },
          {
            yPercent: 5,
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

      // 2. Left Content Elements Stagger Entrance
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      });

      if (leftContentRef.current) {
        const leftElements = leftContentRef.current.querySelectorAll('.contact-reveal-el');
        tl.fromTo(
          leftElements,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' }
        );
      }

      if (dividerRef.current) {
        tl.fromTo(
          dividerRef.current,
          { scaleX: 0, transformOrigin: 'left center' },
          { scaleX: 1, duration: 0.6, ease: 'power2.out' },
          '-=0.5'
        );
      }

      // 3. Form Card Entrance
      if (formCardRef.current) {
        tl.fromTo(
          formCardRef.current,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
          '-=0.4'
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      id="contact"
      ref={sectionRef}
      aria-labelledby="contact-heading"
      className="relative w-full min-h-[100vh] lg:min-h-[100svh] flex items-center py-16 md:py-24 bg-[#060E18] text-white overflow-hidden"
    >
      {/* Full-Bleed Background Photo & Gradient Wrapper (z-0, never drops behind body) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          ref={bgImgRef}
          src={contactBg}
          width={1600}
          height={893}
          alt="Dubai skyline and corporate office evening atmosphere"
          loading="lazy"
          className="absolute inset-0 w-full h-[115%] -top-[7.5%] object-cover object-[center_30%] lg:object-center opacity-75 will-change-transform"
        />
        {/* Directional Overlay: darkens behind left text while letting the Dubai skyline & advisor shine through clearly */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#060E18]/95 via-[#060E18]/75 to-[#060E18]/50"
          aria-hidden="true"
        />
        {/* Subtle top/bottom vignette for smooth section transition */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#060E18]/70 via-transparent to-[#060E18]/85"
          aria-hidden="true"
        />
      </div>

      {/* Main Centered Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* ================= LEFT CONTENT BLOCK (CLEAN & EDITORIAL) ================= */}
          <div
            ref={leftContentRef}
            className="lg:col-span-6 flex flex-col justify-center text-left space-y-7"
          >
            {/* 1. Small Pill Badge */}
            <div className="contact-reveal-el">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-teal-300 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-sm shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                <span>{siteConfig.contact.sectionBadge}</span>
              </span>
            </div>

            {/* 2. Bold 2-Line H2 Heading */}
            <h2
              id="contact-heading"
              className="contact-reveal-el font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-[1.14]"
            >
              {siteConfig.contact.heading}
            </h2>

            {/* 3. Thin Animated Divider Line */}
            <div
              ref={dividerRef}
              className="w-full h-px bg-white/15 my-1"
              aria-hidden="true"
            />

            {/* 4. Structured 2x2 Information Grid */}
            <div className="contact-reveal-el grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 pt-1">
              {/* Email */}
              <div>
                <span className="block text-xs font-semibold tracking-wider uppercase text-slate-400 mb-1.5">
                  Email Address
                </span>
                <a
                  href={siteConfig.business.emailMailto}
                  className="text-sm sm:text-base font-semibold text-white hover:text-blue-400 transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded block"
                >
                  {siteConfig.business.email}
                </a>
              </div>

              {/* Direct Phone */}
              <div>
                <span className="block text-xs font-semibold tracking-wider uppercase text-slate-400 mb-1.5">
                  Direct Line
                </span>
                <a
                  href={siteConfig.business.phoneTel}
                  className="text-sm sm:text-base font-semibold text-white hover:text-blue-400 transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded block"
                >
                  {siteConfig.business.phoneDisplay}
                </a>
              </div>

              {/* Working Hours */}
              <div>
                <span className="block text-xs font-semibold tracking-wider uppercase text-slate-400 mb-1.5">
                  Working Hours
                </span>
                <div className="flex items-center gap-2 text-sm sm:text-base font-medium text-slate-200">
                  <Clock className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>{siteConfig.business.workingHours}</span>
                </div>
              </div>

              {/* Office Location */}
              <div>
                <span className="block text-xs font-semibold tracking-wider uppercase text-slate-400 mb-1.5">
                  Office Location
                </span>
                <div className="flex items-start gap-2 text-sm sm:text-base font-medium text-slate-200">
                  <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span>{siteConfig.business.address}</span>
                </div>
              </div>
            </div>

          </div>

          {/* ================= RIGHT COLUMN: FORM CARD ================= */}
          <div
            ref={formCardRef}
            className="lg:col-span-6 flex justify-center w-full"
            style={prefersReducedMotion ? { opacity: 1, transform: 'none' } : undefined}
          >
            <EnquiryForm />
          </div>

        </div>
      </div>
    </section>
  );
}
