import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowUpLeft, ArrowUpRight } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { TestimonialSlide } from './TestimonialSlide';
import { testimonials } from '../data/testimonials';
import { siteConfig } from '../data/siteConfig';
import { useHoverCapable } from '../hooks/useHoverCapable';

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const containerRef = useRef(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const isHoverCapable = useHoverCapable();
  const total = testimonials?.length || 0;

  // Conditional Rendering Check
  if (!siteConfig.showTestimonials || total === 0) {
    return null;
  }

  // Update CSS variables for desktop navy panel split position
  const updateDimensions = useCallback(() => {
    if (!containerRef.current) return;
    const containerW = containerRef.current.offsetWidth;
    containerRef.current.style.setProperty('--container-w', `${containerW}px`);

    const photoCard = containerRef.current.querySelector('.testimonial-photo-card');
    if (photoCard) {
      const photoW = photoCard.offsetWidth;
      const photoH = photoCard.offsetHeight;
      containerRef.current.style.setProperty('--photo-w', `${photoW}px`);
      containerRef.current.style.setProperty('--photo-h', `${photoH}px`);
    }
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions, { passive: true });
    return () => window.removeEventListener('resize', updateDimensions);
  }, [updateDimensions]);

  // Next & Prev handlers: simple slide index change
  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    }
  };

  // Touch swipe support (horizontal swipe threshold 40px)
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Ignore mostly vertical gestures so normal page scrolling is never blocked
    if (Math.abs(deltaY) > Math.abs(deltaX)) return;

    if (deltaX < -40) {
      handleNext();
    } else if (deltaX > 40) {
      handlePrev();
    }
  };

  // Circular arrow buttons and counter controls
  const renderControls = () => {
    if (total <= 1) return null;

    return (
      <div className="flex items-center gap-3.5 self-end sm:self-center shrink-0">
        {/* Counter */}
        <span
          className="text-[13px] font-medium text-slate-500 tabular-nums select-none"
          aria-hidden="true"
        >
          {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>

        {/* Circular Arrow Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handlePrev}
            className={`group w-12 h-12 rounded-full bg-[#0B1B4D] flex items-center justify-center transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059] focus-visible:ring-offset-2 cursor-pointer shadow-sm min-w-[44px] min-h-[44px] ${
              isHoverCapable ? 'hover:bg-[#C5A059] hover:-translate-y-0.5' : ''
            }`}
            aria-label="Previous review"
          >
            <ArrowUpLeft
              className={`w-5 h-5 text-white transition-colors ${
                isHoverCapable ? 'group-hover:text-[#0B1B4D]' : ''
              }`}
            />
          </button>

          <button
            type="button"
            onClick={handleNext}
            className={`group w-12 h-12 rounded-full bg-[#0B1B4D] flex items-center justify-center transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059] focus-visible:ring-offset-2 cursor-pointer shadow-sm min-w-[44px] min-h-[44px] ${
              isHoverCapable ? 'hover:bg-[#C5A059] hover:-translate-y-0.5' : ''
            }`}
            aria-label="Next review"
          >
            <ArrowUpRight
              className={`w-5 h-5 text-white transition-colors ${
                isHoverCapable ? 'group-hover:text-[#0B1B4D]' : ''
              }`}
            />
          </button>
        </div>
      </div>
    );
  };

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="relative bg-[#F8FAFF] py-20 md:py-28 overflow-hidden select-none"
    >
      {/* Live region for screen readers */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Review {activeIndex + 1} of {total}: {testimonials[activeIndex]?.name}
      </div>

      <div
        ref={containerRef}
        className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative"
        style={{
          '--container-w': '1280px',
          '--photo-w': '420px',
          '--photo-h': '400px',
        }}
      >
        {/* Section Header */}
        <SectionHeading
          badge="CLIENT FEEDBACK"
          title="What our clients say"
          id="testimonials-heading"
          className="mb-10 md:mb-14 lg:mb-16"
        />

        {/* Carousel Shell */}
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Client reviews"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{ touchAction: 'pan-y' }}
          className="relative outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059]/50 rounded-3xl"
        >
          {/* Navy Panel on Mobile: sits behind top 55% of the photo */}
          <div
            className="lg:hidden absolute left-1/2 -translate-x-1/2 w-screen top-0 pointer-events-none -z-10 bg-[#0B1B4D]"
            style={{
              height: 'calc(var(--photo-h, 400px) * 0.55)',
            }}
            aria-hidden="true"
          />

          {/* Navy Panel on Desktop: full-bleed left, ends 65% across photo */}
          <div
            className="hidden lg:block absolute top-0 bottom-0 pointer-events-none -z-10 bg-[#0B1B4D] overflow-hidden"
            style={{
              left: 'calc(-1 * max(0px, (100vw - var(--container-w, 1280px)) / 2) - 2rem)',
              width: 'calc(max(0px, (100vw - var(--container-w, 1280px)) / 2) + 2rem + var(--photo-w, 420px) * 0.65)',
            }}
            aria-hidden="true"
          >
            {/* Subtle faint diagonal textures (pure CSS) */}
            <div
              className="absolute inset-0 bg-white/[0.04]"
              style={{ clipPath: 'polygon(0 0, 80% 0, 40% 100%, 0% 100%)' }}
            />
            <div
              className="absolute inset-0 bg-white/[0.03]"
              style={{ clipPath: 'polygon(25% 0, 100% 0, 65% 100%, 0 100%)' }}
            />
            <div
              className="absolute inset-0 bg-white/[0.03]"
              style={{ clipPath: 'polygon(55% 0, 100% 0, 90% 100%, 35% 100%)' }}
            />
          </div>

          {/* Horizontal Slide Track: simply slides on next/prev */}
          <div className="overflow-hidden w-full">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${activeIndex * 100}%)`,
              }}
            >
              {testimonials.map((item, idx) => (
                <TestimonialSlide
                  key={item.id}
                  testimonial={item}
                  index={idx}
                  total={total}
                  controls={renderControls()}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
