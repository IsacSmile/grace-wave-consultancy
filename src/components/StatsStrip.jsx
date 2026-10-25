import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FileCheck2, ThumbsUp, Users, Award, Smile } from 'lucide-react';
import { statsData } from '../data/stats';
import { useReducedMotion } from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

const iconMap = {
  FileCheck2,
  ThumbsUp,
  Smile,
  Users,
  Award,
};

export function StatsStrip() {
  const sectionRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  // Dynamically calculate grid columns based on stats count (adapts to 2, 3, or 4 items)
  const getGridColsClass = (length) => {
    switch (length) {
      case 2:
        return 'grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto';
      case 3:
        return 'grid-cols-1 sm:grid-cols-3';
      default:
        // 4 items (or default): 2x2 on mobile, 4-in-a-row on lg+
        return 'grid-cols-2 lg:grid-cols-4';
    }
  };

  useEffect(() => {
    if (!sectionRef.current) return;

    const cards = sectionRef.current.querySelectorAll('.stat-strip-card');
    const numbers = sectionRef.current.querySelectorAll('.stat-number-val');

    // If reduced motion is preferred, render final values immediately
    if (prefersReducedMotion) {
      cards.forEach((card) => {
        card.style.opacity = '1';
        card.style.transform = 'none';
      });
      numbers.forEach((numEl, idx) => {
        if (numEl && statsData[idx]) {
          numEl.textContent = statsData[idx].value.toLocaleString();
        }
      });
      return;
    }

    const ctx = gsap.context(() => {
      // Check if page loaded already scrolled past the strip
      const rect = sectionRef.current.getBoundingClientRect();
      const isAlreadyPast = rect.top < window.innerHeight * 0.85;

      if (isAlreadyPast) {
        cards.forEach((card) => {
          gsap.set(card, { opacity: 1, y: 0 });
        });
        numbers.forEach((numEl, idx) => {
          if (numEl && statsData[idx]) {
            numEl.textContent = statsData[idx].value.toLocaleString();
          }
        });
        return;
      }

      // Timeline: Reveal all cards at once simultaneously, THEN run counters
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          once: true,
        },
      });

      // 1. Reveal all cards together at once (no stagger)
      tl.fromTo(
        cards,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );

      // 2. Then all counters count up together in parallel
      cards.forEach((_, idx) => {
        const numEl = numbers[idx];
        const targetVal = statsData[idx]?.value || 0;
        const counterObj = { val: 0 };

        tl.to(
          counterObj,
          {
            val: targetVal,
            duration: 2.0,
            ease: 'power2.out',
            snap: { val: 1 },
            onUpdate: () => {
              if (numEl) {
                numEl.textContent = Math.round(counterObj.val).toLocaleString();
              }
            },
          },
          idx === 0 ? '>+0.05' : '<' // start right after cards reveal, and all counters run in parallel
        );
      });

      // Refresh ScrollTrigger after fonts/images load for exact position calculation
      if (document.fonts?.ready) {
        document.fonts.ready.then(() => ScrollTrigger.refresh());
      }
      const handleWindowLoad = () => ScrollTrigger.refresh();
      window.addEventListener('load', handleWindowLoad);

      return () => {
        window.removeEventListener('load', handleWindowLoad);
      };
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  if (!statsData || statsData.length === 0) return null;

  return (
    <section
      id="stats-strip"
      ref={sectionRef}
      aria-label="Company highlights"
      data-cursor-theme="dark"
      className="relative w-full bg-[#0A1F4D] text-white py-10 sm:py-14 border-t border-b border-navy-800/90 overflow-hidden"
    >
      {/* Decorative Background Elements (CSS/SVG, hidden on mobile) */}
      <div
        className="hidden md:block absolute -top-24 right-[10%] w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />
      <div
        className="hidden md:block absolute -bottom-20 left-[5%] w-72 h-72 rounded-full bg-teal-400/10 blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />
      <svg
        className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none opacity-10 -z-10"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 240"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M0,120 Q360,20 720,120 T1440,120"
          stroke="#38BDF8"
          strokeWidth="1.5"
          strokeDasharray="4 6"
        />
      </svg>

      {/* Centered Cards Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <dl className={`grid ${getGridColsClass(statsData.length)} gap-3.5 sm:gap-6`}>
          {statsData.map((stat) => {
            const Icon = iconMap[stat.icon] || FileCheck2;

            return (
              <div
                key={stat.id}
                className="stat-strip-card relative flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-3.5 sm:gap-4 p-4 sm:p-5 lg:p-6 rounded-2xl border border-white/15 bg-white/[0.05] backdrop-blur-xs hover:border-white/30 transition-colors shadow-sm"
                style={prefersReducedMotion ? { opacity: 1, transform: 'none' } : undefined}
              >
                {/* Circular White Icon Badge (56px-64px desktop, 44px mobile) */}
                <div className="w-11 h-11 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-white text-blue-600 flex items-center justify-center shrink-0 shadow-md">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[#0066FF]" />
                </div>

                {/* Number & Label */}
                <div className="flex-1 min-w-0">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="m-0 leading-none">
                    {/* Screen reader full value */}
                    <span className="sr-only">
                      {stat.value}{stat.suffix} {stat.label}
                    </span>

                    {/* Visual animated counter + persistent bright blue suffix */}
                    <div
                      aria-hidden="true"
                      className="font-heading font-black text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight flex items-baseline justify-center sm:justify-start"
                    >
                      <span className="stat-number-val">
                        {prefersReducedMotion ? stat.value.toLocaleString() : '0'}
                      </span>
                      <span className="text-[#38BDF8] ml-0.5">
                        {stat.suffix}
                      </span>
                    </div>

                    <div className="text-xs sm:text-sm font-semibold text-slate-200 mt-1 leading-tight truncate">
                      {stat.label}
                    </div>
                  </dd>
                </div>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
