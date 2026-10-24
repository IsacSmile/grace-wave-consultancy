import React from 'react';
import { Sparkles } from 'lucide-react';
import { Reveal } from './Reveal';

/**
 * SectionHeading
 * Global left-aligned, premium, breathable section header component.
 *
 * Requirements:
 * - Left-aligned at all breakpoints (text-left, items-start). No text-center on any breakpoint.
 * - Max width 3xl for header wrapper, max-w-xl to 2xl on subtitle (~60-65 chars per line).
 * - text-balance on headings, text-pretty on subtitles for orphan-free line wrapping.
 * - 48px x 2px subtle gold accent bar above badge.
 * - Consistent type tokens (badge tracking-[0.14em], H2 leading-[1.15], subtitle leading-[1.7]).
 * - Reuses <Reveal> with stagger 0.1s, y: 24, start: 'top 80%', once: true.
 */
export function SectionHeading({
  badge,
  badgeIcon: BadgeIcon = Sparkles,
  title,
  subtitle,
  tone = 'light', // 'light' | 'dark'
  as: Component = 'h2',
  id,
  className = '',
  accent = true,
  action = null,
}) {
  const isDark = tone === 'dark';

  const headingContent = (
    <Reveal
      stagger={0.1}
      y={24}
      start="top 80%"
      once={true}
      className="max-w-3xl text-left"
    >
      {/* 1. Subtle Gold Accent Bar (48px x 2px) */}
      {accent && (
        <div
          className="w-12 h-0.5 bg-[#C5A059] rounded-full mb-5 md:mb-6"
          aria-hidden="true"
        />
      )}

      {/* 2. Uppercase Pill Badge */}
      {badge && (
        <div className="mb-5 md:mb-6">
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.14em] shadow-xs ${
              isDark
                ? 'bg-navy-800/90 border border-gold-500/30 text-gold-400'
                : 'bg-blue-50 border border-blue-200/90 text-[#0B1B4D]'
            }`}
          >
            {BadgeIcon && (
              <BadgeIcon
                className={`w-3.5 h-3.5 ${
                  isDark ? 'text-gold-400' : 'text-blue-600'
                }`}
              />
            )}
            <span>{badge}</span>
          </div>
        </div>
      )}

      {/* 3. Heading (H2 default) */}
      {title && (
        <Component
          id={id}
          className={`font-heading font-bold text-3xl sm:text-4xl lg:text-5xl xl:text-[3.25rem] tracking-tight leading-[1.15] text-balance ${
            isDark ? 'text-white' : 'text-[#0B1B4D]'
          }`}
        >
          {title}
        </Component>
      )}

      {/* 4. Subtitle */}
      {subtitle && (
        <p
          className={`mt-5 md:mt-6 text-base md:text-lg font-normal leading-[1.7] max-w-xl lg:max-w-2xl text-pretty ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          {subtitle}
        </p>
      )}
    </Reveal>
  );

  return (
    <div className={`mb-10 md:mb-14 lg:mb-16 ${className}`}>
      {action ? (
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 md:gap-8">
          {headingContent}
          <div className="mt-2 lg:mt-0 shrink-0">
            <Reveal y={24} delay={0.25} start="top 80%" once={true}>
              {action}
            </Reveal>
          </div>
        </div>
      ) : (
        headingContent
      )}
    </div>
  );
}
