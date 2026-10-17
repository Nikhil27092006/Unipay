import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppHeader } from '../components/AppHeader';
import { CURRENT_USER } from '../data/mockData';

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
    case 'qr':        return (
      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="5.5" y="5.5" width="2" height="2" fill={color} />
        <rect x="16.5" y="5.5" width="2" height="2" fill={color} />
        <rect x="5.5" y="16.5" width="2" height="2" fill={color} />
        <path d="M14 14h3v3h-3zM18 18h3v3h-3zM14 19h2v2h-2zM19 14h2v2h-2z" fill={color} stroke="none" />
      </svg>
    );
    case 'share':     return (
      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3"/>
        <circle cx="6" cy="12" r="3"/>
        <circle cx="18" cy="19" r="3"/>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
      </svg>
    );
    case 'download':  return (
      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
    );
    case 'edit':      return (
      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    );
    default:          return null;
  }
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

// ── Main Profile Page ───────────────────────────────────────────
export function Profile() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [copied, setCopied] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [shareToast, setShareToast] = useState('');
  const qrSvgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (searchParams.get('qr') === 'true' || searchParams.get('showQR') === 'true') {
      setShowQRModal(true);
    }
  }, [searchParams]);

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(CURRENT_USER.upiId).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareQR = async () => {
    const upiLink = `upi://pay?pa=${CURRENT_USER.upiId}&pn=${encodeURIComponent(CURRENT_USER.fullName)}&cu=INR`;
    const shareData = {
      title: `Pay ${CURRENT_USER.fullName}`,
      text: `Pay ${CURRENT_USER.fullName} via UPI ID: ${CURRENT_USER.upiId}`,
      url: upiLink,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // Fallback to clipboard if user dismissed or error
      }
    }

    navigator.clipboard.writeText(upiLink).catch(() => {});
    setShareToast('✓ UPI payment link copied to clipboard!');
    setTimeout(() => setShareToast(''), 2500);
  };

  const handleDownloadQR = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 760;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background card
    ctx.fillStyle = '#FFFFFF';
    ctx.roundRect ? ctx.roundRect(0, 0, 600, 760, 32) : ctx.rect(0, 0, 600, 760);
    ctx.fill();

    // Top Brand Header
    ctx.fillStyle = '#2563EB';
    ctx.font = 'bold 26px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('CoWallet UPI', 300, 65);

    // Name & Subtitle
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText(CURRENT_USER.fullName, 300, 120);

    ctx.fillStyle = '#64748B';
    ctx.font = '500 18px sans-serif';
    ctx.fillText(`UPI ID: ${CURRENT_USER.upiId}`, 300, 155);

    // Draw QR placeholder frame
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(80, 190, 440, 440);
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 3;
    ctx.strokeRect(80, 190, 440, 440);

    // Draw SVG image on canvas if available
    if (qrSvgRef.current) {
      const svgData = new XMLSerializer().serializeToString(qrSvgRef.current);
      const img = new Image();
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
      img.onload = () => {
        ctx.drawImage(img, 100, 210, 400, 400);

        // Bottom text
        ctx.fillStyle = '#475569';
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Scan with any UPI App to Pay', 300, 690);

        const a = document.createElement('a');
        a.download = `${CURRENT_USER.name.toLowerCase()}-personal-qr.png`;
        a.href = canvas.toDataURL('image/png');
        a.click();
      };
    } else {
      ctx.fillStyle = '#475569';
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Scan with any UPI App to Pay', 300, 690);

      const a = document.createElement('a');
      a.download = `${CURRENT_USER.name.toLowerCase()}-personal-qr.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
    }

    setShareToast('✓ QR Code saved to Downloads!');
    setTimeout(() => setShareToast(''), 2500);
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
        { iconName: 'bell', iconBg: '#EFF6FF', iconColor: '#2563EB', label: 'Notifications', sub: 'Alerts, approvals, activity', route: '/notifications' },
        { iconName: 'lock', iconBg: '#FEF2F2', iconColor: '#DC2626', label: 'Security & Privacy', sub: 'PIN, biometrics, sessions', route: '/profile/security' },
      ],
    },
    {
      title: 'More',
      items: [
        { iconName: 'help', iconBg: '#F8FAFC', iconColor: '#64748B', label: 'Help & Support', sub: 'FAQs, raise a ticket', route: '/profile/help' },
        { iconName: 'zap', iconBg: '#F0F9FF', iconColor: '#0284C7', label: 'Replay Intro Animation', sub: 'Re-experience CoWallet splash', route: '#replay' },
      ],
    },
    {
      title: 'Legal',
      items: [
        { iconName: 'shield', iconBg: '#F8FAFC', iconColor: '#475569', label: 'Terms & Conditions', sub: 'User agreement and usage rules', route: '/terms' },
        { iconName: 'lock', iconBg: '#F8FAFC', iconColor: '#475569', label: 'Privacy Policy', sub: 'How we collect and use your data', route: '/privacy' },
      ],
    },
  ];

  return (
    <>
      <AppHeader />
      <div className="page-content" style={{ paddingTop: 0 }}>

        {/* ── Simplified & Clean Profile Header ─────────────────────────────── */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: 24,
          padding: '20px 18px',
          border: '1.5px solid rgba(255, 255, 255, 0.95)',
          boxShadow: '0 4px 20px rgba(15, 23, 42, 0.05)',
          marginBottom: 16,
          marginTop: 10,
        }}>
          {/* Main Info Row: Avatar + User Info (left) & Actions (right) */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 12,
          }}>
            {/* Left: Avatar + Identity */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0, flex: 1 }}>
              {/* Clean Monogram Avatar */}
              <div
                onClick={() => navigate('/profile/details')}
                style={{
                  position: 'relative',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
                title="Edit profile details"
              >
                <div style={{
                  width: 58,
                  height: 58,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                  fontWeight: 800,
                  color: '#FFFFFF',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)',
                }}>
                  {CURRENT_USER.fullName.charAt(0)}
                </div>
              </div>

              {/* Text Info */}
              <div style={{ minWidth: 0, flex: 1 }}>
                {/* Line 1: Full Name */}
                <div style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: '#0F172A',
                  letterSpacing: '-0.3px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  lineHeight: 1.25,
                }}>
                  {CURRENT_USER.fullName}
                </div>

                {/* Line 2: Phone number */}
                <div style={{
                  fontSize: 13,
                  color: '#64748B',
                  fontWeight: 500,
                  marginTop: 3,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  letterSpacing: '0.2px',
                }}>
                  {CURRENT_USER.phone}
                </div>

                {/* Line 3: Verified badge */}
                <div style={{ marginTop: 5, display: 'flex' }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 3.5,
                    background: '#DCFCE7',
                    color: '#15803D',
                    fontSize: 10.5,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 8,
                    whiteSpace: 'nowrap',
                  }}>
                    <Icon name="check" size={10} color="#15803D" />
                    Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Actions Column (QR Code + Edit) */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: 8,
              flexShrink: 0,
            }}>
              {/* Primary: QR Code Button */}
              <button
                onClick={() => setShowQRModal(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: '#EFF6FF',
                  border: '1.5px solid #BFDBFE',
                  borderRadius: 12,
                  padding: '7px 12px',
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: '#2563EB',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(37,99,235,0.08)',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
                title="View & Share Personal QR"
              >
                <Icon name="qr" size={15} color="#2563EB" />
                <span>QR Code</span>
              </button>

              {/* Secondary: Edit Profile Button */}
              <button
                onClick={() => navigate('/profile/details')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: 10,
                  padding: '5px 10px',
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: '#475569',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'background 0.15s ease',
                }}
              >
                <Icon name="edit" size={11} color="#64748B" />
                <span>Edit</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Account Section Onwards ─────────────────────────── */}
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
                      if (item.route === '#qr') {
                        setShowQRModal(true);
                        return;
                      }
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

          {/* Legal Footer */}
          <div style={{ textAlign: 'center', marginTop: 6, paddingBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginBottom: 6 }}>
              <button
                onClick={() => navigate('/terms')}
                style={{ background: 'none', border: 'none', fontSize: 12, color: '#2563EB', cursor: 'pointer', fontWeight: 600, padding: 0 }}
              >
                Terms &amp; Conditions
              </button>
              <span style={{ color: '#CBD5E1', fontSize: 12 }}>·</span>
              <button
                onClick={() => navigate('/privacy')}
                style={{ background: 'none', border: 'none', fontSize: 12, color: '#2563EB', cursor: 'pointer', fontWeight: 600, padding: 0 }}
              >
                Privacy Policy
              </button>
            </div>
            <div style={{ fontSize: 11.5, color: '#CBD5E1', fontWeight: 500 }}>CoWallet v1.0.0 · Made with care in India</div>
          </div>
        </div>

        {/* ── Google Pay Personal QR Modal ──────────────────────── */}
        {showQRModal && (
          <div
            onClick={() => setShowQRModal(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.55)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              animation: 'fadeIn 0.2s ease',
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: 390,
                background: '#FFFFFF',
                borderRadius: 28,
                padding: '24px 22px',
                boxShadow: '0 25px 60px rgba(15, 23, 42, 0.28)',
                position: 'relative',
                animation: 'hubSheetSpring 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                textAlign: 'center',
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowQRModal(false)}
                style={{
                  position: 'absolute',
                  top: 18,
                  right: 18,
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: '#F1F5F9',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  color: '#64748B',
                }}
              >
                ✕
              </button>

              {/* Profile Card Header */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 16 }}>
                <div style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 26,
                  fontWeight: 800,
                  color: '#FFFFFF',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
                  marginBottom: 10,
                  border: '3px solid #FFFFFF',
                }}>
                  {CURRENT_USER.fullName.charAt(0)}
                </div>

                <div style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.3px' }}>
                  {CURRENT_USER.fullName}
                </div>
                <div style={{ fontSize: 12.5, color: '#64748B', marginTop: 2, fontWeight: 500 }}>
                  Banking Name: Mrunali Patil • {CURRENT_USER.phone}
                </div>
              </div>

              {/* QR Code Container */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: 22,
                padding: '16px',
                border: '2px solid #E2E8F0',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                display: 'inline-block',
                position: 'relative',
              }}>
                <svg
                  ref={qrSvgRef}
                  width="200"
                  height="200"
                  viewBox="0 0 120 120"
                  fill="none"
                  style={{ display: 'block', margin: '0 auto' }}
                >
                  {/* Outer Background */}
                  <rect width="120" height="120" fill="#FFFFFF" />

                  {/* 3 Top & Bottom-Left Finder Patterns (Google Pay Style) */}
                  {/* Top-Left */}
                  <rect x="8" y="8" width="32" height="32" rx="6" stroke="#0F172A" strokeWidth="6" />
                  <rect x="18" y="18" width="12" height="12" rx="3" fill="#2563EB" />

                  {/* Top-Right */}
                  <rect x="80" y="8" width="32" height="32" rx="6" stroke="#0F172A" strokeWidth="6" />
                  <rect x="90" y="18" width="12" height="12" rx="3" fill="#2563EB" />

                  {/* Bottom-Left */}
                  <rect x="8" y="80" width="32" height="32" rx="6" stroke="#0F172A" strokeWidth="6" />
                  <rect x="18" y="90" width="12" height="12" rx="3" fill="#2563EB" />

                  {/* Timing Patterns */}
                  <line x1="44" y1="12" x2="76" y2="12" stroke="#0F172A" strokeWidth="3" strokeDasharray="3 3" />
                  <line x1="12" y1="44" x2="12" y2="76" stroke="#0F172A" strokeWidth="3" strokeDasharray="3 3" />

                  {/* High Density QR Data Modules */}
                  <rect x="46" y="18" width="5" height="5" rx="1" fill="#0F172A" />
                  <rect x="58" y="18" width="5" height="5" rx="1" fill="#0F172A" />
                  <rect x="68" y="18" width="5" height="5" rx="1" fill="#0F172A" />

                  <rect x="46" y="28" width="5" height="5" rx="1" fill="#0F172A" />
                  <rect x="54" y="28" width="5" height="5" rx="1" fill="#0F172A" />
                  <rect x="68" y="28" width="5" height="5" rx="1" fill="#0F172A" />

                  <rect x="16" y="46" width="5" height="5" rx="1" fill="#0F172A" />
                  <rect x="28" y="46" width="5" height="5" rx="1" fill="#0F172A" />
                  <rect x="36" y="46" width="5" height="5" rx="1" fill="#0F172A" />

                  <rect x="16" y="56" width="5" height="5" rx="1" fill="#0F172A" />
                  <rect x="24" y="56" width="5" height="5" rx="1" fill="#0F172A" />
                  <rect x="36" y="56" width="5" height="5" rx="1" fill="#0F172A" />

                  <rect x="16" y="66" width="5" height="5" rx="1" fill="#0F172A" />
                  <rect x="28" y="66" width="5" height="5" rx="1" fill="#0F172A" />

                  <rect x="82" y="46" width="5" height="5" rx="1" fill="#0F172A" />
                  <rect x="92" y="46" width="5" height="5" rx="1" fill="#0F172A" />
                  <rect x="102" y="46" width="5" height="5" rx="1" fill="#0F172A" />

                  <rect x="82" y="56" width="5" height="5" rx="1" fill="#0F172A" />
                  <rect x="96" y="56" width="5" height="5" rx="1" fill="#0F172A" />

                  <rect x="82" y="66" width="5" height="5" rx="1" fill="#0F172A" />
                  <rect x="92" y="66" width="5" height="5" rx="1" fill="#0F172A" />
                  <rect x="102" y="66" width="5" height="5" rx="1" fill="#0F172A" />

                  <rect x="46" y="82" width="5" height="5" rx="1" fill="#0F172A" />
                  <rect x="56" y="82" width="5" height="5" rx="1" fill="#0F172A" />
                  <rect x="68" y="82" width="5" height="5" rx="1" fill="#0F172A" />

                  <rect x="46" y="92" width="5" height="5" rx="1" fill="#0F172A" />
                  <rect x="62" y="92" width="5" height="5" rx="1" fill="#0F172A" />
                  <rect x="72" y="92" width="5" height="5" rx="1" fill="#0F172A" />

                  <rect x="52" y="102" width="5" height="5" rx="1" fill="#0F172A" />
                  <rect x="68" y="102" width="5" height="5" rx="1" fill="#0F172A" />
                  <rect x="82" y="102" width="5" height="5" rx="1" fill="#0F172A" />
                  <rect x="96" y="102" width="5" height="5" rx="1" fill="#0F172A" />

                  {/* Alignment pattern bottom right */}
                  <rect x="84" y="84" width="16" height="16" rx="3" stroke="#0F172A" strokeWidth="4" />
                  <rect x="89" y="89" width="6" height="6" rx="1.5" fill="#2563EB" />

                  {/* Center Brand Badge (Google Pay Style UPI icon) */}
                  <rect x="46" y="46" width="28" height="28" rx="8" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
                  <circle cx="60" cy="60" r="10" fill="#2563EB" />
                  <text x="60" y="64.5" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">₹</text>
                </svg>
              </div>

              {/* UPI ID Pill */}
              <div style={{
                marginTop: 14,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: 20,
                padding: '6px 14px',
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#1E293B', fontFamily: 'monospace' }}>
                  {CURRENT_USER.upiId}
                </span>
                <button
                  onClick={handleCopyUPI}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#2563EB',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>

              {/* Supported apps */}
              <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 10, fontWeight: 500 }}>
                Scan to pay with any UPI app
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 6 }}>
                {['Google Pay', 'PhonePe', 'Paytm', 'BHIM'].map(app => (
                  <span
                    key={app}
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: '#475569',
                      background: '#F1F5F9',
                      padding: '3px 8px',
                      borderRadius: 12,
                    }}
                  >
                    {app}
                  </span>
                ))}
              </div>

              {/* Toast feedback */}
              {shareToast && (
                <div style={{
                  marginTop: 12,
                  background: '#DCFCE7',
                  color: '#16A34A',
                  padding: '7px 12px',
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 700,
                }}>
                  {shareToast}
                </div>
              )}

              {/* Action Buttons: Share & Download */}
              <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
                <button
                  onClick={handleShareQR}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '13px',
                    borderRadius: 14,
                    background: '#2563EB',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: 13.5,
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.28)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Icon name="share" size={17} color="#FFFFFF" />
                  <span>Share QR</span>
                </button>

                <button
                  onClick={handleDownloadQR}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '13px',
                    borderRadius: 14,
                    background: '#F1F5F9',
                    color: '#1E293B',
                    border: '1px solid #E2E8F0',
                    fontSize: 13.5,
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Icon name="download" size={17} color="#1E293B" />
                  <span>Save QR</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
