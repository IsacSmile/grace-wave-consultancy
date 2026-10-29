import React from 'react';
import { Star } from 'lucide-react';

/**
 * TestimonialSlide
 * Single slide representing one client review.
 * 
 * - Mobile: single column, photo card on top, text block below.
 * - Desktop (lg): 2 columns (photo 5/12, text 7/12, gap-16, items-center).
 * - Sits in a horizontal sliding flex track.
 */
export function TestimonialSlide({
  testimonial,
  index,
  total,
  controls,
}) {
  const { name, role, quote, rating, image, imageAlt } = testimonial;

  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${total}`}
      className="w-full shrink-0 select-none px-1"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
        {/* Left Column: Photo Card (5 of 12 on lg) */}
        <div className="lg:col-span-5 flex justify-center lg:justify-start">
          <div className="testimonial-photo-card aspect-[4/5] max-h-[420px] w-full max-w-[360px] sm:max-w-[400px] lg:max-w-none rounded-3xl overflow-hidden shadow-[0_24px_60px_-24px_rgba(11,27,77,0.35)] relative bg-[#0B1B4D]/10">
            <img
              src={image}
              alt={imageAlt || `Portrait of ${name}`}
              width={640}
              height={800}
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
              sizes="(max-width: 1023px) 90vw, 420px"
              className="w-full h-full object-cover rounded-3xl select-none"
            />
          </div>
        </div>

        {/* Right Column: Content (7 of 12 on lg) */}
        <div className="testimonial-text-col lg:col-span-7 flex flex-col justify-center text-left relative mt-2 lg:mt-0">
          {/* Optional decorative hollow circle (desktop only) */}
          <div
            className="hidden lg:block absolute -top-4 right-0 w-8 h-8 rounded-full border border-[#0B1B4D]/20 pointer-events-none select-none"
            aria-hidden="true"
          />

          {/* 1. Rating row (only if rating exists) */}
          {typeof rating === 'number' && rating > 0 && (
            <div
              role="img"
              aria-label={`Rated ${rating} out of 5`}
              className="testimonial-rating flex items-center gap-1.5 mb-4 sm:mb-5"
            >
              {[1, 2, 3, 4, 5].map((starVal) => {
                const isFilled = starVal <= rating;
                return (
                  <Star
                    key={starVal}
                    className={`w-4 h-4 lg:w-[18px] lg:h-[18px] ${
                      isFilled
                        ? 'fill-[#C5A059] text-[#C5A059]'
                        : 'text-slate-300 fill-transparent'
                    }`}
                    aria-hidden="true"
                  />
                );
              })}
            </div>
          )}

          {/* 2. Quote with large faded decorative quote-mark glyph */}
          <div className="relative">
            {/* Faded Quote-Mark Glyph (SVG, gold at 12% opacity) */}
            <svg
              className="testimonial-quote-glyph absolute -top-3 -right-2 sm:-top-5 sm:right-0 lg:-top-6 lg:right-2 w-[72px] h-[72px] lg:w-[110px] lg:h-[110px] pointer-events-none select-none text-[#C5A059] opacity-[0.12] -z-10"
              viewBox="0 0 100 100"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M10 68 L38 22 L50 22 L50 78 L10 78 Z M54 68 L82 22 L94 22 L94 78 L54 78 Z" />
            </svg>

            <blockquote className="testimonial-quote font-normal italic text-xl sm:text-2xl lg:text-[28px] xl:text-3xl text-[#0B1B4D] leading-[1.5] text-pretty max-w-2xl line-clamp-5 lg:line-clamp-none">
              &ldquo;{quote}&rdquo;
            </blockquote>
          </div>

          {/* 3. Hairline Divider */}
          <div
            className="testimonial-divider h-px bg-[#0B1B4D]/20 w-full lg:w-40 mt-6 sm:mt-8 md:mt-12"
            aria-hidden="true"
          />

          {/* 4. Author & Controls Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4 lg:mt-5">
            {/* Author info */}
            <div className="testimonial-author text-left">
              <div className="text-lg font-semibold text-[#0B1B4D] tracking-tight leading-tight">
                {name}
              </div>
              <div className="text-sm text-slate-600 mt-1">
                {role}
              </div>
            </div>

            {/* Controls (Counter & Circular Arrow Buttons) */}
            {controls}
          </div>
        </div>
      </div>
    </div>
  );
}
