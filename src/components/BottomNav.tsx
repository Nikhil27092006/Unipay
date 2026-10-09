import { useNavigate, useLocation } from 'react-router-dom';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const isActive = (route: string) => {
    if (route === '/') return path === '/';
    return path.startsWith(route);
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 390,
      // Translucent frosted glass styling
      background: 'rgba(255, 255, 255, 0.78)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      borderTop: '1px solid rgba(255, 255, 255, 0.85)',
      boxShadow: '0 -8px 28px rgba(15, 23, 42, 0.07), 0 -1px 3px rgba(0, 0, 0, 0.02)',
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

        {/* Center elevated / tilted floating send button */}
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* Luminous cyan/blue aura halo behind button */}
          <div style={{
            position: 'absolute',
            top: -24,
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.45) 0%, rgba(37, 99, 235, 0.22) 52%, transparent 74%)',
            filter: 'blur(8px)',
            pointerEvents: 'none',
          }} />

          <button
            onClick={() => navigate('/scan')}
            aria-label="Send & Pay"
            style={{
              position: 'relative',
              zIndex: 2,
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #38BDF8 0%, #2563EB 52%, #1D4ED8 100%)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 24px rgba(56, 189, 248, 0.45), 0 8px 24px rgba(37, 99, 235, 0.38)',
              cursor: 'pointer',
              marginTop: -26,
              flexShrink: 0,
              transition: 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.15s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.06)';
              e.currentTarget.style.boxShadow = '0 0 30px rgba(56, 189, 248, 0.6), 0 10px 28px rgba(37, 99, 235, 0.5)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 0 24px rgba(56, 189, 248, 0.45), 0 8px 24px rgba(37, 99, 235, 0.38)';
            }}
            onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.92)'; }}
            onMouseUp={e => { e.currentTarget.style.transform = 'scale(1.06)'; }}
            onTouchStart={e => { e.currentTarget.style.transform = 'scale(0.92)'; }}
            onTouchEnd={e => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <svg width="25" height="25" viewBox="0 0 24 24" fill="none" style={{ transform: 'translate(-1px, 1px)' }}>
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
            background: 'radial-gradient(circle, rgba(37, 99, 235, 0.12) 0%, transparent 70%)',
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
