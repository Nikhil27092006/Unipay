import { useNavigate } from 'react-router-dom';
import { CURRENT_USER } from '../data/mockData';

interface AppHeaderProps {
  showBack?: boolean;
  title?: string;
  rightAction?: React.ReactNode;
}

export function AppHeader({ showBack, title, rightAction }: AppHeaderProps) {
  const navigate = useNavigate();

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 16px 10px',
      background: 'rgba(248, 250, 253, 0.82)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      borderBottom: '1px solid rgba(226, 232, 240, 0.65)',
      position: 'sticky',
      top: 0,
      zIndex: 35,
      transition: 'all 0.2s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {showBack ? (
          <button
            onClick={() => navigate(-1)}
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: '#F1F5F9', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 5l-7 7 7 7" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        ) : (
          <div
            onClick={() => {
              window.dispatchEvent(new CustomEvent('cowallet-replay-splash'));
            }}
            style={{ cursor: 'pointer' }}
            title="Tap to replay intro"
          >
            <CoWalletLogo />
          </div>
        )}
        {title && !showBack && (
          <span style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>{title}</span>
        )}
        {showBack && title && (
          <span style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>{title}</span>
        )}
      </div>

      {!showBack && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Bell */}
          <button
            onClick={() => navigate('/notifications')}
            style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"
                stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{
              position: 'absolute', top: 2, right: 2,
              width: 8, height: 8, borderRadius: '50%',
              background: '#EF4444', border: '1.5px solid white',
            }} />
          </button>
          {/* Avatar */}
          <button
            onClick={() => navigate('/profile')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <img
              src={CURRENT_USER.avatar}
              alt={CURRENT_USER.name}
              style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid #E5E7EB' }}
            />
          </button>
        </div>
      )}

      {rightAction && <div>{rightAction}</div>}
    </header>
  );
}

export function CoWalletLogo({ size = 32 }: { size?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
      <img
        src="/logo.png"
        alt="CoWallet Logo"
        style={{
          width: size,
          height: size,
          objectFit: 'contain',
          borderRadius: 8,
          display: 'block',
        }}
      />
      <span style={{ fontSize: 18, fontWeight: 800, color: '#111827', letterSpacing: '-0.3px' }}>CoWallet</span>
    </div>
  );
}

export const UniPayLogo = CoWalletLogo;
