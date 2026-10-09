import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../components/AppHeader';
import { CURRENT_USER, formatINR } from '../data/mockData';

// ── Inline SVG icons (no emoji, clean) ─────────────────────────
function Icon({ name, size = 18, color = 'currentColor' }: { name: string; size?: number; color?: string }) {
  const s = { width: size, height: size, display: 'block' as const };
  switch (name) {
    case 'user':      return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>;
    case 'shield':    return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
    case 'card':      return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="3"/><line x1="2" y1="10" x2="22" y2="10"/></svg>;
    case 'bell':      return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
    case 'lock':      return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
    case 'help':      return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="3"/></svg>;
    case 'zap':       return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
    case 'logout':    return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
    case 'chevron':   return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;
    case 'check':     return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
    case 'copy':      return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>;
    case 'wallet':    return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><circle cx="18" cy="12" r="2" fill={color} stroke="none"/></svg>;
    case 'group':     return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
    case 'star':      return <svg style={s} viewBox="0 0 24 24" fill={color} stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
    default:          return null;
  }
}

// ── Stat card ───────────────────────────────────────────────────
function StatCard({ label, value, sub, iconName, iconBg, iconColor }: {
  label: string; value: string; sub?: string;
  iconName: string; iconBg: string; iconColor: string;
}) {
  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: 18,
      padding: '16px 18px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
      border: '1px solid #F1F5F9',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}>
      <div style={{
        width: 38, height: 38,
        borderRadius: 12,
        background: iconBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={iconName} size={18} color={iconColor} />
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', marginTop: 2, letterSpacing: '-0.5px' }}>{value}</div>
        {sub && <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

// ── Menu row ────────────────────────────────────────────────────
function MenuRow({
  iconName, iconBg, iconColor, label, sub,
  badge, badgeColor, badgeBg, onClick, isLast,
}: {
  iconName: string; iconBg: string; iconColor: string;
  label: string; sub: string;
  badge?: string; badgeColor?: string; badgeBg?: string;
  onClick: () => void; isLast?: boolean;
}) {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      style={{
        width: '100%',
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '14px 18px',
        background: pressed ? '#F8FAFC' : 'transparent',
        border: 'none',
        borderBottom: isLast ? 'none' : '1px solid #F1F5F9',
        cursor: 'pointer', textAlign: 'left',
        transition: 'background 0.15s ease',
      }}
    >
      {/* Icon box */}
      <div style={{
        width: 42, height: 42,
        borderRadius: 13,
        background: iconBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon name={iconName} size={19} color={iconColor} />
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>{label}</div>
        <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>{sub}</div>
      </div>

      {/* Badge */}
      {badge && (
        <span style={{
          fontSize: 10.5, fontWeight: 700,
          color: badgeColor ?? '#16A34A',
          background: badgeBg ?? '#DCFCE7',
          padding: '3px 9px', borderRadius: 20,
          flexShrink: 0,
        }}>
          {badge}
        </span>
      )}

      {/* Arrow */}
      <Icon name="chevron" size={16} color="#CBD5E1" />
    </button>
  );
}

// ── Quick action button ─────────────────────────────────────────
function QuickAction({ iconName, label, color, bg, onClick }: {
  iconName: string; label: string; color: string; bg: string; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        padding: '14px 8px',
        background: '#FFFFFF',
        border: '1px solid #F1F5F9',
        borderRadius: 16,
        cursor: 'pointer',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
        (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
      }}
    >
      <div style={{
        width: 42, height: 42,
        borderRadius: 12,
        background: bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={iconName} size={20} color={color} />
      </div>
      <span style={{ fontSize: 11.5, fontWeight: 600, color: '#475569' }}>{label}</span>
    </button>
  );
}

// ── Main Profile Page ───────────────────────────────────────────
export function Profile() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'settings' | 'activity'>('settings');

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(CURRENT_USER.upiId).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const menuSections = [
    {
      title: 'Account',
      items: [
        { iconName: 'user', iconBg: '#EFF6FF', iconColor: '#2563EB', label: 'Personal Details', sub: 'Name, phone, email address', route: '/profile/details' },
        { iconName: 'shield', iconBg: '#ECFDF5', iconColor: '#059669', label: 'KYC Verification', sub: 'UIDAI linked · Fully verified', route: '/kyc', badge: 'Verified', badgeColor: '#059669', badgeBg: '#D1FAE5' },
        { iconName: 'card', iconBg: '#EEF2FF', iconColor: '#4F46E5', label: 'UPI & Payments', sub: 'Linked accounts, UPI IDs', route: '/profile/upi' },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { iconName: 'bell', iconBg: '#FFFBEB', iconColor: '#D97706', label: 'Notifications', sub: 'Alerts, approvals, activity', route: '/notifications' },
        { iconName: 'lock', iconBg: '#FEF2F2', iconColor: '#DC2626', label: 'Security & Privacy', sub: 'PIN, biometrics, sessions', route: '/profile/security' },
      ],
    },
    {
      title: 'More',
      items: [
        { iconName: 'zap', iconBg: '#F0F9FF', iconColor: '#0284C7', label: 'Replay Intro Animation', sub: 'Re-experience CoWallet splash', route: '#replay' },
        { iconName: 'help', iconBg: '#F8FAFC', iconColor: '#64748B', label: 'Help & Support', sub: 'FAQs, raise a ticket', route: '/profile/help' },
      ],
    },
  ];

  // Recent activity items (mock)
  const recentActivity = [
    { label: 'Contributed to Flatmates', amount: '+₹2,000', time: 'Today, 10:15 AM', color: '#16A34A', bg: '#DCFCE7' },
    { label: 'Paid Electricity Bill', amount: '-₹800', time: 'Yesterday, 4:30 PM', color: '#DC2626', bg: '#FEE2E2' },
    { label: 'Ganpati Group Pool', amount: '+₹1,500', time: 'Oct 6, 12:00 PM', color: '#16A34A', bg: '#DCFCE7' },
    { label: 'Trip to Goa – Deposit', amount: '-₹3,000', time: 'Oct 4, 9:00 AM', color: '#DC2626', bg: '#FEE2E2' },
  ];

  return (
    <>
      <AppHeader />
      <div className="page-content" style={{ paddingTop: 0 }}>

        {/* ── Simplified & Clean Profile Header ─────────────────────────────── */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: 24,
          padding: '22px 20px',
          border: '1.5px solid rgba(255, 255, 255, 0.95)',
          boxShadow: '0 4px 20px rgba(15, 23, 42, 0.05)',
          marginBottom: 16,
          marginTop: 10,
        }}>
          {/* Avatar + User Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Clean Monogram Avatar */}
            <div style={{
              width: 62, height: 62, borderRadius: '50%',
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, fontWeight: 800, color: '#FFFFFF',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)',
              flexShrink: 0,
            }}>
              {CURRENT_USER.fullName.charAt(0)}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 19, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.3px' }}>
                  {CURRENT_USER.fullName}
                </span>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  background: '#DCFCE7', color: '#16A34A',
                  fontSize: 10.5, fontWeight: 700,
                  padding: '2px 8px', borderRadius: 12,
                }}>
                  <Icon name="check" size={10} color="#16A34A" />
                  Verified
                </span>
              </div>
              <div style={{ fontSize: 13, color: '#64748B', marginTop: 2, fontWeight: 500 }}>
                {CURRENT_USER.phone}
              </div>
            </div>

            {/* Edit button */}
            <button style={{
              background: '#F1F5F9',
              border: 'none',
              borderRadius: 12,
              padding: '8px 14px',
              fontSize: 12.5, fontWeight: 600, color: '#334155',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'background 0.15s ease',
            }}>
              Edit
            </button>
          </div>

          {/* Clean UPI ID Bar */}
          <div style={{
            marginTop: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: 14,
            padding: '10px 14px',
          }}>
            <div>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>UPI ID</div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: '#1E293B', fontFamily: 'monospace', marginTop: 1 }}>{CURRENT_USER.upiId}</div>
            </div>

            <button
              onClick={handleCopyUPI}
              style={{
                background: copied ? '#DCFCE7' : '#FFFFFF',
                border: copied ? '1px solid #86EFAC' : '1px solid #CBD5E1',
                borderRadius: 10,
                padding: '6px 12px',
                display: 'flex', alignItems: 'center', gap: 5,
                fontSize: 12, fontWeight: 700, color: copied ? '#16A34A' : '#334155',
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                transition: 'all 0.2s ease',
              }}
            >
              <Icon name={copied ? 'check' : 'copy'} size={13} color={copied ? '#16A34A' : '#475569'} />
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* ── Stats cards ──────────────────── */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
          gap: 10,
          marginBottom: 20,
        }}>
          <StatCard
            label="Balance"
            value={formatINR(CURRENT_USER.personalBalance)}
            sub="Personal"
            iconName="wallet"
            iconBg="linear-gradient(135deg, #EFF6FF, #DBEAFE)"
            iconColor="#2563EB"
          />
          <StatCard
            label="Groups"
            value="4"
            sub="Active"
            iconName="group"
            iconBg="linear-gradient(135deg, #F5F3FF, #EDE9FE)"
            iconColor="#7C3AED"
          />
          <StatCard
            label="Rating"
            value="4.9"
            sub="Trust score"
            iconName="star"
            iconBg="linear-gradient(135deg, #FFFBEB, #FEF3C7)"
            iconColor="#F59E0B"
          />
        </div>

        {/* ── Quick Actions ───────────────────────────────────── */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: 20,
          padding: '18px 14px',
          marginBottom: 16,
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          border: '1px solid #F1F5F9',
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#64748B', marginBottom: 14, paddingLeft: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Quick Actions
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <QuickAction iconName="card" label="Add Money" color="#2563EB" bg="#EFF6FF" onClick={() => {}} />
            <QuickAction iconName="group" label="New Group" color="#7C3AED" bg="#F5F3FF" onClick={() => navigate('/create-group')} />
            <QuickAction iconName="bell" label="Alerts" color="#D97706" bg="#FFFBEB" onClick={() => navigate('/notifications')} />
            <QuickAction iconName="shield" label="KYC" color="#059669" bg="#ECFDF5" onClick={() => navigate('/kyc')} />
          </div>
        </div>

        {/* ── Tab bar: Settings / Activity ───────────────────── */}
        <div style={{
          display: 'flex',
          background: '#F1F5F9',
          borderRadius: 14,
          padding: 4,
          marginBottom: 16,
          gap: 4,
        }}>
          {(['settings', 'activity'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: 11,
                border: 'none',
                background: activeTab === tab ? '#FFFFFF' : 'transparent',
                fontSize: 13,
                fontWeight: activeTab === tab ? 700 : 500,
                color: activeTab === tab ? '#0F172A' : '#94A3B8',
                cursor: 'pointer',
                boxShadow: activeTab === tab ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.2s ease',
                textTransform: 'capitalize',
              }}
            >
              {tab === 'settings' ? 'Settings' : 'Recent Activity'}
            </button>
          ))}
        </div>

        {/* ── SETTINGS TAB ─────────────────────────────────────── */}
        {activeTab === 'settings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {menuSections.map((section) => (
              <div key={section.title}>
                <div style={{
                  fontSize: 11, fontWeight: 700,
                  color: '#94A3B8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em',
                  paddingLeft: 4,
                  marginBottom: 8,
                }}>
                  {section.title}
                </div>
                <div style={{
                  background: '#FFFFFF',
                  borderRadius: 18,
                  overflow: 'hidden',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                  border: '1px solid #F1F5F9',
                }}>
                  {section.items.map((item, i) => (
                    <MenuRow
                      key={item.label}
                      iconName={item.iconName}
                      iconBg={item.iconBg}
                      iconColor={item.iconColor}
                      label={item.label}
                      sub={item.sub}
                      badge={item.badge}
                      badgeColor={item.badgeColor}
                      badgeBg={item.badgeBg}
                      isLast={i === section.items.length - 1}
                      onClick={() => {
                        if (item.route === '#replay') {
                          window.dispatchEvent(new CustomEvent('cowallet-replay-splash'));
                          return;
                        }
                        navigate(item.route);
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}

            {/* Sign Out */}
            <button
              onClick={() => navigate('/login')}
              style={{
                width: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                marginTop: 4,
                padding: '14px',
                borderRadius: 16,
                background: '#FEF2F2',
                color: '#DC2626',
                border: '1px solid #FECACA',
                fontSize: 14, fontWeight: 700,
                cursor: 'pointer',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#FEE2E2'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#FEF2F2'; }}
            >
              <Icon name="logout" size={16} color="#DC2626" />
              Sign Out
            </button>

            {/* App version */}
            <div style={{ textAlign: 'center', marginTop: 4, paddingBottom: 8 }}>
              <div style={{ fontSize: 11.5, color: '#CBD5E1', fontWeight: 500 }}>CoWallet v1.0.0 · Made with care in India</div>
            </div>
          </div>
        )}

        {/* ── ACTIVITY TAB ─────────────────────────────────────── */}
        {activeTab === 'activity' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Summary strip */}
            <div style={{
              background: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)',
              border: '1px solid #BBF7D0',
              borderRadius: 16,
              padding: '14px 18px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#15803D', textTransform: 'uppercase', letterSpacing: '0.05em' }}>This Month</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#14532D', marginTop: 2 }}>+₹3,500</div>
                <div style={{ fontSize: 11, color: '#16A34A', marginTop: 2 }}>Net contributions</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#B45309', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Spent</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#92400E', marginTop: 2 }}>-₹3,800</div>
                <div style={{ fontSize: 11, color: '#D97706', marginTop: 2 }}>Group payments</div>
              </div>
            </div>

            {/* Activity list */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: 18,
              overflow: 'hidden',
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
              border: '1px solid #F1F5F9',
            }}>
              <div style={{ padding: '14px 18px 10px', fontSize: 12, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Recent Transactions
              </div>
              {recentActivity.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '13px 18px',
                    borderTop: i === 0 ? 'none' : '1px solid #F8FAFC',
                  }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: item.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon name="card" size={17} color={item.color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: 11.5, color: '#94A3B8', marginTop: 2 }}>{item.time}</div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: item.color, flexShrink: 0 }}>
                    {item.amount}
                  </div>
                </div>
              ))}
            </div>

            {/* View all link */}
            <button
              onClick={() => navigate('/activity')}
              style={{
                width: '100%', padding: '13px',
                borderRadius: 14,
                background: '#F8FAFC',
                color: '#2563EB',
                border: '1px solid #E2E8F0',
                fontSize: 13.5, fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              View Full Activity History
            </button>
          </div>
        )}

      </div>
    </>
  );
}
