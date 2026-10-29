import React from 'react';
import { GWEmblem } from './GWEmblem';

/**
 * Grace Way - Official Logo Lockup
 * Combines the custom GW Arrow Growth Emblem badge with
 * refined "Grace Way" typography.
 */
export function Logo({ className = '', height = 40, variant = 'light-bg' }) {
  const isLight = variant === 'light-bg';

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Monogram Badge */}
      <div className="w-10 h-10 rounded-xl bg-[#0B1B4D] border border-blue-400/25 flex items-center justify-center p-1.5 shadow-xs shrink-0">
        <GWEmblem className="w-full h-full" />
      </div>

      {/* Typography Lockup */}
      <span
        className={`font-heading font-extrabold text-base sm:text-lg leading-tight tracking-tight ${
          isLight ? 'text-[#0B1B4D]' : 'text-white'
        }`}
      >
        Grace Way
      </span>
    </div>
  );
}

export default Logo;
