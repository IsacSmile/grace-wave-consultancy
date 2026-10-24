import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Phone, Mail, Clock, MessageCircle, MapPin, Sparkles, Map } from 'lucide-react';
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
  const [showMap, setShowMap] = useState(false);

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
          className="absolute inset-0 w-full h-[115%] -top-[7.5%] object-cover object-center opacity-50 will-change-transform"
        />
        {/* Dark Navy Gradient Overlay ensuring AA contrast */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#060E18]/95 via-[#071733]/90 to-[#0A1A36]/85"
          aria-hidden="true"
        />
      </div>

      {/* Main Centered Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* ================= LEFT CONTENT BLOCK ================= */}
          <div
            ref={leftContentRef}
            className="lg:col-span-6 flex flex-col justify-end text-left space-y-6"
          >
            {/* 1. Small Pill Badge */}
            <div className="contact-reveal-el">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-950/80 border border-teal-400/40 text-teal-300 text-xs sm:text-sm font-semibold shadow-sm backdrop-blur-xs">
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
              className="w-full h-px bg-white/20 my-2"
              aria-hidden="true"
            />

            {/* 4. Info Row: Email & Working Hours */}
            <div className="contact-reveal-el grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
              <div>
                <span className="block text-xs font-bold tracking-wider uppercase text-slate-300 mb-1">
                  Email Address
                </span>
                <a
                  href={siteConfig.business.emailMailto}
                  className="text-sm sm:text-base font-bold text-white hover:text-blue-400 transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded"
                >
                  {siteConfig.business.email}
                </a>
              </div>

              <div>
                <span className="block text-xs font-bold tracking-wider uppercase text-slate-300 mb-1">
                  Working Hours
                </span>
                <div className="flex items-center gap-2 text-sm sm:text-base font-semibold text-slate-200">
                  <Clock className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>{siteConfig.business.workingHours}</span>
                </div>
              </div>
            </div>

            {/* 5. Phone Lines & WhatsApp Quick Link */}
            <div className="contact-reveal-el pt-2 space-y-2.5">
              <span className="block text-xs font-bold tracking-wider uppercase text-slate-300 mb-1">
                Direct Contact Lines
              </span>
              
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={siteConfig.business.phoneTel}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-sm font-bold text-white transition-all min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                  aria-label={`Call primary phone ${siteConfig.business.phoneDisplay}`}
                >
                  <Phone className="w-4 h-4 text-blue-400" />
                  <span>{siteConfig.business.phoneDisplay}</span>
                </a>

                {siteConfig.business.phoneSecondary && (
                  <a
                    href={siteConfig.business.phoneSecondaryTel}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-sm font-bold text-white transition-all min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                    aria-label={`Call secondary phone ${siteConfig.business.phoneSecondaryDisplay}`}
                  >
                    <Phone className="w-4 h-4 text-teal-400" />
                    <span>{siteConfig.business.phoneSecondaryDisplay}</span>
                  </a>
                )}

                <a
                  href={siteConfig.business.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600/80 hover:bg-emerald-600 border border-emerald-500/50 text-sm font-bold text-white shadow-sm transition-all min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                  aria-label="Chat on WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* 6. Office Address & Google Map Embed / Toggle */}
            <div className="contact-reveal-el pt-2 space-y-3">
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>{siteConfig.business.address}</span>
              </div>

              {/* Map Toggle & Embed */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowMap(!showMap)}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-blue-300 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded py-1"
                >
                  <Map className="w-3.5 h-3.5" />
                  <span>{showMap ? 'Hide office map' : 'View office map location'}</span>
                </button>

                {showMap && (
                  <div className="mt-3 rounded-2xl overflow-hidden border border-white/20 shadow-lg h-48 sm:h-52 w-full animate-fade-in bg-slate-900">
                    <iframe
                      src={siteConfig.contact.googleMapsEmbedUrl}
                      title="Grace Way Accounting Office Location Map"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full h-full"
                    />
                  </div>
                )}
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
