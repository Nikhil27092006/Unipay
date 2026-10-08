import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../components/AppHeader';
import { CURRENT_USER, formatINR } from '../data/mockData';
import { EmojiBadge } from '../components/EmojiBadge';

export function Profile() {
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Personal Details', icon: 'user', sub: 'Name, phone, email', route: '/profile/details', bg: '#EFF6FF', color: '#2563EB' },
    { label: 'KYC Verification', icon: 'shield', sub: 'Verified · UIDAI linked', badge: 'Verified', route: '/kyc', bg: '#ECFDF5', color: '#059669' },
    { label: 'UPI & Payments', icon: 'card', sub: 'UPI IDs, linked accounts', route: '/profile/upi', bg: '#EEF2FF', color: '#4F46E5' },
    { label: 'Notifications', icon: 'bell', sub: 'Alerts, approvals, updates', route: '/notifications', bg: '#FFFBEB', color: '#D97706' },
    { label: 'Security', icon: 'lock', sub: 'PIN, biometrics', route: '/profile/security', bg: '#FEF2F2', color: '#DC2626' },
    { label: 'Help & Support', icon: 'help', sub: 'FAQs, raise a ticket', route: '/profile/help', bg: '#F3F4F6', color: '#4B5563' },
  ];

  return (
    <>
      <AppHeader />
      <div className="page-content" style={{ paddingTop: 8 }}>
        {/* Profile Card */}
        <div style={{
          background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
          borderRadius: 20, padding: 24, marginBottom: 24,
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <img
            src={CURRENT_USER.avatar}
            alt={CURRENT_USER.name}
            style={{ width: 68, height: 68, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.4)' }}
          />
          <div style={{ color: '#FFFFFF' }}>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{CURRENT_USER.fullName}</div>
            <div style={{ fontSize: 13, opacity: 0.8, marginTop: 2 }}>{CURRENT_USER.phone}</div>
            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2, fontFamily: 'monospace' }}>{CURRENT_USER.upiId}</div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(255,255,255,0.2)', borderRadius: 20,
              padding: '4px 10px', marginTop: 8, fontSize: 11, fontWeight: 700,
            }}>
              <EmojiBadge name="check" size={14} shape="none" color="#FFFFFF" />
              KYC Verified
            </div>
          </div>
        </div>

        {/* Balance summary */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
          <div style={{ background: '#FFFFFF', borderRadius: 16, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Personal Balance</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#111827', marginTop: 4 }}>{formatINR(CURRENT_USER.personalBalance)}</div>
          </div>
          <div style={{ background: '#FFFFFF', borderRadius: 16, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Active Groups</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#111827', marginTop: 4 }}>4</div>
          </div>
        </div>

        {/* Menu */}
        <div style={{ background: '#FFFFFF', borderRadius: 18, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          {menuItems.map((item, i) => (
            <button
              key={item.label}
              onClick={() => navigate(item.route)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 16px',
                background: 'none', border: 'none',
                borderBottom: i < menuItems.length - 1 ? '1px solid #F9FAFB' : 'none',
                cursor: 'pointer', textAlign: 'left',
              }}
            >
              <EmojiBadge
                name={item.icon}
                bg={item.bg}
                color={item.color}
                size={40}
                shape="squircle"
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{item.label}</div>
                <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 1 }}>{item.sub}</div>
              </div>
              {item.badge && (
                <span style={{ fontSize: 11, background: '#DCFCE7', color: '#16A34A', padding: '3px 8px', borderRadius: 8, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <EmojiBadge name="check" size={12} shape="none" color="#16A34A" />
                  {item.badge}
                </span>
              )}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          ))}
        </div>

        <button
          style={{
            width: '100%', marginTop: 20, padding: 14, borderRadius: 16,
            background: '#FEE2E2', color: '#DC2626', border: 'none',
            fontSize: 14, fontWeight: 700, cursor: 'pointer',
          }}
          onClick={() => navigate('/login')}
        >
          Sign Out
        </button>
      </div>
    </>
  );
}
