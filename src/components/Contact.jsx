import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Phone, MapPin, Mail, Sparkles } from 'lucide-react';
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
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out' }
        );
      }

      // 2. Form Card Entrance
      if (formCardRef.current) {
        tl.fromTo(
          formCardRef.current,
          { opacity: 0, y: 40 },
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
      data-cursor-theme="dark"
      className="relative w-full min-h-[100vh] lg:min-h-[100svh] flex items-center py-20 md:py-28 lg:py-32 bg-[#FAFBF9] text-slate-800 overflow-hidden"
    >
      {/* Clean Vector Dotted World Map Background Texture */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-center">
        <img
          src={worldDots}
          alt=""
          className="w-full max-w-7xl h-auto object-contain opacity-35 select-none"
        />
      </div>

      {/* Main Centered Container */}
      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* ================= LEFT CONTENT BLOCK (MATCHING REFERENCE DESIGN) ================= */}
          <div
            ref={leftContentRef}
            className="lg:col-span-6 flex flex-col justify-center text-left"
          >
            {/* 0. Defined Gold Accent Bar */}
            <div
              className="contact-reveal-el w-12 h-0.5 bg-[#C5A059] rounded-full mb-4 sm:mb-5"
              aria-hidden="true"
            />

            {/* 1. Website Defined Pill Badge */}
            <div className="contact-reveal-el mb-4 sm:mb-5">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.14em] shadow-xs bg-blue-50 border border-blue-200/90 text-[#0B1B4D]">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>{siteConfig.contact.sectionBadge}</span>
              </div>
            </div>

            {/* 2. Bold H2 Heading */}
            <h2
              id="contact-heading"
              className="contact-reveal-el font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl xl:text-[3.25rem] text-navy-950 tracking-tight leading-[1.14] text-balance mb-4 sm:mb-5"
            >
              {siteConfig.contact.heading}
            </h2>

            {/* 3. Subtitle / Narrative Copy */}
            <p className="contact-reveal-el text-slate-600 text-sm sm:text-base leading-relaxed max-w-lg mb-8 sm:mb-10">
              Make the decision to move forward. Commit your vision to clarity, and let our senior accounting consultants bring structure and compliance to your business.
            </p>

            {/* 4. Minimalist Contact Details with Outline Icons (matching website theme) */}
            <div className="contact-reveal-el space-y-4 mb-8 sm:mb-10">
              {/* Address */}
              <div className="flex items-center gap-3.5 text-slate-700">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 shadow-2xs">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm sm:text-base font-medium text-slate-800">
                  {siteConfig.business.address}
                </span>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3.5 text-slate-700">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 shadow-2xs">
                  <Phone className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm sm:text-base font-medium">
                  <a
                    href={siteConfig.business.phoneTel}
                    className="text-slate-800 hover:text-blue-600 transition-colors"
                  >
                    {siteConfig.business.phoneDisplay}
                  </a>
                  <span className="text-slate-300">/</span>
                  <a
                    href={siteConfig.business.phoneSecondaryTel}
                    className="text-slate-800 hover:text-blue-600 transition-colors"
                  >
                    {siteConfig.business.phoneSecondaryDisplay}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3.5 text-slate-700">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 shadow-2xs">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <a
                  href={siteConfig.business.emailMailto}
                  className="text-sm sm:text-base font-medium text-slate-800 hover:text-blue-600 transition-colors"
                >
                  {siteConfig.business.email}
                </a>
              </div>
            </div>

            {/* 5. Client Social Proof Avatar Stack (matching reference) */}
            <div className="contact-reveal-el flex items-center gap-3.5 pt-6 border-t border-slate-200/80">
              <div className="flex -space-x-2.5">
                <img
                  src={avatar1}
                  alt="UAE Client"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-xs"
                />
                <img
                  src={avatar2}
                  alt="UAE Client"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-xs"
                />
                <img
                  src={avatar3}
                  alt="UAE Client"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-xs"
                />
                <div className="w-10 h-10 rounded-full bg-gold-200 text-gold-950 font-bold text-xs flex items-center justify-center border-2 border-white shadow-xs">
                  +500
                </div>
              </div>
              <div className="text-xs sm:text-sm">
                <span className="block font-bold text-navy-950">Trusted by 500+</span>
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
