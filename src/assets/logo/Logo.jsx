// PLACEHOLDER: replace with the final designed logo
import React from 'react';

/**
 * Grace Way Accounting FZC LLC - Official Logo Lockup Placeholder
 * "GW" monogram + "Grace Way / ACCOUNTING FZC LLC"
 * Crisp at 40px height, adapts to light and dark backgrounds via currentColor.
 */
export function Logo({ className = '', height = 40 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 220 40"
      height={height}
      className={`shrink-0 ${className}`}
      fill="none"
      aria-hidden="true"
    >
      {/* Monogram Box (40x40 rounded-xl) */}
      <rect width="40" height="40" rx="10" fill="currentColor" fillOpacity="0.12" />
      <rect
        x="0.5"
        y="0.5"
        width="39"
        height="39"
        rx="9.5"
        stroke="currentColor"
        strokeOpacity="0.25"
      />
      <text
        x="20"
        y="26"
        textAnchor="middle"
        fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
        fontWeight="800"
        fontSize="17"
        fill="currentColor"
        letterSpacing="-0.03em"
      >
        GW
      </text>

      {/* Lockup Typography */}
      <text
        x="52"
        y="21"
        fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
        fontWeight="800"
        fontSize="16"
        fill="currentColor"
        letterSpacing="-0.02em"
      >
        Grace Way
      </text>
      <text
        x="52"
        y="33"
        fontFamily="'Inter', system-ui, sans-serif"
        fontWeight="700"
        fontSize="9"
        fill="currentColor"
        fillOpacity="0.85"
        letterSpacing="0.12em"
      >
        ACCOUNTING FZC LLC
      </text>
    </svg>
  );
}

export default Logo;
