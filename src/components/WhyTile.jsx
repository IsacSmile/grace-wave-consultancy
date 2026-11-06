// Placeholders replaced with clean architectural styles
import React, { useState, useEffect, useRef } from 'react';
import { UserCheck, Lightbulb, ArrowUpRight } from 'lucide-react';
import { useLenis } from './SmoothScroll';

const iconMap = {
  UserCheck,
  Lightbulb,
};

export function WhyTile({
  tile,
  counterRef,
  imageRef,
  tileRef,
  className = '',
  isHoverCapable = true,
  prefersReducedMotion = false,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const { lenis } = useLenis();

  // Reset hover state when Lenis or window scroll moves tile away from still cursor
  useEffect(() => {
    if (!isHoverCapable || !isHovered || prefersReducedMotion) return;

    const handleScroll = () => {
      if (!tileRef?.current) return;
      const rect = tileRef.current.getBoundingClientRect();
      const { x, y } = lastMousePos.current;
      if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
        setIsHovered(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    if (lenis) {
      lenis.on('scroll', handleScroll);
    }
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (lenis) {
        lenis.off('scroll', handleScroll);
      }
    };
  }, [isHovered, isHoverCapable, prefersReducedMotion, tileRef, lenis]);

  const handlePointerEnter = (e) => {
    if (!isHoverCapable || prefersReducedMotion) return;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    setIsHovered(true);
  };

  const handlePointerMove = (e) => {
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
  };

  const IconComponent = tile.icon ? iconMap[tile.icon] : null;

  // Variant 1: Soft Executive Card (Warm Stone / Navy Hairline)
  if (tile.variant === 'soft') {
    const isGold = tile.tone === 'gold';
    return (
      <li
        ref={tileRef}
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className={`why-bento-tile relative rounded-2xl overflow-hidden flex flex-col justify-between p-6 transition-colors duration-250 border ${
          isGold
            ? 'bg-[#FCFBF8] border-[#C5A059]/30 hover:border-[#C5A059]/60'
            : 'bg-[#F8FAFC] border-slate-200/90 hover:border-[#0B1B4D]/25'
        } ${
          isHovered && !prefersReducedMotion ? 'shadow-xs' : 'shadow-none'
        } active:scale-[0.99] group ${className}`}
      >
        {/* Top Header: Icon container + Title */}
        <div className="relative z-10 flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            {IconComponent && (
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
                  isGold
                    ? 'bg-[#C5A059]/10 text-[#8E7019] border-[#C5A059]/20'
                    : 'bg-navy-50 text-[#0B1B4D] border-[#0B1B4D]/10'
                }`}
              >
                <IconComponent className="w-5 h-5 stroke-[1.8]" />
              </div>
            )}
          </div>
          <div
            className={`w-7 h-7 rounded-full bg-[#0A1F4D] text-[#C5A059] flex items-center justify-center transition-all duration-200 shrink-0 ${
              isHovered && !prefersReducedMotion ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}
            aria-hidden="true"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Title */}
        <div className="relative z-10">
          <h3 className="font-heading font-semibold text-lg md:text-xl text-[#0B1B4D] tracking-tight leading-snug">
            {tile.title}
          </h3>
        </div>

        {/* Bottom Text */}
        <div className="relative z-10 mt-auto pt-4">
          <p className="text-[14px] md:text-[15px] text-slate-600 leading-relaxed line-clamp-3">
            {tile.text}
          </p>
        </div>
      </li>
    );
  }

  // Variant 2: Full-Bleed Image Tile
  const imageSizes = tile.isWide
    ? '(max-width: 640px) 92vw, (max-width: 1024px) 92vw, 800px'
    : '(max-width: 640px) 92vw, (max-width: 1024px) 92vw, 420px';

  return (
    <li
      ref={tileRef}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`why-bento-tile relative rounded-2xl overflow-hidden flex flex-col justify-between p-6 transition-all duration-300 border border-slate-700/50 ${
        isHovered && !prefersReducedMotion
          ? '-translate-y-0.5 shadow-md'
          : 'translate-y-0 shadow-none'
      } active:scale-[0.99] group bg-navy-950 ${className}`}
    >
      {/* Background Image with Parallax & Hover Scale (1.04) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <img
          ref={imageRef}
          src={tile.image}
          srcSet={`${tile.image} 480w, ${tile.image} 800w, ${tile.image} 1200w`}
          sizes={imageSizes}
          alt={tile.imageAlt}
          width={tile.imageWidth}
          height={tile.imageHeight}
          loading="lazy"
          decoding="async"
          className={`absolute -top-[5%] left-0 w-full h-[110%] object-cover object-center transition-transform duration-[700ms] ease-out will-change-transform ${
            isHovered && !prefersReducedMotion ? 'scale-[1.04]' : 'scale-100'
          }`}
        />
        {/* Navy Gradient Overlay for guaranteed AA text contrast */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#061226]/90 via-[#061226]/45 to-transparent pointer-events-none"
          aria-hidden="true"
        />
      </div>

      {/* Top Header: Title + Action Arrow */}
      <div className="relative z-10 flex items-start justify-between gap-3">
        <h3 className="font-heading font-semibold text-lg md:text-xl text-white tracking-tight leading-snug">
          {tile.title}
        </h3>
        <div
          className={`w-7 h-7 rounded-full bg-white/20 backdrop-blur-xs text-white flex items-center justify-center transition-all duration-200 shrink-0 ${
            isHovered && !prefersReducedMotion ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}
          aria-hidden="true"
        >
          <ArrowUpRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Center: Large 25+ Counter (Tile 3 only) */}
      {tile.statValue && (
        <div className="relative z-10 my-auto py-3 flex items-baseline gap-1 tabular-nums">
          <span
            ref={counterRef}
            className="font-heading font-bold text-5xl md:text-6xl text-white tracking-tight leading-none"
            aria-label={tile.statAriaLabel}
          >
            {tile.statValue}
          </span>
          <span className="font-heading font-bold text-3xl md:text-4xl text-[#C5A059] leading-none">
            {tile.statSuffix}
          </span>
        </div>
      )}

      {/* Bottom Text */}
      <div className="relative z-10 mt-auto pt-4">
        <p className="text-[14px] md:text-[15px] text-slate-200 leading-relaxed line-clamp-3">
          {tile.text}
        </p>
      </div>
    </li>
  );
}

