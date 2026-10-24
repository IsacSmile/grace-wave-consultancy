import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles } from 'lucide-react';
import { processSteps } from '../data/process';
import { ProcessWheel } from './ProcessWheel';
import { ProcessContent } from './ProcessContent';
import { ProcessList } from './ProcessList';
import { useLenis } from './SmoothScroll';
import { useReducedMotion } from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

export function Process() {
  const sectionRef = useRef(null);
  const wheelRef = useRef(null);
  const arcRef = useRef(null);
  const itemRefs = useRef([]);
  const scrollTriggerRef = useRef(null);
  const snapTimerRef = useRef(null);
  const currentActiveRef = useRef(0);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isShortViewport, setIsShortViewport] = useState(false);

  const { lenis } = useLenis();
  const prefersReducedMotion = useReducedMotion();

  // Viewport height check: under 520px uses static fallback (landscape phones)
  useEffect(() => {
    const handleResize = () => {
      setIsShortViewport(window.innerHeight < 520);
    };
    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Refresh ScrollTrigger after fonts load
  useEffect(() => {
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }
  }, []);

  // Jump to step on click, focus, or keyboard
  const handleStepSelect = (idx) => {
    if (!scrollTriggerRef.current) return;
    const st = scrollTriggerRef.current;
    const n = processSteps.length;
    const targetProgress = idx / (n - 1);
    const targetScroll = st.start + targetProgress * (st.end - st.start);

    if (lenis) {
      lenis.scrollTo(targetScroll, {
        duration: 0.8,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (prefersReducedMotion || isShortViewport || !sectionRef.current || !wheelRef.current) return;

    const ctx = gsap.context(() => {
      const n = processSteps.length;
      const isLg = window.innerWidth >= 1024;
      const stepAngle = isLg ? 22 : 24;
      const totalRotation = -(n - 1) * stepAngle;

      // 1. Arc stroke-like entrance (scaleY from center) and visible numbers entrance
      if (arcRef.current) {
        gsap.fromTo(
          arcRef.current,
          { scaleY: 0, opacity: 0 },
          {
            scaleY: 1,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              once: true,
            },
          }
        );
      }

      const validItems = itemRefs.current.filter(Boolean);
      if (validItems.length > 0) {
        gsap.fromTo(
          validItems,
          { opacity: 0, scale: 0.75 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              once: true,
            },
          }
        );
      }

      // 2. Wheel rotation driven by ScrollTrigger pin scrub
      const tween = gsap.to(wheelRef.current, {
        rotation: totalRotation,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          start: 'top top',
          end: () => `+=${(n - 1) * window.innerHeight * 1.0}`,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = self.progress;
            const f = Math.max(0, Math.min(n - 1, progress * (n - 1)));
            const maxNeighbour = 1.35;

            // Set --d on each item via style.setProperty for 60fps/120fps CSS interpolation
            itemRefs.current.forEach((el, idx) => {
              if (!el) return;
              const d = Math.abs(idx - f);
              el.style.setProperty('--d', d.toFixed(3));
              el.setAttribute('data-hidden', d > maxNeighbour ? 'true' : 'false');
            });

            // Update active index for content transition when rounded step changes
            const rounded = Math.round(f);
            if (rounded !== currentActiveRef.current) {
              currentActiveRef.current = rounded;
              setActiveIndex(rounded);
            }

            // Snap: after scrolling stops for 160ms strictly between steps
            clearTimeout(snapTimerRef.current);
            if (progress > 0.04 && progress < 0.96) {
              snapTimerRef.current = setTimeout(() => {
                const currentP = self.progress;
                if (currentP > 0.04 && currentP < 0.96) {
                  const nearestStep = Math.round(currentP * (n - 1));
                  const targetP = nearestStep / (n - 1);
                  if (Math.abs(targetP - currentP) > 0.015) {
                    const targetScroll = self.start + targetP * (self.end - self.start);
                    if (lenis) {
                      lenis.scrollTo(targetScroll, {
                        duration: 0.75,
                        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                      });
                    } else {
                      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
                    }
                  }
                }
              }, 160);
            }
          },
        },
      });

      scrollTriggerRef.current = tween.scrollTrigger;
    }, sectionRef);

    return () => {
      clearTimeout(snapTimerRef.current);
      ctx.revert();
    };
  }, [prefersReducedMotion, isShortViewport, lenis]);

  // Fallback mode for reduced motion or short viewports (<520px)
  if (prefersReducedMotion || isShortViewport) {
    return <ProcessList steps={processSteps} />;
  }

  return (
    <section
      id="process"
      ref={sectionRef}
      aria-labelledby="process-heading"
      className="process-section relative w-full h-[100svh] bg-white text-slate-800 overflow-hidden select-none"
    >
      {/* Optional Decoration: Faint Dotted Grid in right third (lg only, pure CSS, under 8% opacity) */}
      <div
        className="hidden lg:block absolute right-0 top-0 bottom-0 w-1/3 process-dotted-grid pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* Optional Decoration: Large faint outlined step number in bottom-right corner (lg only, aria-hidden, under 8% opacity) */}
      <div
        className="hidden lg:block absolute right-10 bottom-6 font-heading font-extrabold text-[180px] leading-none process-bg-num pointer-events-none z-0 select-none transition-all duration-300"
        aria-hidden="true"
      >
        {processSteps[activeIndex]?.number || '01'}
      </div>

      {/* Accessible semantic heading for screen readers & SEO */}
      <h2 id="process-heading" className="sr-only">
        How We Work: From Enquiry to Onboarding
      </h2>

      {/* Top Header: Badge + Mobile Step Counter */}
      <div className="absolute top-0 left-0 right-0 pt-[74px] sm:pt-[84px] px-5 sm:px-6 lg:px-8 pointer-events-none z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.14em] bg-blue-50/90 border border-blue-200/90 text-[#0B1B4D] pointer-events-auto shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>HOW WE WORK</span>
          </div>

          {/* Mobile small "01 / 04" counter */}
          <div
            className="lg:hidden pointer-events-auto shrink-0 inline-flex items-center gap-1 font-numeric-slashed text-[11px] sm:text-xs font-bold text-gold-700 tracking-wider bg-gold-50/90 px-2.5 py-0.5 sm:py-1 rounded-full border border-gold-200/60"
            aria-hidden="true"
          >
            <span>STEP {processSteps[activeIndex]?.number || '01'}</span>
            <span className="text-gold-400">/</span>
            <span className="text-gold-600">04</span>
          </div>
        </div>
      </div>

      {/* Rotating Wheel (Arc, Dots, Numbers) */}
      <ProcessWheel
        steps={processSteps}
        wheelRef={wheelRef}
        arcRef={arcRef}
        itemRefs={itemRefs}
        activeIndex={activeIndex}
        onStepSelect={handleStepSelect}
      />

      {/* Content Column (Title, Description, Checklist, Chips, CTA) */}
      <ProcessContent
        steps={processSteps}
        activeIndex={activeIndex}
      />

      {/* Desktop Progress Indicator: Thin vertical gold progress line with 4 ticks at far right edge (lg only) */}
      <div
        className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col items-center gap-3 pointer-events-none z-20"
        aria-hidden="true"
      >
        <div className="relative w-[2px] h-36 bg-slate-200/80 rounded-full">
          {/* Active progress bar */}
          <div
            className="absolute top-0 left-0 w-full bg-gold-500 rounded-full transition-all duration-200 ease-out"
            style={{
              height: `${(activeIndex / (processSteps.length - 1)) * 100}%`,
            }}
          />
          {/* 4 Step Ticks */}
          {processSteps.map((_, i) => (
            <div
              key={i}
              className={`absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full border transition-all duration-200 ${
                i <= activeIndex
                  ? 'bg-gold-500 border-gold-400 scale-110'
                  : 'bg-white border-slate-300'
              }`}
              style={{
                top: `${(i / (processSteps.length - 1)) * 100}%`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}
        </div>
        <div className="flex flex-col items-center font-numeric-slashed text-[11px] font-bold text-slate-400 leading-tight">
          <span className="text-navy-950 font-extrabold">{processSteps[activeIndex]?.number || '01'}</span>
          <span className="text-slate-300">/</span>
          <span>04</span>
        </div>
      </div>

      {/* Visually hidden <ol> containing all four steps with points & youProvide for screen readers and SEO */}
      <ol className="sr-only">
        {processSteps.map((step) => (
          <li key={step.id}>
            <h3>
              Step {step.number}: {step.title}
            </h3>
            <p>{step.text}</p>
            {step.points && (
              <div>
                <h4>What happens:</h4>
                <ul>
                  {step.points.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </div>
            )}
            {step.youProvide && (
              <div>
                <h4>What we may need from you:</h4>
                <ul>
                  {step.youProvide.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
