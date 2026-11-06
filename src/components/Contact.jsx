import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Phone, MapPin, Mail } from 'lucide-react';
import { siteConfig } from '../data/siteConfig';
import { EnquiryForm } from './EnquiryForm';
import { useReducedMotion } from '../hooks/useReducedMotion';

import worldDots from '../assets/contact/world-dots.svg';
import avatar1 from '../assets/contact/avatar-1.webp';
import avatar2 from '../assets/contact/avatar-2.webp';
import avatar3 from '../assets/contact/avatar-3.webp';

gsap.registerPlugin(ScrollTrigger);

export function Contact() {
  const sectionRef = useRef(null);
  const leftContentRef = useRef(null);
  const formCardRef = useRef(null);

  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Left Content Elements Stagger Entrance
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
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.65, stagger: 0.08, ease: 'power3.out' }
        );
      }

      // 2. Form Card Entrance
      if (formCardRef.current) {
        tl.fromTo(
          formCardRef.current,
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' },
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
      className="relative w-full min-h-[100vh] lg:min-h-[100svh] flex items-center py-18 md:py-24 lg:py-28 bg-[#FAFBF9] text-slate-800 overflow-hidden border-b border-slate-200/60"
    >
      {/* Clean Vector Dotted World Map Background Texture */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-center">
        <img
          src={worldDots}
          alt=""
          className="w-full max-w-7xl h-auto object-contain opacity-25 select-none"
        />
      </div>

      {/* Main Centered Container */}
      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* ================= LEFT CONTENT BLOCK ================= */}
          <div
            ref={leftContentRef}
            className="lg:col-span-6 flex flex-col justify-center text-left"
          >
            {/* 0. Subtle Gold Accent Bar */}
            <div
              className="contact-reveal-el w-10 h-0.5 bg-[#C5A059] mb-4 sm:mb-5"
              aria-hidden="true"
            />

            {/* 1. Refined Executive Tag Badge */}
            <div className="contact-reveal-el mb-4 sm:mb-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold tracking-wide bg-navy-50 border border-[#0B1B4D]/10 text-[#0B1B4D]">
                <span>{siteConfig.contact.sectionBadge}</span>
              </div>
            </div>

            {/* 2. Heading */}
            <h2
              id="contact-heading"
              className="contact-reveal-el font-heading font-bold text-3xl sm:text-4xl lg:text-[2.75rem] text-[#0B1B4D] tracking-tight leading-[1.18] text-balance mb-4 sm:mb-5"
            >
              {siteConfig.contact.heading}
            </h2>

            {/* 3. Subtitle / Narrative Copy */}
            <p className="contact-reveal-el text-slate-600 text-sm sm:text-base leading-relaxed max-w-lg mb-8 sm:mb-10">
              Make the decision to move forward. Commit your vision to clarity, and let our senior accounting consultants bring structure and compliance to your business.
            </p>

            {/* 4. Minimalist Contact Details with Refined Icons */}
            <div className="contact-reveal-el space-y-4 mb-8 sm:mb-10">
              {/* Address */}
              <div className="flex items-start sm:items-center gap-3.5 text-slate-700">
                <div className="w-9 h-9 rounded-lg bg-navy-50 text-[#0B1B4D] flex items-center justify-center shrink-0 border border-[#0B1B4D]/10 shadow-2xs mt-0.5 sm:mt-0">
                  <MapPin className="w-4 h-4 text-[#0B1B4D]" />
                </div>
                <span className="text-sm sm:text-base font-medium text-slate-800 leading-snug">
                  {siteConfig.business.address}
                </span>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3.5 text-slate-700">
                <div className="w-9 h-9 rounded-lg bg-navy-50 text-[#0B1B4D] flex items-center justify-center shrink-0 border border-[#0B1B4D]/10 shadow-2xs">
                  <Phone className="w-4 h-4 text-[#0B1B4D]" />
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm sm:text-base font-medium">
                  <a
                    href={siteConfig.business.phoneTel}
                    className="text-slate-800 hover:text-[#0B1B4D] font-semibold transition-colors"
                  >
                    {siteConfig.business.phoneDisplay}
                  </a>
                  <span className="text-slate-300">/</span>
                  <a
                    href={siteConfig.business.phoneSecondaryTel}
                    className="text-slate-800 hover:text-[#0B1B4D] font-semibold transition-colors"
                  >
                    {siteConfig.business.phoneSecondaryDisplay}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3.5 text-slate-700">
                <div className="w-9 h-9 rounded-lg bg-navy-50 text-[#0B1B4D] flex items-center justify-center shrink-0 border border-[#0B1B4D]/10 shadow-2xs">
                  <Mail className="w-4 h-4 text-[#0B1B4D]" />
                </div>
                <a
                  href={siteConfig.business.emailMailto}
                  className="text-sm sm:text-base font-medium text-slate-800 hover:text-[#0B1B4D] transition-colors"
                >
                  {siteConfig.business.email}
                </a>
              </div>
            </div>

            {/* 5. Client Social Proof Avatar Stack */}
            <div className="contact-reveal-el flex items-center gap-3.5 pt-6 border-t border-slate-200/80">
              <div className="flex -space-x-2.5">
                <img
                  src={avatar1}
                  alt="UAE Client"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-2xs"
                />
                <img
                  src={avatar2}
                  alt="UAE Client"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-2xs"
                />
                <img
                  src={avatar3}
                  alt="UAE Client"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-2xs"
                />
                <div className="w-10 h-10 rounded-full bg-[#0A1F4D] text-[#C5A059] font-bold text-xs flex items-center justify-center border-2 border-white shadow-2xs tabular-nums">
                  +500
                </div>
              </div>
              <div className="text-xs sm:text-sm">
                <span className="block font-bold text-[#0B1B4D]">Trusted by 500+</span>
                <span className="text-slate-500 font-medium">Businesses across the UAE</span>
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
