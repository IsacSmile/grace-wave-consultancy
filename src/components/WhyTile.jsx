// PLACEHOLDER: replace images with real photos before launch.
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
  isInView = true,
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

  // Variant 1: Soft Tinted Tile (Gold or Blue)
  if (tile.variant === 'soft') {
    const isGold = tile.tone === 'gold';
    return (
      <li
        ref={tileRef}
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className={`why-bento-tile relative rounded-3xl overflow-hidden flex flex-col justify-between p-5 md:p-6 transition-all duration-300 border ${
          isGold
            ? 'bg-gradient-to-br from-[#FFFDF8] via-[#FAF4DE]/50 to-[#F5EACB]/60 border-gold-200/50'
            : 'bg-gradient-to-br from-[#F8FAFF] via-[#EBF3FE]/60 to-[#E2EDFA]/70 border-blue-200/50'
        } ${
          isHovered && !prefersReducedMotion
            ? '-translate-y-1 shadow-md'
            : 'translate-y-0 shadow-none'
        } active:scale-[0.99] group ${className}`}
      >
        {/* Slow drifting blurred background blob (CSS radial-gradient at 18% opacity, 12s loop, paused when off-screen) */}
        <div
          className={`absolute -top-12 -right-12 w-56 h-56 rounded-full pointer-events-none transition-transform duration-700 ease-out will-change-transform ${
            prefersReducedMotion ? '' : 'animate-blob-drift'
          } ${isHovered && !prefersReducedMotion ? 'scale-125' : 'scale-100'}`}
          style={{
            background: isGold
              ? 'radial-gradient(circle, rgba(197, 160, 89, 0.18) 0%, rgba(197, 160, 89, 0) 70%)'
              : 'radial-gradient(circle, rgba(37, 99, 235, 0.18) 0%, rgba(37, 99, 235, 0) 70%)',
            animationPlayState: isInView && !prefersReducedMotion ? 'running' : 'paused',
            ...(isHovered ? { animationDuration: '6s' } : {}),
          }}
          aria-hidden="true"
        />

        {/* Faint large outline icon centered at 8 to 10% opacity */}
        {IconComponent && (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
            aria-hidden="true"
          >
            <IconComponent
              className={`w-28 h-28 lg:w-32 lg:h-32 stroke-[1.2] transition-transform duration-500 ease-out ${
                isGold ? 'text-[#C5A059]/[0.09]' : 'text-[#2563EB]/[0.09]'
              } ${isHovered && !prefersReducedMotion ? 'scale-105' : 'scale-100'}`}
            />
          </div>
        )}

        {/* Top Header: Title + Decorative Gold Hover Chip */}
        <div className="relative z-10 flex items-start justify-between gap-3">
          <h3 className="font-heading font-semibold text-lg md:text-xl text-[#0B1B4D] tracking-tight leading-snug">
            {tile.title}
          </h3>
          <div
            className={`w-7 h-7 rounded-full bg-gold-400 text-navy-950 flex items-center justify-center transition-all duration-300 shrink-0 ${
              isHovered && !prefersReducedMotion ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}
            aria-hidden="true"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Bottom Text */}
        <div className="relative z-10 mt-auto pt-6">
          <p className="text-[15px] md:text-base text-slate-600 leading-[1.6] line-clamp-3">
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
      className={`why-bento-tile relative rounded-3xl overflow-hidden flex flex-col justify-between p-5 md:p-6 transition-all duration-300 border border-white/15 ${
        isHovered && !prefersReducedMotion
          ? '-translate-y-1 shadow-lg'
          : 'translate-y-0 shadow-none'
      } active:scale-[0.99] group bg-navy-950 ${className}`}
    >
      {/* Background Image with Parallax & Hover Scale (1.06) */}
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
          className={`absolute -top-[5%] left-0 w-full h-[110%] object-cover object-center transition-transform duration-[800ms] ease-out will-change-transform ${
            isHovered && !prefersReducedMotion ? 'scale-[1.06]' : 'scale-100'
          }`}
        />
        {/* Navy Gradient Overlay (navy/0 top to navy/75% bottom for guaranteed AA text contrast) */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#0B1B4D]/85 via-[#0B1B4D]/40 to-transparent pointer-events-none"
          aria-hidden="true"
        />
      </div>

      {/* Top Header: Title + Decorative Gold Hover Chip */}
      <div className="relative z-10 flex items-start justify-between gap-3">
        <h3 className="font-heading font-semibold text-lg md:text-xl text-white tracking-tight leading-snug drop-shadow-xs">
          {tile.title}
        </h3>
        <div
          className={`w-7 h-7 rounded-full bg-gold-400 text-navy-950 flex items-center justify-center transition-all duration-300 shrink-0 ${
            isHovered && !prefersReducedMotion ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}
          aria-hidden="true"
        >
          <ArrowUpRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Center: Large 25+ Counter (Tile 3 only) */}
      {tile.statValue && (
        <div className="relative z-10 my-auto py-3 flex items-baseline gap-1">
          <span
            ref={counterRef}
            className="font-heading font-bold text-6xl md:text-7xl text-white tracking-tight leading-none drop-shadow-sm"
            aria-label={tile.statAriaLabel}
          >
            {tile.statValue}
          </span>
          <span className="font-heading font-bold text-4xl md:text-5xl text-gold-400 leading-none drop-shadow-sm">
            {tile.statSuffix}
          </span>
        </div>
      )}

      {/* Bottom Text */}
      <div className="relative z-10 mt-auto pt-6">
        <p className="text-[15px] md:text-base text-white/90 leading-[1.6] line-clamp-3 drop-shadow-xs">
          {tile.text}
        </p>
      </div>
    </li>
  );
}

