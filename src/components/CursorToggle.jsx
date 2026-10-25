import React, { useState, useEffect, useRef } from 'react';
import { MousePointer2 } from 'lucide-react';
import { useCursor } from '../context/CursorContext';
import { useHoverCapable } from '../hooks/useHoverCapable';
import { useReducedMotion } from '../hooks/useReducedMotion';

export function CursorToggle() {
  const { enabled, toggle } = useCursor();
  const isHoverCapable = useHoverCapable();
  const prefersReducedMotion = useReducedMotion();

  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimer = useRef(null);

  // Hide tooltip when scrolling
  useEffect(() => {
    const onScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimer.current);
      scrollTimer.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(scrollTimer.current);
    };
  }, []);

  // Visible only on lg+ AND hover-capable AND not reduced-motion
  if (!isHoverCapable || prefersReducedMotion) {
    return null;
  }

  const showTooltip = (isHovered || isFocused) && !isScrolling;

  return (
    <div className="relative hidden lg:inline-flex items-center">
      <button
        type="button"
        onClick={toggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        aria-pressed={enabled}
        aria-label="Custom cursor"
        className="w-10 h-10 rounded-full border border-[#0B1B4D]/12 bg-white flex items-center justify-center text-[#0B1B4D] hover:border-[#0B1B4D]/30 shadow-xs hover:shadow-sm active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
      >
        <div className="relative w-[18px] h-[18px] flex items-center justify-center pointer-events-none">
          <MousePointer2 className="w-[18px] h-[18px] text-[#0B1B4D] shrink-0" />
          {/* Diagonal slash line drawn via stroke-dashoffset shown ONLY when off */}
          <svg
            viewBox="0 0 18 18"
            className="absolute inset-0 w-[18px] h-[18px] pointer-events-none"
            aria-hidden="true"
          >
            <line
              x1="2"
              y1="16"
              x2="16"
              y2="2"
              stroke="#0B1B4D"
              strokeWidth="2"
              strokeLinecap="round"
              style={{
                strokeDasharray: 20,
                strokeDashoffset: enabled ? 20 : 0,
                transition: 'stroke-dashoffset 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            />
          </svg>
        </div>

        {/* Visually hidden live status text for screen readers */}
        <span className="sr-only" aria-live="polite">
          {enabled ? 'Custom cursor on' : 'Custom cursor off'}
        </span>
      </button>

      {/* Tooltip on hover/focus: small navy pill below button */}
      <div
        role="tooltip"
        className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-[#0B1B4D] text-white text-[11px] font-semibold tracking-wider uppercase whitespace-nowrap shadow-md pointer-events-none transition-opacity duration-200 z-50 ${
          showTooltip ? 'opacity-100' : 'opacity-0'
        }`}
      >
        Cursor: {enabled ? 'On' : 'Off'}
      </div>
    </div>
  );
}
