import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { processSteps } from '../data/process';
import { ProcessWheel } from './ProcessWheel';
import { ProcessContent } from './ProcessContent';
import { ProcessList } from './ProcessList';
import { SectionHeading } from './SectionHeading';
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
        duration: 0.7,
        easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
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
      const stepAngle = isLg ? 12 : 22;
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
          end: () => `+=${(n - 1) * window.innerHeight * 0.8}`,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = self.progress;
            const f = progress * (n - 1);
            const isDesktop = window.innerWidth >= 1024;
            const maxNeighbour = isDesktop ? 2.3 : 1.3;

            // Set --d on each item via style.setProperty for 60fps CSS interpolation
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

            // Snap: after scrolling stops for 140ms strictly between 0 and 1
            clearTimeout(snapTimerRef.current);
            if (progress > 0.005 && progress < 0.995) {
              snapTimerRef.current = setTimeout(() => {
                const currentP = self.progress;
                if (currentP > 0.005 && currentP < 0.995) {
                  const nearestStep = Math.round(currentP * (n - 1));
                  const targetP = nearestStep / (n - 1);
                  if (Math.abs(targetP - currentP) > 0.015) {
                    const targetScroll = self.start + targetP * (self.end - self.start);
                    if (lenis) {
                      lenis.scrollTo(targetScroll, {
                        duration: 0.7,
                        easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
                      });
                    } else {
                      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
                    }
                  }
                }
              }, 140);
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
      {/* Top-left: Compact Section Heading */}
      <div className="absolute top-0 left-0 right-0 pt-[92px] px-5 sm:px-6 lg:px-8 pointer-events-none z-30">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            badge="HOW WE WORK"
            title="From enquiry to onboarding"
            className="text-left pointer-events-auto"
          />
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

      {/* Content Column (Title, Description, CTA for Active Step) */}
      <ProcessContent
        steps={processSteps}
        activeIndex={activeIndex}
      />

      {/* Visually hidden <ol> containing all four steps for screen readers and SEO */}
      <ol className="sr-only">
        {processSteps.map((step) => (
          <li key={step.id}>
            <h3>
              Step {step.number}: {step.title}
            </h3>
            <p>{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
