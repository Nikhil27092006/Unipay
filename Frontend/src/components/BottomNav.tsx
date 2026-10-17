import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface BottomNavProps {
  onOpenPay?: () => void;
}

// ── Funky Paper Plane Launch Keyframes & Particles ───────────────────────────
const NAV_LAUNCH_STYLES = `
@keyframes planeNavRumble {
  0%, 100% { transform: scale(1) translate(0, 0) rotate(0deg); }
  12% { transform: scale(1.08) translate(-3px, -1px) rotate(-4deg); }
  25% { transform: scale(1.08) translate(3px, 1px) rotate(4deg); }
  38% { transform: scale(1.1) translate(-4px, 0px) rotate(-3deg); }
  50% { transform: scale(1.1) translate(4px, -1px) rotate(3deg); }
  62% { transform: scale(1.08) translate(-3px, 1px) rotate(-2deg); }
  75% { transform: scale(1.06) translate(3px, -1px) rotate(2deg); }
  88% { transform: scale(1.03) translate(-1px, 0px) rotate(-1deg); }
}

@keyframes planeNavGlow {
  0% {
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
  }
  25% {
    box-shadow: 0 0 30px rgba(37, 99, 235, 0.95), 0 0 60px rgba(56, 189, 248, 0.85), 0 0 90px rgba(99, 102, 241, 0.6);
  }
  60% {
    box-shadow: 0 0 40px rgba(37, 99, 235, 1), 0 0 80px rgba(56, 189, 248, 0.9);
  }
  100% {
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
  }
}

@keyframes planeShockwave {
  0% {
    transform: translate(-50%, -50%) scale(0.6);
    opacity: 1;
    border-width: 3px;
  }
  50% {
    transform: translate(-50%, -50%) scale(2.2);
    opacity: 0.85;
    border-width: 2px;
  }
  100% {
    transform: translate(-50%, -50%) scale(3.6);
    opacity: 0;
    border-width: 1px;
  }
}

@keyframes planeConfetti {
  0% {
    transform: translate(0, 0) scale(1) rotate(0deg);
    opacity: 1;
  }
  70% {
    opacity: 0.95;
  }
  100% {
    transform: translate(var(--tx), var(--ty)) scale(0) rotate(var(--rot));
    opacity: 0;
  }
}

@keyframes planeFlightShoot {
  0% {
    transform: translate(-50%, -50%) rotate(-45deg) scale(0.85);
    opacity: 0;
  }
  12% {
    transform: translate(-50%, -50%) rotate(-45deg) scale(1.25);
    opacity: 1;
  }
  42% {
    transform: translate(-50%, -180px) rotate(-45deg) scale(1.35);
    opacity: 1;
  }
  75% {
    transform: translate(-50%, -360px) rotate(-45deg) scale(1.2);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -580px) rotate(-45deg) scale(0.6);
    opacity: 0;
  }
}

@keyframes planeContrail {
  0% {
    width: 0px;
    opacity: 0;
  }
  20% {
    width: 35px;
    opacity: 0.95;
  }
  60% {
    width: 75px;
    opacity: 0.8;
  }
  100% {
    width: 110px;
    opacity: 0;
  }
}

@keyframes planeContrailVertical {
  0% {
    height: 0px;
    opacity: 0;
  }
  20% {
    height: 40px;
    opacity: 1;
  }
  60% {
    height: 80px;
    opacity: 0.85;
  }
  100% {
    height: 120px;
    opacity: 0;
  }
}
`;

const LAUNCH_PARTICLES = [
  { id: 1, tx: '-40px', ty: '-65px', rot: '45deg', color: '#2563EB', size: 7, delay: 0 },
  { id: 2, tx: '48px', ty: '-70px', rot: '-35deg', color: '#38BDF8', size: 6, delay: 20 },
  { id: 3, tx: '-72px', ty: '-38px', rot: '90deg', color: '#6366F1', size: 8, delay: 10 },
  { id: 4, tx: '75px', ty: '-42px', rot: '-60deg', color: '#10B981', size: 7, delay: 30 },
  { id: 5, tx: '-22px', ty: '-90px', rot: '120deg', color: '#F59E0B', size: 6, delay: 15 },
  { id: 6, tx: '28px', ty: '-95px', rot: '-90deg', color: '#2563EB', size: 8, delay: 25 },
  { id: 7, tx: '-58px', ty: '-80px', rot: '180deg', color: '#00D2FF', size: 6, delay: 35 },
  { id: 8, tx: '62px', ty: '-85px', rot: '-140deg', color: '#EC4899', size: 7, delay: 10 },
  { id: 9, tx: '0px', ty: '-110px', rot: '30deg', color: '#8B5CF6', size: 8, delay: 5 },
  { id: 10, tx: '-82px', ty: '-18px', rot: '-45deg', color: '#3B82F6', size: 6, delay: 40 },
  { id: 11, tx: '88px', ty: '-22px', rot: '60deg', color: '#F59E0B', size: 7, delay: 30 },
  { id: 12, tx: '-42px', ty: '-105px', rot: '-75deg', color: '#10B981', size: 6, delay: 20 },
  { id: 13, tx: '48px', ty: '-110px', rot: '110deg', color: '#38BDF8', size: 7, delay: 15 },
  { id: 14, tx: '18px', ty: '-125px', rot: '-120deg', color: '#2563EB', size: 8, delay: 25 },
];

export function BottomNav({ onOpenPay }: BottomNavProps = {}) {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchCount, setLaunchCount] = useState(0);

  const handlePlaneClick = () => {
    if (isLaunching) return;
    setIsLaunching(true);
    setLaunchCount(prev => prev + 1);

    // Rumble & Plane shoots off, then open the Payment Mode Selection Sheet (Personal vs Group)
    setTimeout(() => {
      if (onOpenPay) {
        onOpenPay();
      } else {
        window.dispatchEvent(new CustomEvent('cowallet-open-payment-modal'));
      }
    }, 500);

    // Reset button animation state
    setTimeout(() => {
      setIsLaunching(false);
    }, 850);
  };

  const isActive = (route: string) => {
    if (route === '/') return path === '/';
    return path.startsWith(route);
  };

  return (
    <>
      <style>{NAV_LAUNCH_STYLES}</style>
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 390,
        background: '#FFFFFF',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderTop: '1px solid #E5E7EB',
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)',
        zIndex: 50,
        paddingBottom: 'calc(6px + env(safe-area-inset-bottom, 0px))',
        transition: 'all 0.2s ease',
      }}>
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '8px 10px 4px',
          position: 'relative',
        }}>
          {/* Home */}
          <NavItem
            active={isActive('/')}
            onClick={() => navigate('/')}
            label="Home"
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill={isActive('/') ? '#2563EB' : 'none'}>
                <path
                  d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6a1 1 0 00-1-1h-4a1 1 0 00-1 1v6H4a1 1 0 01-1-1v-9.5z"
                  stroke={isActive('/') ? '#2563EB' : '#94A3B8'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
          />

          {/* Groups */}
          <NavItem
            active={isActive('/groups')}
            onClick={() => navigate('/groups')}
            label="Groups"
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                  stroke={isActive('/groups') ? '#2563EB' : '#94A3B8'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="9" cy="7" r="4"
                  stroke={isActive('/groups') ? '#2563EB' : '#94A3B8'}
                  strokeWidth="2"
                />
                <path
                  d="M22 21v-2a4 4 0 0 0-3-3.87"
                  stroke={isActive('/groups') ? '#2563EB' : '#94A3B8'}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M16 3.13a4 4 0 0 1 0 7.75"
                  stroke={isActive('/groups') ? '#2563EB' : '#94A3B8'}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            }
          />

          {/* Center elevated send button - Solid professional blue with Funky Launch Animation */}
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {/* 1. Neon Shockwave Ring on Launch */}
            {isLaunching && (
              <div
                key={`shock-${launchCount}`}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: 'calc(50% - 26px)',
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  border: '2px solid #38BDF8',
                  pointerEvents: 'none',
                  zIndex: 99990,
                  animation: 'planeShockwave 0.55s cubic-bezier(0.1, 0.8, 0.3, 1) forwards',
                  boxShadow: '0 0 24px rgba(56, 189, 248, 0.8)',
                }}
              />
            )}

            {/* 2. 14 Confetti Particles Exploding Outward & Upward */}
            {isLaunching && LAUNCH_PARTICLES.map(p => (
              <div
                key={`p-${launchCount}-${p.id}`}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: 'calc(50% - 26px)',
                  width: p.size,
                  height: p.size,
                  borderRadius: p.id % 3 === 0 ? '2px' : '50%',
                  background: p.color,
                  pointerEvents: 'none',
                  zIndex: 99998,
                  boxShadow: `0 0 8px ${p.color}`,
                  // @ts-ignore
                  '--tx': p.tx,
                  '--ty': p.ty,
                  '--rot': p.rot,
                  animation: `planeConfetti 0.65s cubic-bezier(0.15, 0.85, 0.35, 1) ${p.delay}ms forwards`,
                }}
              />
            ))}

            {/* 3. Paper Plane Shooting Diagonally Across Screen */}
            {isLaunching && (
              <div
                key={`flight-${launchCount}`}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: 'calc(50% - 26px)',
                  pointerEvents: 'none',
                  zIndex: 99999,
                  animation: 'planeFlightShoot 0.75s cubic-bezier(0.2, 0.85, 0.25, 1) forwards',
                }}
              >
                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <svg
                    width="34"
                    height="34"
                    viewBox="0 0 24 24"
                    fill="none"
                    style={{ filter: 'drop-shadow(0 0 12px rgba(56, 189, 248, 0.95))' }}
                  >
                    <path
                      d="M22 2L15 22L11 13L2 9L22 2Z"
                      fill="#FFFFFF"
                      stroke="#2563EB"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22 2L11 13"
                      stroke="#1D4ED8"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {/* Vertical Exhaust Contrail */}
                  <div
                    style={{
                      width: '4px',
                      height: '65px',
                      background: 'linear-gradient(180deg, #FFFFFF 0%, #38BDF8 40%, rgba(56, 189, 248, 0.4) 80%, transparent 100%)',
                      borderRadius: '999px',
                      marginTop: '-4px',
                      boxShadow: '0 0 12px rgba(56, 189, 248, 0.95)',
                      animation: 'planeContrailVertical 0.75s ease-out forwards',
                    }}
                  />
                </div>
              </div>
            )}

            {/* Elevated Button with Rumble & Glow */}
            <button
              onClick={handlePlaneClick}
              aria-label="Send & Pay"
              style={{
                position: 'relative',
                zIndex: 2,
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: '#2563EB',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isLaunching
                  ? '0 0 35px rgba(37, 99, 235, 0.9), 0 0 70px rgba(56, 189, 248, 0.8)'
                  : '0 4px 12px rgba(37, 99, 235, 0.3)',
                cursor: 'pointer',
                marginTop: -26,
                flexShrink: 0,
                transform: isLaunching ? 'scale(1.08)' : 'scale(1)',
                animation: isLaunching
                  ? 'planeNavRumble 0.35s ease-in-out, planeNavGlow 0.85s ease-out'
                  : 'none',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              onMouseEnter={e => {
                if (!isLaunching) {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(37, 99, 235, 0.4)';
                }
              }}
              onMouseLeave={e => {
                if (!isLaunching) {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
                }
              }}
              onMouseDown={e => {
                if (!isLaunching) e.currentTarget.style.transform = 'scale(0.95)';
              }}
              onMouseUp={e => {
                if (!isLaunching) e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onTouchStart={e => {
                if (!isLaunching) e.currentTarget.style.transform = 'scale(0.95)';
              }}
              onTouchEnd={e => {
                if (!isLaunching) e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <svg
                width="25"
                height="25"
                viewBox="0 0 24 24"
                fill="none"
                style={{
                  transform: isLaunching
                    ? 'translate(-1px, 1px) scale(0.6) rotate(-20deg)'
                    : 'translate(-1px, 1px)',
                  opacity: isLaunching ? 0.3 : 1,
                  transition: 'transform 0.2s ease, opacity 0.2s ease',
                }}
              >
                <path
                  d="M22 2L15 22L11 13L2 9L22 2Z"
                  fill="white"
                  stroke="white"
                  strokeWidth="1"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 2L11 13"
                  stroke="#1D4ED8"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

        {/* Activity */}
        <NavItem
          active={isActive('/activity')}
          onClick={() => navigate('/activity')}
          label="Activity"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12" cy="12" r="9"
                stroke={isActive('/activity') ? '#2563EB' : '#94A3B8'}
                strokeWidth="2"
              />
              <polyline
                points="12 7 12 12 15 14"
                stroke={isActive('/activity') ? '#2563EB' : '#94A3B8'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        />

        {/* Profile */}
        <NavItem
          active={isActive('/profile')}
          onClick={() => navigate('/profile')}
          label="Profile"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                stroke={isActive('/profile') ? '#2563EB' : '#94A3B8'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="12" cy="7" r="4"
                stroke={isActive('/profile') ? '#2563EB' : '#94A3B8'}
                strokeWidth="2"
              />
            </svg>
          }
        />
      </nav>

      {/* Home Indicator bar */}
      <div style={{
        width: 134,
        height: 4.5,
        background: '#0F172A',
        borderRadius: 3,
        margin: '3px auto 1px',
        opacity: 0.18,
      }} />
      </div>
    </>
  );
}

function NavItem({ active, onClick, label, icon }: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '4px 10px',
        color: active ? '#2563EB' : '#94A3B8',
        transition: 'all 0.15s ease',
        minWidth: 48,
        position: 'relative',
      }}
    >
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 28,
        height: 28,
      }}>
        {active && (
          <div style={{
            position: 'absolute',
            inset: -4,
            borderRadius: '50%',
            background: 'rgba(37, 99, 235, 0.1)',
            pointerEvents: 'none',
          }} />
        )}
        {icon}
      </div>
      <span style={{
        fontSize: 11,
        fontWeight: active ? 700 : 500,
        letterSpacing: '-0.2px',
        transition: 'font-weight 0.15s',
      }}>
        {label}
      </span>
    </button>
  );
}
