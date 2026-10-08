import { useNavigate, useLocation } from 'react-router-dom';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const isActive = (route: string) => {
    if (route === '/') return path === '/';
    return path.startsWith(route);
  };

  const isDark = false;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 390,
      background: isDark ? '#0A0F1D' : '#FFFFFF',
      borderTop: isDark ? '1px solid #1E293B' : '1px solid #F1F5F9',
      zIndex: 40,
      boxShadow: isDark ? '0 -4px 20px rgba(0,0,0,0.5)' : '0 -4px 20px rgba(0,0,0,0.04)',
      paddingBottom: 'calc(6px + env(safe-area-inset-bottom, 0px))',
      transition: 'background 0.2s ease, border-color 0.2s ease',
    }}>
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '8px 6px 4px',
      }}>
        {/* Home */}
        <NavItem
          active={isActive('/')}
          onClick={() => navigate('/')}
          label="Home"
          isDark={isDark}
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24">
              <path
                d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6a1 1 0 00-1-1h-4a1 1 0 00-1 1v6H4a1 1 0 01-1-1v-9.5z"
                fill={isActive('/') ? 'currentColor' : 'none'}
                stroke="currentColor"
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
          isDark={isDark}
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        />

        {/* Send / Paper Plane – Center elevated */}
        <button
          onClick={() => navigate('/scan')}
          aria-label="Send & Pay"
          style={{
            width: 54,
            height: 54,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 0 6px rgba(37, 99, 235, 0.16), 0 8px 24px rgba(37, 99, 235, 0.42)',
            cursor: 'pointer',
            marginTop: -22,
            flexShrink: 0,
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
          onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.92)')}
          onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
          onTouchStart={e => (e.currentTarget.style.transform = 'scale(0.92)')}
          onTouchEnd={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ transform: 'translate(-1px, 1px)' }}>
            <path
              d="M22 2L15 22L11 13L2 9L22 2Z"
              fill="white"
              stroke="white"
              strokeWidth="1.2"
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
        </button>

        {/* Activity */}
        <NavItem
          active={isActive('/activity')}
          onClick={() => navigate('/activity')}
          label="Activity"
          isDark={isDark}
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }
        />

        {/* Profile */}
        <NavItem
          active={isActive('/profile')}
          onClick={() => navigate('/profile')}
          label="Profile"
          isDark={isDark}
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        />
      </nav>
      {/* Home Indicator bar */}
      <div style={{
        width: 134,
        height: 4.5,
        background: isDark ? '#334155' : '#111827',
        borderRadius: 3,
        margin: '2px auto 0',
        opacity: 0.85,
      }} />
    </div>
  );
}

function NavItem({ active, onClick, label, icon, isDark }: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
  isDark?: boolean;
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
        padding: '4px 12px',
        color: active ? (isDark ? '#00D084' : '#2563EB') : (isDark ? '#64748B' : '#9CA3AF'),
        transition: 'color 0.15s',
        minWidth: 48,
      }}
    >
      {icon}
      <span style={{ fontSize: 11, fontWeight: active ? 700 : 500 }}>{label}</span>
    </button>
  );
}
