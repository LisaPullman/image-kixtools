import React from 'react';

interface FoxaiLogoProps {
  size?: number;
  showWordmark?: boolean;
  className?: string;
}

/**
 * foxai brand mark + wordmark.
 * Inline SVG so it inherits currentColor where useful and renders crisply at any size.
 * - size: pixel height (default 40)
 * - showWordmark: when true, renders "foxai" next to the mark
 */
export function FoxaiLogo({ size = 40, showWordmark = true, className }: FoxaiLogoProps) {
  const markSize = size;
  const wordWidth = showWordmark ? Math.round(markSize * 1.8) : 0;
  const totalWidth = markSize + (showWordmark ? wordWidth + 10 : 0);
  const totalHeight = markSize;
  const fontSize = Math.max(14, Math.round(markSize * 0.45));
  const taglineSize = Math.max(8, Math.round(markSize * 0.18));

  return (
    <span
      className={className}
      style={{ display: 'inline-flex', alignItems: 'center', lineHeight: 1 }}
      aria-label="foxai"
    >
      <svg
        width={markSize}
        height={markSize}
        viewBox="0 0 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        <defs>
          <linearGradient id="foxaiBg" x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#0F172A" />
            <stop offset="1" stopColor="#1E293B" />
          </linearGradient>
          <linearGradient id="foxaiEar" x1="28" y1="6" x2="28" y2="50" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#FB923C" />
            <stop offset="1" stopColor="#F97316" />
          </linearGradient>
          <linearGradient id="foxaiFace" x1="28" y1="20" x2="28" y2="52" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#FBBF24" />
            <stop offset="1" stopColor="#F97316" />
          </linearGradient>
        </defs>
        <rect width="56" height="56" rx="14" fill="url(#foxaiBg)" />
        <path d="M16 12 L21 28 L12 24 Z" fill="url(#foxaiEar)" />
        <path d="M40 12 L35 28 L44 24 Z" fill="url(#foxaiEar)" />
        <path d="M28 18 L42 26 L28 48 L14 26 Z" fill="url(#foxaiFace)" />
        <path d="M17 26 L28 19 L21 33 Z" fill="#FED7AA" opacity="0.9" />
        <path d="M39 26 L28 19 L35 33 Z" fill="#FED7AA" opacity="0.9" />
        <path d="M28 30 L35 36 L28 46 L21 36 Z" fill="#FFFFFF" opacity="0.95" />
        <circle cx="21.5" cy="28" r="2.1" fill="#0F172A" />
        <circle cx="34.5" cy="28" r="2.1" fill="#0F172A" />
        <circle cx="22.1" cy="27.4" r="0.6" fill="#FFFFFF" />
        <circle cx="35.1" cy="27.4" r="0.6" fill="#FFFFFF" />
        <path d="M28 36 L30.2 38 L28 40 L25.8 38 Z" fill="#0F172A" />
      </svg>

      {showWordmark && (
        <span
          style={{
            marginLeft: 10,
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontSize,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#0F172A',
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            }}
          >
            fox<span style={{ fontWeight: 400, color: '#F97316' }}>ai</span>
          </span>
          <span
            style={{
              fontSize: taglineSize,
              fontWeight: 600,
              letterSpacing: '0.18em',
              color: '#64748B',
              marginTop: 2,
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              textTransform: 'uppercase',
            }}
          >
            Intelligent Tools
          </span>
        </span>
      )}
    </span>
  );
}

export default FoxaiLogo;