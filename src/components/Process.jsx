import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageSquare, PhoneCall, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { siteConfig } from '../data/siteConfig';
import { Reveal } from './Reveal';
import { useLenis } from './SmoothScroll';
import { useReducedMotion } from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

const iconMap = {
  MessageSquare: MessageSquare,
  PhoneCall: PhoneCall,
  FileText: FileText,
  CheckCircle2: CheckCircle2,
};

export function Process() {
  const processSectionRef = useRef(null);
  const progressBarRef = useRef(null);
  const { scrollTo } = useLenis();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !processSectionRef.current || !progressBarRef.current) return;

    const ctx = gsap.context(() => {
      // Scrubbed progress line
      gsap.fromTo(
        progressBarRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: processSectionRef.current,
            start: 'top 70%',
            end: 'bottom 80%',
            scrub: 0.5,
          },
        }
      );
    }, processSectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const handleEnquiryClick = (e) => {
    e.preventDefault();
    scrollTo('#contact', 76);
  };

  return (
    <section
      id="process"
      ref={processSectionRef}
      className="py-20 md:py-28 bg-white text-slate-800 border-b border-slate-200 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <Reveal>
            <span className="inline-block px-3.5 py-1 rounded-full bg-navy-50 text-navy-800 text-xs sm:text-sm font-semibold tracking-wide uppercase mb-3 border border-navy-100">
              {siteConfig.process.sectionBadge}
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-navy-950 tracking-tight leading-tight mb-4">
              {siteConfig.process.title}
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              {siteConfig.process.subtitle}
            </p>
          </Reveal>
        </div>

        {/* Process Timeline with Scroll-Scrubbed Progress Line */}
        <div className="relative max-w-4xl mx-auto">
          {/* Background Track Line (hidden on smallest screens, visible sm+) */}
          <div
            className="absolute left-6 sm:left-1/2 top-4 bottom-4 w-1 -translate-x-1/2 bg-slate-200 rounded-full"
            aria-hidden="true"
          >
            {/* Scroll-Scrubbed Animated Progress Bar */}
            <div
              ref={progressBarRef}
              className="w-full h-full bg-gradient-to-b from-navy-900 via-gold-500 to-navy-900 origin-top rounded-full"
              style={prefersReducedMotion ? { transform: 'scaleY(1)' } : undefined}
            />
          </div>

          {/* 4 Steps */}
          <div className="space-y-12 sm:space-y-16 relative">
            {siteConfig.process.steps.map((step, idx) => {
              const IconComponent = iconMap[step.icon] || MessageSquare;
              const isEven = idx % 2 === 1;

              return (
                <div
                  key={step.step}
                  className={`flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10 ${
                    isEven ? 'sm:flex-row-reverse text-left sm:text-right' : 'text-left'
                  }`}
                >
                  {/* Step Card Content */}
                  <div className="w-full sm:w-1/2 pl-14 sm:pl-0">
                    <Reveal delay={idx * 0.08} y={24}>
                      <div className="p-6 sm:p-7 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-sm hover:border-gold-400 hover:shadow-md transition-all">
                        <div className={`flex items-center gap-2 mb-2 ${isEven ? 'sm:justify-end' : ''}`}>
                          <span className="text-xs font-bold text-gold-600 uppercase tracking-wider">
                            Step {step.step} • {step.subtitle}
                          </span>
                        </div>
                        <h3 className="font-heading font-bold text-lg sm:text-xl text-navy-950 mb-2">
                          {step.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </Reveal>
                  </div>

                  {/* Center Node Icon Marker */}
                  <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 w-12 h-12 rounded-2xl bg-navy-950 border-2 border-gold-400 text-gold-400 flex items-center justify-center shadow-md z-10">
                    <IconComponent className="w-5 h-5" />
                  </div>

                  {/* Spacer for opposite column */}
                  <div className="hidden sm:block sm:w-1/2" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Section Bottom CTA */}
        <Reveal delay={0.2}>
          <div className="mt-16 text-center">
            <a
              href="#contact"
              onClick={handleEnquiryClick}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-navy-950 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 shadow-md hover:shadow-gold-glow transition-all"
            >
              <span>Start With Step 01: Free Enquiry</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
