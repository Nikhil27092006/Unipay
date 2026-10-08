import React from 'react';

export type EmojiBadgeName =
  | 'wave'
  | 'flatmates'
  | 'house'
  | 'home'
  | 'ganpati'
  | 'festival'
  | 'diya'
  | 'weekend'
  | 'camp'
  | 'friends'
  | 'trip'
  | 'plane'
  | 'vacation'
  | 'groceries'
  | 'cart'
  | 'dining'
  | 'food'
  | 'lunch'
  | 'bento'
  | 'party'
  | 'events'
  | 'celebrate'
  | 'bills'
  | 'lightning'
  | 'shield'
  | 'kyc'
  | 'user'
  | 'person'
  | 'profile'
  | 'card'
  | 'upi'
  | 'wallet'
  | 'bell'
  | 'notif'
  | 'lock'
  | 'security'
  | 'help'
  | 'question'
  | 'check'
  | 'success'
  | 'plus'
  | 'add'
  | 'info'
  | 'rewards'
  | 'trophy'
  | 'offers'
  | 'tag'
  | 'discount'
  | 'referrals'
  | 'refer'
  | 'referral'
  | 'gift'
  | 'star'
  | 'coin'
  | 'offer'
  | 'ticket';

export interface EmojiBadgeProps {
  name: EmojiBadgeName | string;
  size?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'inline';
  shape?: 'circle' | 'squircle' | 'rounded' | 'none';
  bg?: string;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
}

const DEFAULT_CONFIGS: Record<string, { bg: string; color: string }> = {
  wave: { bg: 'transparent', color: '#F59E0B' },
  flatmates: { bg: '#2563EB', color: '#FFFFFF' },
  house: { bg: '#2563EB', color: '#FFFFFF' },
  home: { bg: '#2563EB', color: '#FFFFFF' },
  ganpati: { bg: '#7C3AED', color: '#FFFFFF' },
  festival: { bg: '#7C3AED', color: '#FFFFFF' },
  diya: { bg: '#7C3AED', color: '#FFFFFF' },
  weekend: { bg: '#0D9488', color: '#FFFFFF' },
  camp: { bg: '#0D9488', color: '#FFFFFF' },
  friends: { bg: '#0D9488', color: '#FFFFFF' },
  trip: { bg: '#0EA5E9', color: '#FFFFFF' },
  plane: { bg: '#0EA5E9', color: '#FFFFFF' },
  vacation: { bg: '#0EA5E9', color: '#FFFFFF' },
  groceries: { bg: '#16A34A', color: '#FFFFFF' },
  cart: { bg: '#16A34A', color: '#FFFFFF' },
  dining: { bg: '#F59E0B', color: '#FFFFFF' },
  food: { bg: '#F59E0B', color: '#FFFFFF' },
  lunch: { bg: '#F59E0B', color: '#FFFFFF' },
  bento: { bg: '#F59E0B', color: '#FFFFFF' },
  party: { bg: '#9333EA', color: '#FFFFFF' },
  events: { bg: '#9333EA', color: '#FFFFFF' },
  celebrate: { bg: '#9333EA', color: '#FFFFFF' },
  bills: { bg: '#4B5563', color: '#FFFFFF' },
  lightning: { bg: '#4B5563', color: '#FFFFFF' },
  shield: { bg: '#10B981', color: '#FFFFFF' },
  kyc: { bg: '#10B981', color: '#FFFFFF' },
  user: { bg: '#3B82F6', color: '#FFFFFF' },
  person: { bg: '#3B82F6', color: '#FFFFFF' },
  profile: { bg: '#3B82F6', color: '#FFFFFF' },
  card: { bg: '#6366F1', color: '#FFFFFF' },
  upi: { bg: '#6366F1', color: '#FFFFFF' },
  wallet: { bg: '#6366F1', color: '#FFFFFF' },
  bell: { bg: '#F59E0B', color: '#FFFFFF' },
  notif: { bg: '#F59E0B', color: '#FFFFFF' },
  lock: { bg: '#EF4444', color: '#FFFFFF' },
  security: { bg: '#EF4444', color: '#FFFFFF' },
  help: { bg: '#6B7280', color: '#FFFFFF' },
  question: { bg: '#6B7280', color: '#FFFFFF' },
  check: { bg: '#16A34A', color: '#FFFFFF' },
  success: { bg: '#16A34A', color: '#FFFFFF' },
  plus: { bg: '#2563EB', color: '#FFFFFF' },
  add: { bg: '#2563EB', color: '#FFFFFF' },
  info: { bg: '#3B82F6', color: '#FFFFFF' },
  rewards: { bg: '#FEF3C7', color: '#D97706' },
  trophy: { bg: '#FEF3C7', color: '#D97706' },
  offers: { bg: '#FCE7F3', color: '#DB2777' },
  tag: { bg: '#FCE7F3', color: '#DB2777' },
  discount: { bg: '#FCE7F3', color: '#DB2777' },
  referrals: { bg: '#DBEAFE', color: '#2563EB' },
  refer: { bg: '#DBEAFE', color: '#2563EB' },
  referral: { bg: '#DBEAFE', color: '#2563EB' },
  gift: { bg: '#DBEAFE', color: '#2563EB' },
  star: { bg: '#FEF3C7', color: '#D97706' },
  coin: { bg: '#F5F3FF', color: '#7C3AED' },
  offer: { bg: '#FEE2E2', color: '#DC2626' },
  ticket: { bg: '#E0F2FE', color: '#0284C7' },
};

function normalizeName(raw: string): string {
  const map: Record<string, string> = {
    '🏠': 'flatmates',
    '🪔': 'ganpati',
    '🏕️': 'weekend',
    '🏕': 'weekend',
    '🍱': 'dining',
    '✈️': 'trip',
    '✈': 'trip',
    '🛒': 'groceries',
    '🍽️': 'dining',
    '🍽': 'dining',
    '🎉': 'party',
    '⚡': 'bills',
    '👋': 'wave',
    '🛡️': 'shield',
    '🛡': 'shield',
    '👤': 'user',
    '💳': 'card',
    '🔔': 'bell',
    '🔒': 'lock',
    '❓': 'help',
    '✓': 'check',
    '+': 'plus',
    'ℹ': 'info',
  };
  return map[raw] || raw.toLowerCase().trim();
}

export function EmojiBadge({
  name,
  size = 'md',
  shape = 'circle',
  bg,
  color,
  className = '',
  style,
  ariaLabel,
}: EmojiBadgeProps) {
  const norm = normalizeName(name);
  const defaultConfig = DEFAULT_CONFIGS[norm] || { bg: '#E5E7EB', color: '#374151' };

  // Calculate pixel size for the badge container and inner icon
  let containerSize = 42;
  let iconSize = 22;

  if (typeof size === 'number') {
    containerSize = size;
    iconSize = Math.round(size * 0.55);
  } else {
    switch (size) {
      case 'xs':
        containerSize = 22;
        iconSize = 13;
        break;
      case 'sm':
        containerSize = 32;
        iconSize = 17;
        break;
      case 'md':
        containerSize = 42;
        iconSize = 22;
        break;
      case 'lg':
        containerSize = 48;
        iconSize = 26;
        break;
      case 'xl':
        containerSize = 56;
        iconSize = 30;
        break;
      case 'inline':
        containerSize = 24;
        iconSize = 20;
        break;
    }
  }

  const effectiveBg = bg !== undefined ? bg : defaultConfig.bg;
  const effectiveColor = color !== undefined ? color : defaultConfig.color;

  let borderRadius: string | number = '50%';
  if (shape === 'squircle') borderRadius = Math.round(containerSize * 0.3);
  else if (shape === 'rounded') borderRadius = Math.round(containerSize * 0.22);
  else if (shape === 'none') borderRadius = 0;

  // Wave emoji has its own standalone decorative presentation
  if (norm === 'wave') {
    return (
      <span
        className={`emoji-badge-wave ${className}`}
        aria-label={ariaLabel || 'Waving hand'}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          verticalAlign: 'middle',
          marginLeft: 4,
          ...style,
        }}
      >
        <svg
          width={size === 'inline' || size === 'sm' ? 22 : iconSize + 4}
          height={size === 'inline' || size === 'sm' ? 22 : iconSize + 4}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Wave arc accents */}
          <path
            d="M26 8c2.2 2.2 3.2 5.5 2.6 8.5"
            stroke="#F59E0B"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M23 11c1.3 1.3 1.9 3.2 1.6 5"
            stroke="#FBBF24"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Hand Palm & Fingers with warm gradient */}
          <defs>
            <linearGradient id="waveGrad" x1="6" y1="4" x2="26" y2="28" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="50%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
            <filter id="waveShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#D97706" floodOpacity="0.3" />
            </filter>
          </defs>
          <g filter="url(#waveShadow)">
            <path
              d="M17.5 13V6.5a1.8 1.8 0 00-3.6 0V13M13.9 13V4.8a1.8 1.8 0 00-3.6 0V14M10.3 14V6.5a1.8 1.8 0 00-3.6 0V17c0 5 3.8 9.5 8.8 9.5s8.8-4.5 8.8-9.5v-3.5a1.8 1.8 0 00-3.6 0V15M20.7 13.5a1.8 1.8 0 00-3.2-.5"
              fill="url(#waveGrad)"
              stroke="#D97706"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </span>
    );
  }

  return (
    <div
      className={`emoji-badge ${className}`}
      aria-label={ariaLabel || norm}
      style={{
        width: shape === 'none' ? 'auto' : containerSize,
        height: shape === 'none' ? 'auto' : containerSize,
        borderRadius,
        background: shape === 'none' ? 'transparent' : effectiveBg,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: shape !== 'none' && effectiveBg !== 'transparent' ? '0 2px 6px rgba(0,0,0,0.1)' : 'none',
        transition: 'transform 0.15s ease',
        ...style,
      }}
    >
      <BadgeSvg name={norm} size={iconSize} color={effectiveColor} />
    </div>
  );
}

function BadgeSvg({ name, size, color }: { name: string; size: number; color: string }) {
  switch (name) {
    // ── 1. House / Flatmates (Exact screenshot match) ──
    case 'flatmates':
    case 'house':
    case 'home':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          {/* Triangular Roof with overhang */}
          <path
            d="M12 3L2.5 11h2.5v9a1 1 0 001 1h12a1 1 0 001-1v-9h2.5L12 3z"
            fill={color}
          />
          {/* Chimney on the right */}
          <path d="M17 4v4l2.5 2V4H17z" fill={color} />
          {/* Rounded Arch Doorway cutout */}
          <path
            d="M9.5 21v-5.5a2.5 2.5 0 015 0V21h-5z"
            fill="#2563EB"
          />
        </svg>
      );

    // ── 2. Ganpati / Diya / Festival (Exact purple motif match) ──
    case 'ganpati':
    case 'festival':
    case 'diya':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          {/* Crown / Mukut on top */}
          <path d="M12 2l1.8 2.8-1.8 1.4-1.8-1.4L12 2z" fill={color} />
          {/* Tilak / forehead marking */}
          <circle cx="12" cy="7.5" r="1" fill={color} />
          <path d="M12 6.5v3M10.5 7.5h3" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
          {/* Large Left Ear */}
          <path
            d="M8.5 7.5c-2.5 0-4 1.8-4 4.2 0 2 1.3 3.3 3 3.8"
            stroke={color}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Large Right Ear */}
          <path
            d="M15.5 7.5c2.5 0 4 1.8 4 4.2 0 2-1.3 3.3-3 3.8"
            stroke={color}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Graceful Trunk curving left */}
          <path
            d="M12 9.5c0 3.5 1 5.5-1 7.5-1.5 1.5-3.5.5-3.2-1.2.3-1.4 1.8-1.4 2.2-.5"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Modak in trunk hand */}
          <circle cx="8" cy="18" r="1.3" fill={color} />
        </svg>
      );

    // ── 3. Weekend Group / Camp / Friends (Exact teal motif match) ──
    case 'weekend':
    case 'camp':
    case 'friends':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          {/* Center Leader Person */}
          <circle cx="12" cy="7" r="3" fill={color} />
          <path
            d="M6.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Left Companion */}
          <circle cx="6" cy="9.5" r="2.2" fill={color} />
          <path
            d="M2.5 19c0-2.2 1.8-4 4-4"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Right Companion */}
          <circle cx="18" cy="9.5" r="2.2" fill={color} />
          <path
            d="M17.5 15c2.2 0 4 1.8 4 4"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );

    // ── 4. Dining / Bento / Food ──
    case 'dining':
    case 'food':
    case 'lunch':
    case 'bento':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          {/* Fork on Left */}
          <path
            d="M6 3v5a2 2 0 002 2v10M8 3v5M4 3v5a2 2 0 002 2"
            stroke={color}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Plate in center */}
          <circle cx="13" cy="12" r="5" stroke={color} strokeWidth="1.8" />
          <circle cx="13" cy="12" r="2.5" fill={color} opacity="0.3" />
          {/* Knife on Right */}
          <path
            d="M20 3c0 4-1.5 7-1.5 7v10"
            stroke={color}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );

    // ── 5. Trip / Plane / Vacation ──
    case 'trip':
    case 'plane':
    case 'vacation':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path
            d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
            fill={color}
          />
        </svg>
      );

    // ── 6. Groceries / Cart ──
    case 'groceries':
    case 'cart':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="9" cy="20" r="1.8" fill={color} />
          <circle cx="18" cy="20" r="1.8" fill={color} />
          <path
            d="M3 4h3l2.6 11.2a1.5 1.5 0 001.5 1.2h8.5a1.5 1.5 0 001.5-1.1L22 7H7"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    // ── 7. Party / Celebrate / Events ──
    case 'party':
    case 'events':
    case 'celebrate':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          {/* Party Cone */}
          <path
            d="M3 21l3.5-12.5L19 14.5 3 21z"
            fill={color}
            opacity="0.85"
          />
          <path d="M5.5 18l10-3.5" stroke={color} strokeWidth="1.5" />
          <path d="M8 15l7-2.5" stroke={color} strokeWidth="1.5" />
          {/* Confetti & Sparkles */}
          <path d="M19 4v3M20.5 5.5h-3" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M13 3l1 2" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M21 10l2 1" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="16" cy="8" r="1" fill={color} />
          <circle cx="14" cy="5" r="0.8" fill={color} />
        </svg>
      );

    // ── 8. Bills / Lightning ──
    case 'bills':
    case 'lightning':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path
            d="M13 2L4 13h6l-1 9 9-11h-6l1-9z"
            fill={color}
            stroke={color}
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      );

    // ── 9. Shield / KYC / Security ──
    case 'shield':
    case 'kyc':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2L4 5v6.5c0 5.2 3.4 10.1 8 11.5 4.6-1.4 8-6.3 8-11.5V5l-8-3z"
            fill={color}
          />
          <path
            d="M9 12l2 2 4-4"
            stroke="#10B981"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    // ── 10. User / Profile ──
    case 'user':
    case 'person':
    case 'profile':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="4" fill={color} />
          <path
            d="M5 20c0-3.5 3.2-6 7-6s7 2.5 7 6"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      );

    // ── 11. Card / UPI / Wallet ──
    case 'card':
    case 'upi':
    case 'wallet':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect x="2" y="5" width="20" height="14" rx="2.5" stroke={color} strokeWidth="2" />
          <path d="M2 10h20" stroke={color} strokeWidth="2" />
          <circle cx="6.5" cy="14.5" r="1.5" fill={color} />
          <path d="M15 14.5h3" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );

    // ── 12. Bell / Notifications ──
    case 'bell':
    case 'notif':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path
            d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M13.73 21a2 2 0 01-3.46 0" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    // ── 13. Lock / Security ──
    case 'lock':
    case 'security':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect x="5" y="11" width="14" height="10" rx="2" fill={color} />
          <path
            d="M8 11V7a4 4 0 018 0v4"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <circle cx="12" cy="15.5" r="1.5" fill="#EF4444" />
        </svg>
      );

    // ── 14. Help / Question ──
    case 'help':
    case 'question':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
          <path
            d="M9.5 9.5a2.5 2.5 0 014.8.8c0 1.7-2.3 2-2.3 3.7"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="12" cy="17" r="1" fill={color} />
        </svg>
      );

    // ── 15. Check / Verified ──
    case 'check':
    case 'success':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill={color} />
          <path
            d="M8 12.5l2.8 2.8L16 9"
            stroke="#FFFFFF"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    // ── 16. Plus / Add ──
    case 'plus':
    case 'add':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill={color} />
          <path
            d="M12 7v10M7 12h10"
            stroke="#FFFFFF"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      );

    // ── 17. Rewards / Trophy ──
    case 'rewards':
    case 'trophy':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0V4z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7 6H4a2 2 0 00-2 2v1a4 4 0 004 4h1M17 6h3a2 2 0 012 2v1a4 4 0 01-4 4h-1" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );

    // ── 18. Offers / Discount Tag ──
    case 'offers':
    case 'tag':
    case 'discount':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="7" cy="7" r="1.5" fill={color}/>
        </svg>
      );

    // ── 19. Referrals / Gift Box ──
    case 'referrals':
    case 'refer':
    case 'referral':
    case 'gift':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <polyline points="20 12 20 22 4 22 4 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="2" y="7" width="20" height="5" rx="1" stroke={color} strokeWidth="2"/>
          <line x1="12" y1="22" x2="12" y2="7" stroke={color} strokeWidth="2"/>
          <path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );

    // ── 20. Star ──
    case 'star':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill={color} stroke={color} strokeWidth="1.2" strokeLinejoin="round"/>
        </svg>
      );

    // ── 21. Coin ──
    case 'coin':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2"/>
          <text x="12" y="16" textAnchor="middle" fontSize="9" fontWeight="800" fill={color}>₹</text>
        </svg>
      );

    // ── 22. Offer (Percent tag) ──
    case 'offer':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="9" cy="9" r="2" fill={color}/>
          <circle cx="15" cy="15" r="2" fill={color}/>
          <path d="M5 5l14 14" stroke={color} strokeWidth="2" strokeLinecap="round"/>
          <rect x="3" y="3" width="18" height="18" rx="4" stroke={color} strokeWidth="2"/>
        </svg>
      );

    // ── 23. Ticket ──
    case 'ticket':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M2 9a2 2 0 010-4h20a2 2 0 010 4v1a2 2 0 000 4v1a2 2 0 010 4H2a2 2 0 010-4v-1a2 2 0 000-4V9z"
            stroke={color} strokeWidth="2" strokeLinejoin="round"/>
          <path d="M9 5v14M9 10h6M9 14h4" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
      );

    // ── Default / Info fallback ──
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
          <path d="M12 11v6M12 7.5h.01" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
  }
}
