import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { marqueeWords } from '../data/marquee';
import { useHoverCapable } from '../hooks/useHoverCapable';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useLenis } from './SmoothScroll';
import { Reveal } from './Reveal';

gsap.registerPlugin(ScrollTrigger);

/**
 * Tripled word list (24 words) so that LCM(8 words, 3 styles) = 24.
 * This guarantees that both Group 1 and Group 2 have identical words AND identical style cycles,
 * ensuring a 100% mathematically and visually seamless loop with zero jump or gap.
 */
const GROUP_WORDS = [
  ...marqueeWords,
  ...marqueeWords,
  ...marqueeWords,
];

/**
 * Marquee Component
 * Large italic uppercase text strip scrolling horizontally directly after Services.
 * Cycles three styles: OUTLINE, SOFT, and SOLID with gold hover/active sweep fill.
 */
export function Marquee() {
  const isHoverCapable = useHoverCapable();
  const prefersReducedMotion = useReducedMotion();
  const { lenis } = useLenis();

  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const tweenRef = useRef(null);
  const isPointerOver = useRef(false);

  // GSAP Seamless Loop Animation
  useEffect(() => {
    if (prefersReducedMotion || !trackRef.current || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      // Slower, calmer pace: ~75s on mobile, ~110s on desktop
      const duration = isMobile ? 75 : 110;

      // Track translates by -50% (exactly 1 group width) then loops indefinitely
      tweenRef.current = gsap.to(trackRef.current, {
        xPercent: -50,
        ease: 'none',
        duration: duration,
        repeat: -1,
      });

      // Pause animation when section is out of viewport
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => {
          if (self.isActive) {
            if (!document.hidden && tweenRef.current) {
              tweenRef.current.play();
            }
          } else {
            if (tweenRef.current) {
              tweenRef.current.pause();
            }
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // Desktop Hover Smooth Pause / Resume (Only pauses when hovering directly over text words)
  useEffect(() => {
    if (!isHoverCapable || prefersReducedMotion) return;

    const section = sectionRef.current;
    if (!section) return;

    const pauseMarquee = () => {
      if (!isPointerOver.current && tweenRef.current) {
        isPointerOver.current = true;
        gsap.to(tweenRef.current, {
          timeScale: 0,
          duration: 0.4,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }
    };

    const resumeMarquee = () => {
      if (isPointerOver.current && tweenRef.current) {
        isPointerOver.current = false;
        gsap.to(tweenRef.current, {
          timeScale: 1,
          duration: 0.4,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }
    };

    // Pause when pointer enters a text word
    const handlePointerOver = (e) => {
      if (e.target && e.target.closest('.marquee-word')) {
        pauseMarquee();
      }
    };

    // Resume when pointer leaves a text word
    const handlePointerOut = (e) => {
      const nextWord = e.relatedTarget && e.relatedTarget.closest('.marquee-word');
      if (!nextWord) {
        resumeMarquee();
      }
    };

    // Position-based verification on pointermove
    const handlePointerMove = (e) => {
      const isOverWord = Boolean(e.target && e.target.closest('.marquee-word'));
      if (isOverWord) {
        pauseMarquee();
      } else {
        resumeMarquee();
      }
    };

    const handleWindowLeave = () => {
      resumeMarquee();
    };

    section.addEventListener('pointerover', handlePointerOver);
    section.addEventListener('pointerout', handlePointerOut);
    section.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerleave', handleWindowLeave);

    return () => {
      section.removeEventListener('pointerover', handlePointerOver);
      section.removeEventListener('pointerout', handlePointerOut);
      section.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handleWindowLeave);
    };
  }, [isHoverCapable, prefersReducedMotion]);

  // Lenis Scroll Velocity Reaction: subtly nudges timeScale up to 2.5x and eases back
  useEffect(() => {
    if (!lenis || prefersReducedMotion) return;

    const handleScroll = ({ velocity }) => {
      if (isPointerOver.current || !tweenRef.current) return;
      const absVel = Math.abs(velocity || 0);
      if (absVel > 0.1) {
        const targetScale = Math.min(1.6, 1 + absVel * 0.02);
        gsap.to(tweenRef.current, {
          timeScale: targetScale,
          duration: 0.15,
          ease: 'power1.out',
          overwrite: 'auto',
          onComplete: () => {
            if (!isPointerOver.current && tweenRef.current) {
              gsap.to(tweenRef.current, {
                timeScale: 1,
                duration: 0.5,
                ease: 'power2.out',
                overwrite: 'auto',
              });
            }
          },
        });
      }
    };

    lenis.on('scroll', handleScroll);
    return () => {
      lenis.off('scroll', handleScroll);
    };
  }, [lenis, prefersReducedMotion]);

  // Tab Visibility Listener: pause when tab hidden, resume when visible in viewport
  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        tweenRef.current?.pause();
      } else if (sectionRef.current) {
        const inView = ScrollTrigger.isInViewport(sectionRef.current);
        if (inView) {
          tweenRef.current?.play();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [prefersReducedMotion]);

  // Mobile / Touch: Center-fill with IntersectionObserver (middle 10% of screen)
  useEffect(() => {
    if (isHoverCapable || prefersReducedMotion || !trackRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          if (entry.isIntersecting) {
            el.classList.add('is-active');
          } else {
            if (!el.dataset.touchActive) {
              el.classList.remove('is-active');
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '0px -45% 0px -45%',
        threshold: 0,
      }
    );

    const words = trackRef.current.querySelectorAll('.marquee-word');
    words.forEach((w) => observer.observe(w));

    return () => observer.disconnect();
  }, [isHoverCapable, prefersReducedMotion]);

  // Touch tap handler: toggles fill for 1.2s on mobile
  const handleWordTap = (e) => {
    if (isHoverCapable || prefersReducedMotion) return;
    const el = e.currentTarget;
    el.dataset.touchActive = 'true';
    el.classList.add('is-active');

    setTimeout(() => {
      delete el.dataset.touchActive;
      const rect = el.getBoundingClientRect();
      const bandLeft = window.innerWidth * 0.45;
      const bandRight = window.innerWidth * 0.55;
      const isInsideBand = rect.right >= bandLeft && rect.left <= bandRight;
      if (!isInsideBand) {
        el.classList.remove('is-active');
      }
    }, 1200);
  };

  // Helper to determine style type: 0 -> OUTLINE, 1 -> SOFT, 2 -> SOLID
  const getStyleClass = (idx) => {
    const cycle = idx % 3;
    if (cycle === 0) return 'marquee-word-outline';
    if (cycle === 1) return 'marquee-word-soft';
    return 'marquee-word-solid';
  };

  // ================= REDUCED MOTION STATIC LAYOUT =================
  if (prefersReducedMotion) {
    return (
      <section
        id="services-marquee"
        aria-label="Core Services List"
        className="w-full bg-[#F8FAFF] py-10 md:py-16 overflow-hidden border-b border-[#0A1F4D]/10"
      >
        <style>{marqueeStyles}</style>
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-x-6 md:gap-x-10 gap-y-4">
            {marqueeWords.map((word, idx) => (
              <React.Fragment key={word}>
                <span
                  tabIndex={0}
                  className={`marquee-word ${getStyleClass(idx)} marquee-word-reduced focus:outline-none focus:ring-2 focus:ring-[#C5A059] rounded-md`}
                >
                  {word}
                </span>
                {idx < marqueeWords.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="w-2.5 h-2.5 rotate-45 bg-[#C5A059] shrink-0 opacity-85 select-none"
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ================= SEAMLESS ANIMATED MARQUEE =================
  return (
    <section
      id="services-marquee"
      ref={sectionRef}
      aria-label="Core Services Marquee"
      className="w-full bg-[#F8FAFF] py-10 md:py-16 overflow-hidden relative select-none"
    >
      <style>{marqueeStyles}</style>

      {/* Visually hidden accessible text line for screen readers */}
      <span className="sr-only">
        {marqueeWords.join(', ')}
      </span>

      {/* Band with edge-fade linear gradient mask and Reveal entrance */}
      <Reveal
        y={24}
        start="top 85%"
        once={true}
        className="w-full overflow-hidden"
      >
        <div
          className="w-full overflow-hidden py-3"
          style={{
            maskImage:
              'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          }}
        >
          {/* Continuous scrolling track (Transform-only animation) */}
          <div
            ref={trackRef}
            aria-hidden="true"
            className="flex flex-nowrap items-center will-change-transform w-max"
          >
            {/* Group 1: 24 words */}
            <div className="flex items-center gap-8 md:gap-14 shrink-0 pr-8 md:pr-14">
              {GROUP_WORDS.map((word, idx) => (
                <React.Fragment key={`g1-${word}-${idx}`}>
                  <span
                    onClick={handleWordTap}
                    className={`marquee-word ${getStyleClass(idx)}`}
                  >
                    {word}
                  </span>
                  <span
                    aria-hidden="true"
                    className="w-2.5 h-2.5 rotate-45 bg-[#C5A059] shrink-0 opacity-85 select-none pointer-events-none"
                  />
                </React.Fragment>
              ))}
            </div>

            {/* Group 2: 24 words (identical clone for seamless -50% loop) */}
            <div aria-hidden="true" className="flex items-center gap-8 md:gap-14 shrink-0 pr-8 md:pr-14">
              {GROUP_WORDS.map((word, idx) => (
                <React.Fragment key={`g2-${word}-${idx}`}>
                  <span
                    onClick={handleWordTap}
                    className={`marquee-word ${getStyleClass(idx)}`}
                  >
                    {word}
                  </span>
                  <span
                    aria-hidden="true"
                    className="w-2.5 h-2.5 rotate-45 bg-[#C5A059] shrink-0 opacity-85 select-none pointer-events-none"
                  />
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/**
 * Scoped styles for marquee typography and GPU-accelerated gradient sweep fills.
 */
const marqueeStyles = `
  .marquee-word {
    font-size: clamp(2.75rem, 9vw, 7rem);
    font-family: "Plus Jakarta Sans", system-ui, -apple-system, sans-serif;
    font-weight: 800;
    font-style: italic;
    text-transform: uppercase;
    letter-spacing: -0.035em;
    line-height: 1;
    display: inline-block;
    cursor: default;
    user-select: none;
    transform: skewX(-8deg) translateY(0);
    transform-origin: center bottom;
    transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), background-size 0.6s cubic-bezier(0.22, 1, 0.36, 1);
    -webkit-font-smoothing: antialiased;
  }

  @media (hover: hover) and (pointer: fine) {
    .marquee-word:hover {
      transform: skewX(-4deg) translateY(-4px);
    }
  }

  .marquee-word.is-active {
    transform: skewX(-4deg) translateY(-4px);
  }

  /* 1. OUTLINE: transparent fill, 1.5px navy text-stroke. Fills gold on hover/active while keeping stroke */
  .marquee-word-outline {
    background-image: linear-gradient(90deg, #D4AF37 0%, #C5A059 100%);
    background-size: 0% 100%;
    background-repeat: no-repeat;
    background-position: left center;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    -webkit-text-stroke: 1.5px #0A1F4D;
  }

  @media (hover: hover) and (pointer: fine) {
    .marquee-word-outline:hover {
      background-size: 100% 100%;
      -webkit-text-stroke: 1.5px #0A1F4D;
    }
  }

  .marquee-word-outline.is-active {
    background-size: 100% 100%;
    -webkit-text-stroke: 1.5px #0A1F4D;
  }

  /* 2. SOFT: readable soft light-blue tint fill, no stroke. Sweeps gold on hover/active */
  .marquee-word-soft {
    background-image: linear-gradient(90deg, #D4AF37 0%, #C5A059 100%), linear-gradient(90deg, #829DB9 0%, #829DB9 100%);
    background-size: 0% 100%, 100% 100%;
    background-repeat: no-repeat;
    background-position: left center, left center;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    -webkit-text-stroke: 0 transparent;
  }

  @media (hover: hover) and (pointer: fine) {
    .marquee-word-soft:hover {
      background-size: 100% 100%, 100% 100%;
    }
  }

  .marquee-word-soft.is-active {
    background-size: 100% 100%, 100% 100%;
  }

  /* 3. SOLID: navy fill (#0A1F4D), no stroke. Sweeps gold on hover/active */
  .marquee-word-solid {
    background-image: linear-gradient(90deg, #D4AF37 0%, #C5A059 100%), linear-gradient(90deg, #0A1F4D 0%, #0A1F4D 100%);
    background-size: 0% 100%, 100% 100%;
    background-repeat: no-repeat;
    background-position: left center, left center;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    -webkit-text-stroke: 0 transparent;
  }

  @media (hover: hover) and (pointer: fine) {
    .marquee-word-solid:hover {
      background-size: 100% 100%, 100% 100%;
    }
  }

  .marquee-word-solid.is-active {
    background-size: 100% 100%, 100% 100%;
  }

  /* Reduced motion instant fill */
  .marquee-word-reduced {
    transition: none !important;
  }

  .marquee-word-reduced:hover,
  .marquee-word-reduced:focus-visible {
    background-size: 100% 100%, 100% 100% !important;
    transform: skewX(-4deg) translateY(-4px) !important;
  }
`;
