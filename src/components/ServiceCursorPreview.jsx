import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

const PREVIEW_WIDTH = 300;
const PREVIEW_HEIGHT = 380;
const VIEWPORT_MARGIN = 20;

/**
 * ServiceCursorPreview
 * Desktop-only floating preview card that follows the cursor using GSAP quickTo.
 * Hidden whenever any service accordion panel is open (isAnyOpen === true).
 * Clamped inside the viewport, tilts with mouse velocity, and crossfades stacked images.
 */
export function ServiceCursorPreview({
  services,
  containerRef,
  activeHoverIndex,
  isAnyOpen = false,
  focusedIndex = -1,
  focusedElement = null,
  isHoverCapable = true,
}) {
  const previewRef = useRef(null);
  const imageRefs = useRef([]);
  const quickX = useRef(null);
  const quickY = useRef(null);
  const quickRot = useRef(null);
  const settleTimer = useRef(null);
  const visibilityTween = useRef(null);
  const lastPointerPos = useRef({ clientX: 0, clientY: 0 });

  // Track pointer entering/leaving the list container (no per-mousemove React state)
  const [isPointerInside, setIsPointerInside] = useState(false);

  // Preload and decode images on idle or first mount
  useEffect(() => {
    const preload = () => {
      services.forEach((s) => {
        if (!s.image) return;
        const img = new Image();
        img.src = s.image;
        if (img.decode) {
          img.decode().catch(() => {});
        }
      });
    };

    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        const handle = window.requestIdleCallback(preload);
        return () => window.cancelIdleCallback(handle);
      } else {
        const timer = setTimeout(preload, 1200);
        return () => clearTimeout(timer);
      }
    }
  }, [services]);

  // Initialize GSAP quickTo setters
  useEffect(() => {
    if (!previewRef.current) return;

    quickX.current = gsap.quickTo(previewRef.current, 'x', {
      duration: 0.6,
      ease: 'power3.out',
    });
    quickY.current = gsap.quickTo(previewRef.current, 'y', {
      duration: 0.6,
      ease: 'power3.out',
    });
    quickRot.current = gsap.quickTo(previewRef.current, 'rotation', {
      duration: 0.5,
      ease: 'power3.out',
    });

    return () => {
      clearTimeout(settleTimer.current);
      if (visibilityTween.current) {
        visibilityTween.current.kill();
      }
    };
  }, []);

  // Listen to pointer events on the list container
  useEffect(() => {
    const container = containerRef?.current;
    if (!container || !previewRef.current) return;

    const handlePointerEnter = (e) => {
      lastPointerPos.current = { clientX: e.clientX, clientY: e.clientY };
      setIsPointerInside(true);

      // If a panel is open or keyboard focus is active, do not position for cursor
      if (isAnyOpen || focusedIndex !== -1) return;

      const targetX = e.clientX - PREVIEW_WIDTH * 0.45;
      const targetY = e.clientY - PREVIEW_HEIGHT * 0.45;
      const clampedX = Math.max(
        VIEWPORT_MARGIN,
        Math.min(window.innerWidth - PREVIEW_WIDTH - VIEWPORT_MARGIN, targetX)
      );
      const clampedY = Math.max(
        VIEWPORT_MARGIN,
        Math.min(window.innerHeight - PREVIEW_HEIGHT - VIEWPORT_MARGIN, targetY)
      );

      gsap.set(previewRef.current, {
        x: clampedX,
        y: clampedY,
        rotation: 0,
      });

      if (quickX.current && quickY.current) {
        quickX.current(clampedX);
        quickY.current(clampedY);
      }
    };

    const handlePointerLeave = () => {
      setIsPointerInside(false);
    };

    const handleMouseMove = (e) => {
      lastPointerPos.current = { clientX: e.clientX, clientY: e.clientY };

      // Rule 7: Skip updating quickTo follow while panel is open or keyboard active
      if (isAnyOpen || focusedIndex !== -1 || !isPointerInside) return;

      const targetX = e.clientX - PREVIEW_WIDTH * 0.45;
      const targetY = e.clientY - PREVIEW_HEIGHT * 0.45;

      const clampedX = Math.max(
        VIEWPORT_MARGIN,
        Math.min(window.innerWidth - PREVIEW_WIDTH - VIEWPORT_MARGIN, targetX)
      );
      const clampedY = Math.max(
        VIEWPORT_MARGIN,
        Math.min(window.innerHeight - PREVIEW_HEIGHT - VIEWPORT_MARGIN, targetY)
      );

      if (quickX.current && quickY.current) {
        quickX.current(clampedX);
        quickY.current(clampedY);
      }

      // Tilt based on horizontal velocity
      const velocityX = e.movementX || 0;
      const rotation = Math.max(-8, Math.min(8, velocityX * 0.05));
      if (quickRot.current) {
        quickRot.current(rotation);
        clearTimeout(settleTimer.current);
        settleTimer.current = setTimeout(() => {
          if (quickRot.current) quickRot.current(0);
        }, 100);
      }
    };

    container.addEventListener('pointerenter', handlePointerEnter);
    container.addEventListener('pointerleave', handlePointerLeave);
    container.addEventListener('mousemove', handleMouseMove);

    return () => {
      container.removeEventListener('pointerenter', handlePointerEnter);
      container.removeEventListener('pointerleave', handlePointerLeave);
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, [containerRef, isAnyOpen, focusedIndex, isPointerInside]);

  // Derived single source of truth for visibility:
  // Visible ONLY when hoverCapable, pointer is inside (or keyboard focused), and NO panel is open.
  const isKeyboardActive = focusedIndex !== -1 && Boolean(focusedElement);
  const showPreview =
    isHoverCapable && !isAnyOpen && (isPointerInside || isKeyboardActive);

  // Manage Preview Entrance and Exit with GSAP tween
  useEffect(() => {
    if (!previewRef.current) return;

    if (visibilityTween.current) {
      visibilityTween.current.kill();
    }

    if (showPreview) {
      // If returning to visible from closed panel with cursor inside, sync position to prevent jump
      if (!isKeyboardActive && lastPointerPos.current.clientX > 0) {
        const targetX = lastPointerPos.current.clientX - PREVIEW_WIDTH * 0.45;
        const targetY = lastPointerPos.current.clientY - PREVIEW_HEIGHT * 0.45;
        const clampedX = Math.max(
          VIEWPORT_MARGIN,
          Math.min(window.innerWidth - PREVIEW_WIDTH - VIEWPORT_MARGIN, targetX)
        );
        const clampedY = Math.max(
          VIEWPORT_MARGIN,
          Math.min(window.innerHeight - PREVIEW_HEIGHT - VIEWPORT_MARGIN, targetY)
        );
        gsap.set(previewRef.current, { x: clampedX, y: clampedY, rotation: 0 });
        if (quickX.current && quickY.current) {
          quickX.current(clampedX);
          quickY.current(clampedY);
        }
      }

      gsap.set(previewRef.current, { visibility: 'visible' });
      visibilityTween.current = gsap.to(previewRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.35,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    } else {
      // Fade out immediately, then set visibility: hidden to guarantee it never blocks clicks
      visibilityTween.current = gsap.to(previewRef.current, {
        opacity: 0,
        scale: 0.9,
        duration: 0.25,
        ease: 'power2.out',
        overwrite: 'auto',
        onComplete: () => {
          if (previewRef.current) {
            gsap.set(previewRef.current, { visibility: 'hidden' });
          }
        },
      });
    }
  }, [showPreview, isKeyboardActive]);

  // Rule 5: While a panel is open, row hovers do NOT crossfade images
  const effectiveIndex = focusedIndex !== -1 ? focusedIndex : activeHoverIndex;
  useEffect(() => {
    if (isAnyOpen) return;
    if (effectiveIndex === null || effectiveIndex === undefined || effectiveIndex < 0) return;

    imageRefs.current.forEach((el, idx) => {
      if (!el) return;
      if (idx === effectiveIndex) {
        gsap.fromTo(
          el,
          { scale: 1.08, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.35,
            ease: 'power2.out',
            overwrite: 'auto',
          }
        );
      } else {
        gsap.to(el, {
          opacity: 0,
          duration: 0.35,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }
    });
  }, [effectiveIndex, isAnyOpen]);

  // Rule 6: Keyboard Focus position (only when no panel is open)
  useEffect(() => {
    if (isAnyOpen || focusedIndex === -1 || !focusedElement || !previewRef.current) {
      return;
    }

    const rect = focusedElement.getBoundingClientRect();
    const targetX = Math.min(
      window.innerWidth - PREVIEW_WIDTH - 40,
      rect.right - PREVIEW_WIDTH - 24
    );
    const targetY = Math.max(
      VIEWPORT_MARGIN,
      Math.min(
        window.innerHeight - PREVIEW_HEIGHT - VIEWPORT_MARGIN,
        rect.top + (rect.height - PREVIEW_HEIGHT) / 2
      )
    );

    if (quickX.current && quickY.current && quickRot.current) {
      quickX.current(targetX);
      quickY.current(targetY);
      quickRot.current(0);
    }
  }, [focusedIndex, focusedElement, isAnyOpen]);

  return (
    <div
      ref={previewRef}
      id="service-cursor-preview"
      aria-hidden="true"
      style={{
        width: `${PREVIEW_WIDTH}px`,
        height: `${PREVIEW_HEIGHT}px`,
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 60,
        pointerEvents: 'none',
        opacity: 0,
        visibility: 'hidden',
        transform: 'scale(0.9)',
        transformOrigin: 'center center',
      }}
      className="rounded-2xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(10,31,77,0.38)] border border-white/60 bg-[#0A1F4D]"
    >
      {services.map((svc, i) => (
        <div
          key={svc.id}
          ref={(el) => (imageRefs.current[i] = el)}
          className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
        >
          <img
            src={svc.image}
            alt=""
            width="800"
            height="1000"
            className="w-full h-full object-cover"
            loading="eager"
          />
          {/* Subtle luxury brand gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F4D]/60 via-transparent to-transparent pointer-events-none" />
        </div>
      ))}
    </div>
  );
}
