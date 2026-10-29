import React from 'react';

/**
 * GWEmblem
 * The official Grace Way Growth Arrow Monogram Emblem.
 * Matching the executive 3D metallic platinum and silver styling:
 * circular G ring with shelf, geometric W chevron with 3D bevels,
 * and upward financial growth arrow.
 */
export function GWEmblem({ className = '', variant = 'dark-bg' }) {
  const isLightBg = variant === 'light-bg';

  return (
    <svg
      viewBox="0 0 385 195"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {/* Luminous Platinum-White Surface Gradient for Dark Backgrounds */}
        <linearGradient id="gwPlatFace" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="55%" stopColor="#F8FAFC" />
          <stop offset="100%" stopColor="#E2E8F0" />
        </linearGradient>

        {/* Metallic Silver-Grey 3D Bevel Shadow */}
        <linearGradient id="gwSilverBevel" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#CBD5E1" />
          <stop offset="50%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#64748B" />
        </linearGradient>

        {/* Deep Executive Navy Gradient for Light Surfaces */}
        <linearGradient id="gwNavyFace" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#081736" />
          <stop offset="60%" stopColor="#0B1B4D" />
          <stop offset="100%" stopColor="#1E293B" />
        </linearGradient>

        {/* Subtle Warm Gold Rim Accent */}
        <linearGradient id="gwGoldRim" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#A67C24" />
          <stop offset="50%" stopColor="#E5C378" />
          <stop offset="100%" stopColor="#C5A059" />
        </linearGradient>
      </defs>

      {/* ================= G MONOGRAM ================= */}
      {/* 3D Bevel Ribbon (Upper-Left Inner Facet) */}
      <path
        d="M 170 33
           C 125 15 55 25 25 68
           C 12 90 14 116 26 136
           C 20 120 18 95 30 75
           C 55 35 125 24 170 33
           Z"
        fill={isLightBg ? 'url(#gwGoldRim)' : 'url(#gwSilverBevel)'}
        opacity={isLightBg ? '0.9' : '0.8'}
      />

      {/* Main G Body */}
      <path
        d="M 170 33
           C 125 10 55 10 20 52
           C -5 85 -5 132 24 165
           C 54 195 118 198 162 172
           C 180 162 186 142 186 114
           L 186 83
           L 112 83
           L 91 113
           L 154 113
           C 154 138 126 162 85 162
           C 48 162 33 133 33 97.5
           C 33 62 55 42 95 42
           C 125 42 152 48 170 58
           Z"
        fill={isLightBg ? 'url(#gwNavyFace)' : 'url(#gwPlatFace)'}
      />

      {/* ================= W MONOGRAM WITH GROWTH ARROW ================= */}
      {/* Main W Body (Chevron + Arrow Shaft + Head) */}
      <path
        d="M 197 194
           L 248 28
           L 280 85
           L 298 128
           L 326 28
           L 384 1
           L 385 63
           L 358 48
           L 295 194
           L 248 96
           Z"
        fill={isLightBg ? 'url(#gwNavyFace)' : 'url(#gwPlatFace)'}
      />

      {/* 3D Bevel Edge on Right Side of Chevron */}
      <path
        d="M 248 28
           L 260 35
           L 305 194
           L 295 194
           Z"
        fill={isLightBg ? 'url(#gwGoldRim)' : 'url(#gwSilverBevel)'}
        opacity={isLightBg ? '0.9' : '0.7'}
      />

      {/* 3D Bevel Facet on Arrowhead */}
      <path
        d="M 384 1
           L 355 42
           L 358 48
           L 385 63
           Z"
        fill={isLightBg ? 'url(#gwGoldRim)' : 'url(#gwSilverBevel)'}
        opacity={isLightBg ? '0.95' : '0.85'}
      />
    </svg>
  );
}

export default GWEmblem;
