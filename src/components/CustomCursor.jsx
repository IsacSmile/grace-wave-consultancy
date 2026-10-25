import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useCursor } from '../context/CursorContext';
import { useHoverCapable } from '../hooks/useHoverCapable';
import { useReducedMotion } from '../hooks/useReducedMotion';

const evaluateStateFromElement = (el) => {
  if (!el) return { state: 'default', theme: 'light' };

  // 1. Theme detection
  const isDark = Boolean(el.closest('[data-cursor-theme="dark"]'));
  const theme = isDark ? 'dark' : 'light';

  // 2. Text / Native inputs (custom cursor hidden, native cursor takes over)
  if (
    el.closest(
      'input, textarea, select, [contenteditable="true"], [contenteditable=""]'
    )
  ) {
    return { state: 'text', theme };
  }

  if (el.closest('iframe, video, [data-cursor="native"]')) {
    return { state: 'native', theme };
  }

  // 3. Interactive clickable elements -> gold expanded ring
  if (
    el.closest(
      'a, button, [role="button"], summary, label[for], [data-cursor="link"], .process-step-num'
    )
  ) {
    return { state: 'link', theme };
  }

  return { state: 'default', theme };
};

export function CustomCursor() {
  const { enabled } = useCursor();
  const isHoverCapable = useHoverCapable();
  const prefersReducedMotion = useReducedMotion();

  const wrapperRef = useRef(null);
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  const quickDotX = useRef(null);
  const quickDotY = useRef(null);
  const quickRingX = useRef(null);
  const quickRingY = useRef(null);

  const lastX = useRef(-100);
  const lastY = useRef(-100);
  const hasPositioned = useRef(false);
  const rafId = useRef(null);

  const shouldRender = isHoverCapable && enabled && !prefersReducedMotion;

  useEffect(() => {
    if (!shouldRender) {
      document.documentElement.classList.remove('has-custom-cursor');
      return;
    }

    const wrapper = wrapperRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!wrapper || !dot || !ring) return;

    // Use GSAP Context for StrictMode and seamless cleanup
    const ctx = gsap.context(() => {
      quickDotX.current = gsap.quickTo(dot, 'x', {
        duration: 0.08,
        ease: 'power3.out',
      });
      quickDotY.current = gsap.quickTo(dot, 'y', {
        duration: 0.08,
        ease: 'power3.out',
      });
      quickRingX.current = gsap.quickTo(ring, 'x', {
        duration: 0.45,
        ease: 'power3.out',
      });
      quickRingY.current = gsap.quickTo(ring, 'y', {
        duration: 0.45,
        ease: 'power3.out',
      });

      // If we already had a position from previous enable, snap directly
      if (lastX.current >= 0 && lastY.current >= 0) {
        hasPositioned.current = true;
        document.documentElement.classList.add('has-custom-cursor');
        gsap.set([dot, ring], { x: lastX.current, y: lastY.current });
        wrapper.style.opacity = '1';
        const el = document.elementFromPoint(lastX.current, lastY.current);
        const { state, theme } = evaluateStateFromElement(el);
        wrapper.dataset.state = state;
        wrapper.dataset.theme = theme;
      }
    });

    const onPointerMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      lastX.current = x;
      lastY.current = y;

      if (!hasPositioned.current) {
        hasPositioned.current = true;
        document.documentElement.classList.add('has-custom-cursor');
        gsap.set([dot, ring], { x, y });
        wrapper.style.opacity = '1';
      }

      quickDotX.current?.(x);
      quickDotY.current?.(y);
      quickRingX.current?.(x);
      quickRingY.current?.(y);

      if (wrapper.dataset.state === 'hidden') {
        const el = document.elementFromPoint(x, y);
        const { state, theme } = evaluateStateFromElement(el);
        wrapper.dataset.state = state;
        wrapper.dataset.theme = theme;
      }
    };

    const onPointerOver = (e) => {
      const { state, theme } = evaluateStateFromElement(e.target);
      wrapper.dataset.state = state;
      wrapper.dataset.theme = theme;
    };

    const onPointerDown = () => {
      wrapper.dataset.down = 'true';
    };

    const onPointerUp = () => {
      wrapper.dataset.down = 'false';
    };

    const onPointerCancel = () => {
      wrapper.dataset.down = 'false';
    };

    const hideCursor = () => {
      wrapper.dataset.state = 'hidden';
    };

    const onMouseOut = (e) => {
      if (!e.relatedTarget) {
        hideCursor();
      }
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        hideCursor();
      }
    };

    // Stuck-state fix on scroll and resize (rAF throttled elementFromPoint)
    const reevaluateState = () => {
      if (rafId.current) return;
      rafId.current = requestAnimationFrame(() => {
        rafId.current = null;
        if (lastX.current >= 0 && lastY.current >= 0) {
          const el = document.elementFromPoint(lastX.current, lastY.current);
          if (el) {
            const { state, theme } = evaluateStateFromElement(el);
            wrapper.dataset.state = state;
            wrapper.dataset.theme = theme;
          }
        }
      });
    };

    // Attach listeners
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerover', onPointerOver, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('pointercancel', onPointerCancel, { passive: true });

    document.addEventListener('mouseleave', hideCursor);
    document.addEventListener('mouseout', onMouseOut);
    window.addEventListener('blur', hideCursor);
    document.addEventListener('visibilitychange', onVisibilityChange);

    window.addEventListener('scroll', reevaluateState, { passive: true });
    window.addEventListener('resize', reevaluateState, { passive: true });

    if (window.__lenis) {
      window.__lenis.on('scroll', reevaluateState);
    }

    const onPageHide = () => {
      document.documentElement.classList.remove('has-custom-cursor');
    };
    window.addEventListener('pagehide', onPageHide);

    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }

      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerover', onPointerOver);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerCancel);

      document.removeEventListener('mouseleave', hideCursor);
      document.removeEventListener('mouseout', onMouseOut);
      window.removeEventListener('blur', hideCursor);
      document.removeEventListener('visibilitychange', onVisibilityChange);

      window.removeEventListener('scroll', reevaluateState);
      window.removeEventListener('resize', reevaluateState);

      if (window.__lenis) {
        window.__lenis.off('scroll', reevaluateState);
      }

      window.removeEventListener('pagehide', onPageHide);
      ctx.revert();
    };
  }, [shouldRender]);

  if (!shouldRender) return null;

  return (
    <div
      ref={wrapperRef}
      className="custom-cursor-wrapper"
      data-state="default"
      data-theme="light"
      data-down="false"
      aria-hidden="true"
      style={{ opacity: 0 }}
    >
      <div ref={ringRef} className="custom-cursor-ring-mover">
        <div className="custom-cursor-ring" />
      </div>
      <div ref={dotRef} className="custom-cursor-dot-mover">
        <div className="custom-cursor-dot" />
      </div>
    </div>
  );
}
