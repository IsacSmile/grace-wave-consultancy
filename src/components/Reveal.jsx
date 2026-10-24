import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

/**
 * Reusable Reveal component powered by GSAP ScrollTrigger.
 * Uses gsap.context() for StrictMode cleanup and respects prefers-reduced-motion.
 */
export function Reveal({
  children,
  as: Component = 'div',
  className = '',
  delay = 0,
  duration = 0.8,
  y = 30,
  stagger = 0,
  start = 'top 88%',
  once = true,
  ...props
}) {
  const containerRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const targets = stagger > 0 
        ? Array.from(containerRef.current.children) 
        : containerRef.current;

      gsap.fromTo(
        targets,
        {
          opacity: 0,
          y: y,
        },
        {
          opacity: 1,
          y: 0,
          duration: duration,
          delay: delay,
          stagger: stagger > 0 ? stagger : undefined,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: start,
            once: once,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [prefersReducedMotion, delay, duration, y, stagger, start, once]);

  return (
    <Component
      ref={containerRef}
      className={className}
      style={prefersReducedMotion ? { opacity: 1, transform: 'none' } : undefined}
      {...props}
    >
      {children}
    </Component>
  );
}
