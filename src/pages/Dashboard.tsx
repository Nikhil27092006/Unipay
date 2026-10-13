import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../components/AppHeader';
import {
  CURRENT_USER, MOCK_GROUPS, MOCK_RECENT_ACTIVITY, MOCK_PERSONAL_PAYMENTS,
  formatINR, pct, type Group, type Transaction, type PersonalPayment
} from '../data/mockData';
import { EmojiBadge } from '../components/EmojiBadge';
import { AddMoneyModal } from '../components/AddMoneyModal';

export function Dashboard() {
  const navigate = useNavigate();
  const [showRewardsModal, setShowRewardsModal] = useState(false);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Personal UPI Live Balance State
  const [personalBalance, setPersonalBalance] = useState(CURRENT_USER.personalBalance);
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);
  const [isFetchingBalance, setIsFetchingBalance] = useState(false);
  const [balanceLastFetched, setBalanceLastFetched] = useState<string | null>('Today, 1:05 PM');
  const [fetchSuccessAnim, setFetchSuccessAnim] = useState(false);

  const handleFetchBalance = () => {
    setShowBalanceModal(true);
    setIsFetchingBalance(true);
    setTimeout(() => {
      setIsFetchingBalance(false);
      setPersonalBalance(3250);
      const now = new Date();
      setBalanceLastFetched(`Just now, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
      setFetchSuccessAnim(true);
      setTimeout(() => setFetchSuccessAnim(false), 2400);
    }, 750);
  };

  const [isLaunchingSend, setIsLaunchingSend] = useState(false);
  const [sendLaunchCount, setSendLaunchCount] = useState(0);
  const [groupTab, setGroupTab] = useState<'active' | 'closed'>('active');

  const activeGroups = MOCK_GROUPS.filter(g => g.status === 'active');
  const closedGroups = MOCK_GROUPS.filter(g => g.status === 'terminated' || (g.status as string) === 'closed' || (g.status as string) === 'suspended');
  const displayedGroups = groupTab === 'active' ? activeGroups : closedGroups;

  const handleOpenPaymentHub = () => {
    if (isLaunchingSend) return;
    setIsLaunchingSend(true);
    setSendLaunchCount(prev => prev + 1);

    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('cowallet-open-payment-modal'));
    }, 500);

    setTimeout(() => {
      setIsLaunchingSend(false);
    }, 850);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://cowallet.app/join/NIKHIL50');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2400);
  };

  return (
    <>
      {/* Sticky Header */}
      <AppHeader />

      <div className="page-content" style={{ paddingTop: 4, paddingBottom: 16 }}>

        {/* ── Greeting ── */}
        <div style={{ marginBottom: 18 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111827', lineHeight: 1.2, display: 'flex', alignItems: 'center', gap: 6 }}>
            Hey, {CURRENT_USER.name} <EmojiBadge name="wave" size="inline" />
          </h1>
          <p style={{ fontSize: 13, color: '#6B7280', marginTop: 3, fontWeight: 500 }}>
            Personal UPI + Shared Group Vaults in one seamless place.
          </p>
        </div>
        {/* ── Your Groups ── */}
        <section style={{ marginBottom: 20 }}>
          <div className="section-header" style={{ marginBottom: 10 }}>
            <h2 className="section-title">Your Groups</h2>
            <button className="section-link" onClick={() => navigate('/groups')}>See all</button>
          </div>

          {/* Bar-like Segmented Switcher (Active Groups vs Closed Groups) */}
          <div style={{
            display: 'flex',
            background: 'rgba(241, 245, 249, 0.9)',
            border: '1px solid #E2E8F0',
            borderRadius: 14,
            padding: 3,
            marginBottom: 12,
            gap: 4,
          }}>
            <button
              type="button"
              onClick={() => setGroupTab('active')}
              style={{
                flex: 1,
                padding: '8px 14px',
                borderRadius: 11,
                border: 'none',
                background: groupTab === 'active' ? '#FFFFFF' : 'transparent',
                color: groupTab === 'active' ? '#1D4ED8' : '#64748B',
                fontWeight: groupTab === 'active' ? 700 : 600,
                fontSize: 12.5,
                cursor: 'pointer',
                boxShadow: groupTab === 'active' ? '0 2px 8px rgba(37, 99, 235, 0.12)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                transition: 'all 0.18s ease',
              }}
            >
              <span>Active Groups</span>
              <span style={{
                fontSize: 11,
                fontWeight: 700,
                padding: '1px 7px',
                borderRadius: 99,
                background: groupTab === 'active' ? '#EFF6FF' : '#E2E8F0',
                color: groupTab === 'active' ? '#2563EB' : '#64748B',
              }}>
                {activeGroups.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setGroupTab('closed')}
              style={{
                flex: 1,
                padding: '8px 14px',
                borderRadius: 11,
                border: 'none',
                background: groupTab === 'closed' ? '#FFFFFF' : 'transparent',
                color: groupTab === 'closed' ? '#1D4ED8' : '#64748B',
                fontWeight: groupTab === 'closed' ? 700 : 600,
                fontSize: 12.5,
                cursor: 'pointer',
                boxShadow: groupTab === 'closed' ? '0 2px 8px rgba(37, 99, 235, 0.12)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                transition: 'all 0.18s ease',
              }}
            >
              <span>Closed Groups</span>
              <span style={{
                fontSize: 11,
                fontWeight: 700,
                padding: '1px 7px',
                borderRadius: 99,
                background: groupTab === 'closed' ? '#EFF6FF' : '#E2E8F0',
                color: groupTab === 'closed' ? '#2563EB' : '#64748B',
              }}>
                {closedGroups.length}
              </span>
            </button>
          </div>

          {/* Group Wallets List for selected tab */}
          <div style={{
            position: 'relative',
            marginLeft: -16,
            marginRight: -16,
            padding: '2px 0 10px',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              gap: 14,
              overflowX: 'auto',
              padding: '8px 16px 14px',
              scrollbarWidth: 'none',
            }}>
              {displayedGroups.length === 0 ? (
                <div style={{ padding: '24px 16px', color: '#94A3B8', fontSize: 13, fontWeight: 500 }}>
                  No {groupTab === 'active' ? 'active' : 'closed'} groups found.
                </div>
              ) : (
                displayedGroups.map(group => (
                  <WalletGroupCard key={group.id} group={group} onClick={() => navigate(`/groups/${group.id}`)} />
                ))
              )}
            </div>
          </div>
        </section>

        {/* ── Quick Actions (App White & Blue Theme: Pay, Add Money, Create, Scan, Join) ── */}
        <div className="feature-actions-bar">
          {/* 1. Send (App Primary Light / Blue Accent Squircle with Launch Animation) */}
          <div style={{ position: 'relative', display: 'inline-flex' }}>
            {/* Neon Shockwave Ring on Launch */}
            {isLaunchingSend && (
              <div
                key={`dash-shock-${sendLaunchCount}`}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  border: '2px solid #38BDF8',
                  pointerEvents: 'none',
                  zIndex: 99990,
                  animation: 'planeShockwave 0.55s cubic-bezier(0.1, 0.8, 0.3, 1) forwards',
                  boxShadow: '0 0 24px rgba(56, 189, 248, 0.8)',
                }}
              />
            )}

            {/* Confetti Particles Exploding Outward */}
            {isLaunchingSend && (
              <>
                <div style={{ position: 'absolute', left: '50%', top: '50%', width: 7, height: 7, borderRadius: '50%', background: '#2563EB', pointerEvents: 'none', zIndex: 99998, boxShadow: '0 0 8px #2563EB', animation: 'planeConfetti 0.65s cubic-bezier(0.15, 0.85, 0.35, 1) forwards', '--tx': '-38px', '--ty': '-65px', '--rot': '45deg' } as React.CSSProperties} />
                <div style={{ position: 'absolute', left: '50%', top: '50%', width: 6, height: 6, borderRadius: '2px', background: '#38BDF8', pointerEvents: 'none', zIndex: 99998, boxShadow: '0 0 8px #38BDF8', animation: 'planeConfetti 0.65s cubic-bezier(0.15, 0.85, 0.35, 1) 20ms forwards', '--tx': '45px', '--ty': '-70px', '--rot': '-35deg' } as React.CSSProperties} />
                <div style={{ position: 'absolute', left: '50%', top: '50%', width: 8, height: 8, borderRadius: '50%', background: '#6366F1', pointerEvents: 'none', zIndex: 99998, boxShadow: '0 0 8px #6366F1', animation: 'planeConfetti 0.65s cubic-bezier(0.15, 0.85, 0.35, 1) 10ms forwards', '--tx': '-68px', '--ty': '-38px', '--rot': '90deg' } as React.CSSProperties} />
                <div style={{ position: 'absolute', left: '50%', top: '50%', width: 7, height: 7, borderRadius: '50%', background: '#10B981', pointerEvents: 'none', zIndex: 99998, boxShadow: '0 0 8px #10B981', animation: 'planeConfetti 0.65s cubic-bezier(0.15, 0.85, 0.35, 1) 30ms forwards', '--tx': '70px', '--ty': '-40px', '--rot': '-60deg' } as React.CSSProperties} />
                <div style={{ position: 'absolute', left: '50%', top: '50%', width: 6, height: 6, borderRadius: '50%', background: '#F59E0B', pointerEvents: 'none', zIndex: 99998, boxShadow: '0 0 8px #F59E0B', animation: 'planeConfetti 0.65s cubic-bezier(0.15, 0.85, 0.35, 1) 15ms forwards', '--tx': '-20px', '--ty': '-90px', '--rot': '120deg' } as React.CSSProperties} />
                <div style={{ position: 'absolute', left: '50%', top: '50%', width: 8, height: 8, borderRadius: '2px', background: '#2563EB', pointerEvents: 'none', zIndex: 99998, boxShadow: '0 0 8px #2563EB', animation: 'planeConfetti 0.65s cubic-bezier(0.15, 0.85, 0.35, 1) 25ms forwards', '--tx': '25px', '--ty': '-95px', '--rot': '-90deg' } as React.CSSProperties} />
                <div style={{ position: 'absolute', left: '50%', top: '50%', width: 6, height: 6, borderRadius: '50%', background: '#00D2FF', pointerEvents: 'none', zIndex: 99998, boxShadow: '0 0 8px #00D2FF', animation: 'planeConfetti 0.65s cubic-bezier(0.15, 0.85, 0.35, 1) 35ms forwards', '--tx': '-55px', '--ty': '-80px', '--rot': '180deg' } as React.CSSProperties} />
                <div style={{ position: 'absolute', left: '50%', top: '50%', width: 7, height: 7, borderRadius: '50%', background: '#EC4899', pointerEvents: 'none', zIndex: 99998, boxShadow: '0 0 8px #EC4899', animation: 'planeConfetti 0.65s cubic-bezier(0.15, 0.85, 0.35, 1) 10ms forwards', '--tx': '60px', '--ty': '-85px', '--rot': '-140deg' } as React.CSSProperties} />
              </>
            )}

            {/* Flying Paper Plane Shooting Across Screen */}
            {isLaunchingSend && (
              <div
                key={`dash-flight-${sendLaunchCount}`}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
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

            <button
              className="feature-action-btn feature-action-btn--pay"
              onClick={handleOpenPaymentHub}
              aria-label="Send"
              style={{
                position: 'relative',
                animation: isLaunchingSend ? 'planeNavRumble 0.35s ease-in-out, planeNavGlow 0.85s ease-out' : 'none',
              }}
            >
              <div className="feature-btn-icon">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    transform: isLaunchingSend
                      ? 'translate(1px, -1px) scale(0.6) rotate(-20deg)'
                      : 'translate(1px, -1px)',
                    opacity: isLaunchingSend ? 0.3 : 1,
                    transition: 'transform 0.2s ease, opacity 0.2s ease',
                  }}
                >
                  <path d="M22 2L11 13" />
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                </svg>
              </div>
              <span className="feature-btn-label">Send</span>
            </button>
          </div>

          {/* 2. Add Money (White Squircle) */}
          <button
            className="feature-action-btn feature-action-btn--dark"
            onClick={() => setShowAddMoneyModal(true)}
            aria-label="Add Money"
          >
            <div className="feature-btn-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
            <span className="feature-btn-label">Add Money</span>
          </button>

          {/* 3. Create (White Squircle) */}
          <button
            className="feature-action-btn feature-action-btn--dark"
            onClick={() => navigate('/create-group')}
            aria-label="Create Group"
          >
            <div className="feature-btn-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 00-3-3.87" />
                <path d="M16 3.13a4 4 0 010 7.75" />
              </svg>
            </div>
            <span className="feature-btn-label">Create</span>
          </button>

          {/* 4. Scan (White Squircle) */}
          <button
            className="feature-action-btn feature-action-btn--dark"
            onClick={() => navigate('/scan')}
            aria-label="Scan QR"
          >
            <div className="feature-btn-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                <circle cx="17.5" cy="17.5" r="1.5" fill="currentColor" />
                <path d="M14 14h.01M14 21h.01M21 14h.01" strokeWidth="2.5" />
              </svg>
            </div>
            <span className="feature-btn-label">Scan</span>
          </button>

          {/* 5. Join (White Squircle) */}
          <button
            className="feature-action-btn feature-action-btn--dark"
            onClick={() => navigate('/join-group')}
            aria-label="Join Group"
          >
            <div className="feature-btn-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="8" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="16" y1="11" x2="22" y2="11" />
              </svg>
            </div>
            <span className="feature-btn-label">Join</span>
          </button>
        </div>

        {/* ── Recent Group Activity ── */}
        <section style={{ marginBottom: 24 }}>
          <div className="section-header">
            <h2 className="section-title">Recent Group Activity</h2>
            <button className="section-link" onClick={() => navigate('/activity')}>See all</button>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.82)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            borderRadius: 20,
            overflow: 'hidden',
            boxShadow: '0 8px 30px rgba(15, 23, 42, 0.05), 0 1px 3px rgba(0, 0, 0, 0.02)',
            border: '1.5px solid rgba(255, 255, 255, 0.9)',
          }}>
            {MOCK_RECENT_ACTIVITY.slice(0, 3).map((tx, idx) => (
              <ActivityRow key={tx.id} tx={tx} isLast={idx === 2} />
            ))}
          </div>
        </section>

        {/* ── Rewards Area ── */}
        <section style={{ marginBottom: 24 }}>
          <div className="section-header">
            <h2 className="section-title">Rewards</h2>
            <button className="section-link" onClick={() => setShowRewardsModal(true)}>View all</button>
          </div>

          {/* Frosted Translucent Reward Card matching the reference image */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(224, 242, 254, 0.65) 0%, rgba(255, 255, 255, 0.8) 45%, rgba(239, 246, 255, 0.65) 100%)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: 22,
            border: '1.5px solid rgba(255, 255, 255, 0.9)',
            boxShadow: '0 10px 28px rgba(186, 230, 253, 0.35), 0 2px 8px rgba(0, 0, 0, 0.03)',
            padding: '18px 16px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Top Row: 3D Gift Box Badge + Title & Subtitle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <div style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #E0F2FE 0%, #EFF6FF 100%)',
                border: '1.5px solid rgba(255, 255, 255, 0.95)',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.16)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
                  <defs>
                    <linearGradient id="giftBodyBlue1" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#1D4ED8" />
                    </linearGradient>
                    <linearGradient id="giftBodyBlue2" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#60A5FA" />
                      <stop offset="100%" stopColor="#0284C7" />
                    </linearGradient>
                    <linearGradient id="giftRibbonBlue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#DBEAFE" />
                      <stop offset="50%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#1D4ED8" />
                    </linearGradient>
                  </defs>

                  {/* Sparkles */}
                  <path d="M7 6L7.8 8.5L10.3 9.3L7.8 10.1L7 12.6L6.2 10.1L3.7 9.3L6.2 8.5L7 6Z" fill="#38BDF8" opacity="0.9" />
                  <circle cx="18" cy="4" r="1.5" fill="#3B82F6" opacity="0.95" />
                  <path d="M29 7L29.6 9L31.6 9.6L29.6 10.2L29 12.2L28.4 10.2L26.4 9.6L28.4 9L29 7Z" fill="#60A5FA" opacity="0.9" />

                  {/* Box Body */}
                  <path d="M8 17H17V27C17 28.1 16.1 29 15 29H10C8.9 29 8 28.1 8 27V17Z" fill="url(#giftBodyBlue1)" />
                  <path d="M19 17H28V27C28 28.1 27.1 29 26 29H21C19.9 29 19 28.1 19 27V17Z" fill="url(#giftBodyBlue2)" />

                  {/* Vertical Ribbon */}
                  <rect x="16.5" y="17" width="3" height="12" fill="url(#giftRibbonBlue)" />

                  {/* Box Lids */}
                  <path d="M6 14C6 13.4 6.4 13 7 13H17V17H6V14Z" fill="#60A5FA" />
                  <path d="M19 13H29C29.6 13 30 13.4 30 14V17H19V13Z" fill="#0EA5E9" />
                  <rect x="16.5" y="13" width="3" height="4" fill="url(#giftRibbonBlue)" />

                  {/* Ribbon Bow on top */}
                  <path d="M17 13C17 13 13.5 8.5 11 10C8.8 11.2 11 13 17 13Z" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="0.8" />
                  <path d="M19 13C19 13 22.5 8.5 25 10C27.2 11.2 25 13 19 13Z" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="0.8" />
                  <circle cx="18" cy="13" r="2.2" fill="#1D4ED8" />
                </svg>
              </div>

              <div>
                <div style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: '#0F172A',
                  letterSpacing: '-0.3px',
                  lineHeight: 1.25,
                  marginBottom: 3,
                }}>
                  Invite Friends & Earn
                </div>
                <div style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#475569',
                  letterSpacing: '-0.1px',
                }}>
                  Get ₹50 for every friend who joins
                </div>
              </div>
            </div>

            {/* Middle Row: 3 Stat Cards */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              {/* 1. Friends Invited */}
              <div style={{
                flex: 1,
                background: '#FFFFFF',
                borderRadius: 16,
                padding: '12px 6px',
                textAlign: 'center',
                boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.9), 0 4px 14px rgba(148, 163, 184, 0.12)',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 84,
              }}>
                <div style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: '#1E3A8A',
                  letterSpacing: '-0.5px',
                  lineHeight: 1.15,
                  marginBottom: 4,
                }}>
                  8
                </div>
                <div style={{
                  fontSize: 11.5,
                  fontWeight: 500,
                  color: '#64748B',
                  lineHeight: 1.25,
                }}>
                  <div>Friends</div>
                  <div>Invited</div>
                </div>
              </div>

              {/* 2. Joined */}
              <div style={{
                flex: 1,
                background: '#FFFFFF',
                borderRadius: 16,
                padding: '12px 6px',
                textAlign: 'center',
                boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.9), 0 4px 14px rgba(148, 163, 184, 0.12)',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 84,
              }}>
                <div style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: '#1E3A8A',
                  letterSpacing: '-0.5px',
                  lineHeight: 1.15,
                  marginBottom: 4,
                }}>
                  5
                </div>
                <div style={{
                  fontSize: 11.5,
                  fontWeight: 500,
                  color: '#64748B',
                  lineHeight: 1.25,
                }}>
                  Joined
                </div>
              </div>

              {/* 3. Earned */}
              <div style={{
                flex: 1,
                background: '#FFFFFF',
                borderRadius: 16,
                padding: '12px 6px',
                textAlign: 'center',
                boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.9), 0 4px 14px rgba(148, 163, 184, 0.12)',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 84,
              }}>
                <div style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: '#1E3A8A',
                  letterSpacing: '-0.5px',
                  lineHeight: 1.15,
                  marginBottom: 4,
                }}>
                  ₹250
                </div>
                <div style={{
                  fontSize: 11.5,
                  fontWeight: 500,
                  color: '#64748B',
                  lineHeight: 1.25,
                }}>
                  Earned
                </div>
              </div>
            </div>

            {/* Bottom: Copy Referral Link Button */}
            <button
              onClick={handleCopyLink}
              style={{
                width: '100%',
                padding: '13px 18px',
                background: copiedLink
                  ? 'linear-gradient(135deg, #059669 0%, #10B981 100%)'
                  : 'linear-gradient(135deg, #1D4ED8 0%, #2563EB 100%)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 14,
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: '-0.1px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: copiedLink
                  ? '0 4px 16px rgba(16, 185, 129, 0.35)'
                  : '0 4px 16px rgba(37, 99, 235, 0.35)',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.98)')}
              onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              {copiedLink ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                  <span>Copy Referral Link</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* ── Payment History (Separated: Personal UPI & Group Vaults) ── */}
        <PaymentHistorySections
          payments={MOCK_PERSONAL_PAYMENTS}
          onSeeAll={() => navigate('/activity')}
          onOpenGroup={(groupId) => navigate(`/groups/${groupId}`)}
        />

        {/* ── Offers ── */}
        <section style={{ marginBottom: 8 }}>
          <div className="section-header">
            <h2 className="section-title">Offers For You</h2>
            <button className="section-link">See all</button>
          </div>
          <div style={{
            display: 'flex',
            gap: 12,
            overflowX: 'auto',
            marginLeft: -16,
            marginRight: -16,
            paddingLeft: 16,
            paddingRight: 16,
            paddingBottom: 4,
            scrollbarWidth: 'none',
          }}>
            {MOCK_OFFERS.map(offer => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </section>

        {/* ── Personal UPI Balance Checker ── */}
        <section style={{ marginBottom: 16 }}>
          <button
            onClick={handleFetchBalance}
            style={{
              width: '100%',
              background: '#FFFFFF',
              borderRadius: 20,
              padding: '16px 20px',
              border: '1px solid #E5E7EB',
              boxShadow: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 14,
                background: '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'none',
                flexShrink: 0,
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="3"/>
                  <line x1="2" y1="10" x2="22" y2="10"/>
                  <circle cx="7" cy="15" r="1.5" fill="white" stroke="none"/>
                </svg>
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#111827' }}>Check UPI Balance</div>
                <div style={{ fontSize: 12, color: '#6B7280', fontWeight: 500, marginTop: 1 }}>Tap to fetch from NPCI switch</div>
              </div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.4" strokeLinecap="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </section>

      </div>

      {/* ── Balance Sheet Modal ── */}
      {showBalanceModal && (
        <div className="modal-overlay" onClick={() => setShowBalanceModal(false)}>
          <div
            className="modal-sheet"
            onClick={e => e.stopPropagation()}
            style={{ paddingBottom: 32 }}
          >
            <div className="modal-handle" />

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#111827', margin: 0 }}>UPI Balance</h2>
                <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>Linked to your personal UPI ID</div>
              </div>
              <button
                onClick={() => setShowBalanceModal(false)}
                style={{ background: '#F3F4F6', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: '#4B5563' }}
              >
                ✕
              </button>
            </div>

            {/* Balance Card */}
            <div style={{
              background: 'rgba(239, 246, 255, 0.85)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1.5px solid rgba(191, 219, 254, 0.9)',
              borderRadius: 20,
              padding: '20px',
              marginBottom: 16,
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37, 99, 235, 0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

              {/* Bank Row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 11, background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 11, boxShadow: '0 3px 8px rgba(37, 99, 235, 0.28)' }}>
                  HDFC
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#111827' }}>HDFC Bank •••• 4921</div>
                  <div style={{ fontSize: 11, color: '#2563EB', fontWeight: 700 }}>{CURRENT_USER.upiId}</div>
                </div>
                <div style={{ marginLeft: 'auto', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 8, padding: '3px 8px', fontSize: 10.5, fontWeight: 800, color: '#2563EB' }}>
                  NPCI Verified
                </div>
              </div>

              {/* Balance Display */}
              {isFetchingBalance ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" style={{ animation: 'spin 0.8s linear infinite' }}>
                    <path d="M23 4v6h-6M1 20v-6h6"/>
                    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
                  </svg>
                  <span style={{ fontSize: 14, color: '#2563EB', fontWeight: 700 }}>Fetching from NPCI switch...</span>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ fontSize: 32, fontWeight: 800, color: '#111827', letterSpacing: '-0.03em' }}>
                      {isBalanceHidden ? '₹ • • • • •' : formatINR(personalBalance)}
                    </div>
                    <button
                      onClick={() => setIsBalanceHidden(!isBalanceHidden)}
                      style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: 0, display: 'flex' }}
                    >
                      {isBalanceHidden
                        ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"/></svg>
                        : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      }
                    </button>
                  </div>
                  <div style={{ fontSize: 11, color: fetchSuccessAnim ? '#16A34A' : '#6B7280', marginTop: 6, fontWeight: 600 }}>
                    {fetchSuccessAnim ? '✓ Balance verified with NPCI Switch' : (balanceLastFetched ? `Last refreshed: ${balanceLastFetched}` : '')}
                  </div>
                </>
              )}
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleFetchBalance}
              disabled={isFetchingBalance}
              style={{
                width: '100%',
                padding: '13px',
                background: isFetchingBalance ? '#F1F5F9' : 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                color: isFetchingBalance ? '#6B7280' : '#FFFFFF',
                border: 'none',
                borderRadius: 14,
                fontSize: 14,
                fontWeight: 700,
                cursor: isFetchingBalance ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: isFetchingBalance ? 'none' : '0 4px 16px rgba(37, 99, 235, 0.3)',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" style={{ animation: isFetchingBalance ? 'spin 0.8s linear infinite' : 'none' }}>
                <path d="M23 4v6h-6M1 20v-6h6"/>
                <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
              </svg>
              {isFetchingBalance ? 'Checking...' : 'Refresh Balance'}
            </button>
          </div>
        </div>
      )}


      {/* ── All Rewards Modal Sheet ── */}
      {showRewardsModal && (
        <div className="modal-overlay" onClick={() => setShowRewardsModal(false)}>
          <div
            className="modal-sheet"
            onClick={e => e.stopPropagation()}
            style={{
              maxHeight: '85vh',
              overflowY: 'auto',
              paddingBottom: 28,
            }}
          >
            <div className="modal-handle" />

            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#111827', margin: 0 }}>
                  All Rewards & Cashback
                </h2>
                <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>
                  7 rewards unlocked this month
                </div>
              </div>
              <button
                onClick={() => setShowRewardsModal(false)}
                style={{
                  background: '#F3F4F6',
                  border: 'none',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: 16,
                  color: '#4B5563',
                }}
              >
                ✕
              </button>
            </div>

            {/* Total Earned Banner */}
            <div style={{
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              borderRadius: 16,
              padding: '16px',
              color: '#FFFFFF',
              marginBottom: 20,
              boxShadow: '0 4px 16px rgba(37,99,235,0.3)',
            }}>
              <div style={{ fontSize: 12, opacity: 0.85, fontWeight: 600 }}>Total Rewards Earned</div>
              <div style={{ fontSize: 26, fontWeight: 800, marginTop: 4 }}>
                ₹370 <span style={{ fontSize: 14, fontWeight: 600, opacity: 0.9 }}>+ 320 Points</span>
              </div>
              <div style={{ fontSize: 11, opacity: 0.8, marginTop: 4 }}>
                ₹120 credited directly to your bank account
              </div>
            </div>

            {/* Active / Featured Rewards */}
            <div style={{ fontSize: 11.5, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
              Featured Rewards
            </div>
            <div style={{ background: '#FFFFFF', borderRadius: 16, overflow: 'hidden', border: '1px solid #E5E7EB', marginBottom: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              {MOCK_REWARDS.map((r, idx) => (
                <RewardRow key={r.id} item={r} isLast={idx === MOCK_REWARDS.length - 1} />
              ))}
            </div>

            {/* Other Rewards */}
            <div style={{ fontSize: 11.5, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
              Other Rewards & Vouchers
            </div>
            <div style={{ background: '#FFFFFF', borderRadius: 16, overflow: 'hidden', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              {MOCK_OTHER_REWARDS.map((r, idx) => (
                <RewardRow key={r.id} item={r} isLast={idx === MOCK_OTHER_REWARDS.length - 1} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Add Money Modal ── */}
      <AddMoneyModal
        isOpen={showAddMoneyModal}
        onClose={() => setShowAddMoneyModal(false)}
        currentBalance={personalBalance}
        onSuccess={(addedAmount) => {
          setPersonalBalance(prev => prev + addedAmount);
          const now = new Date();
          setBalanceLastFetched(`Just now, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
          setFetchSuccessAnim(true);
          setTimeout(() => setFetchSuccessAnim(false), 2400);
        }}
      />
    </>
  );
}

function WalletGroupCard({ group, onClick }: { group: Group; onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const usedPct = pct(group.balance, group.cap);

  const MONO_COLORS = [
    'linear-gradient(135deg, #93C5FD, #60A5FA)',
    'linear-gradient(135deg, #C4B5FD, #A78BFA)',
    'linear-gradient(135deg, #6EE7B7, #34D399)',
    'linear-gradient(135deg, #A5B4FC, #818CF8)',
  ];

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        flexShrink: 0,
        width: 278,
        height: 162,
        position: 'relative',
        cursor: 'pointer',
        userSelect: 'none',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* ─── Wallet Body Shadow Depth Layer ─── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 3,
          left: 3,
          width: 248,
          height: 156,
          borderRadius: 26,
          background: '#0F172A',
          opacity: 0.35,
          filter: 'blur(4px)',
          zIndex: 1,
        }}
      />

      {/* ─── Main Wallet Body (holds and displays all group info) ─── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 254,
          height: 160,
          borderRadius: 26,
          background: `linear-gradient(145deg, ${group.themeColor || '#2563EB'} 0%, #1D4ED8 52%, #1E40AF 100%)`,
          boxShadow: isHovered
            ? '0 16px 36px rgba(30, 64, 175, 0.42), 0 4px 10px rgba(15, 23, 42, 0.18)'
            : '0 10px 24px rgba(30, 64, 175, 0.30), 0 2px 6px rgba(15, 23, 42, 0.12)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          overflow: 'hidden',
          zIndex: 2,
          transition: 'box-shadow 0.22s ease',
          padding: '13px 44px 13px 18px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
        }}
      >
        {/* Top Rim/Lip Sheen (wallet opening curve) */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 40,
            borderRadius: '25px 25px 16px 16px',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.03) 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.10)',
            pointerEvents: 'none',
          }}
        />

        {/* 1. Top Section: Label + Group Name */}
        <div style={{ position: 'relative', zIndex: 3 }}>
          <div style={{
            fontSize: 9.5,
            fontWeight: 700,
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
            color: '#BFDBFE',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#93C5FD', display: 'inline-block' }} />
            GROUP VAULT
          </div>
          <div style={{
            fontSize: 16.5,
            fontWeight: 800,
            color: '#FFFFFF',
            letterSpacing: '-0.3px',
            lineHeight: 1.2,
            marginTop: 2,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: 175,
          }}>
            {group.name}
          </div>
        </div>

        {/* 2. Middle Section: Balance + Cap + Progress Bar */}
        <div style={{ position: 'relative', zIndex: 3, marginTop: -2 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 20, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.5px' }}>
              {formatINR(group.balance)}
            </span>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(219, 234, 254, 0.82)' }}>
              / {formatINR(group.cap)} cap
            </span>
          </div>

          {/* Progress bar */}
          <div style={{
            height: 5,
            background: 'rgba(255, 255, 255, 0.20)',
            borderRadius: 99,
            overflow: 'hidden',
            marginTop: 7,
            maxWidth: 180,
          }}>
            <div style={{
              height: '100%',
              width: `${usedPct}%`,
              background: 'linear-gradient(90deg, #93C5FD 0%, #FFFFFF 100%)',
              borderRadius: 99,
              boxShadow: '0 0 6px rgba(255,255,255,0.6)',
            }} />
          </div>
        </div>

        {/* 3. Bottom Row: Member Avatars Pill + % Spent */}
        <div style={{
          position: 'relative',
          zIndex: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: 185,
        }}>
          {/* Member avatars badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            background: 'rgba(255, 255, 255, 0.14)',
            padding: '3px 8px 3px 5px',
            borderRadius: 99,
            backdropFilter: 'blur(6px)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {group.members.slice(0, 3).map((m, i) => (
                <div
                  key={m.id || i}
                  title={m.name}
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: MONO_COLORS[i % MONO_COLORS.length],
                    border: '1.5px solid rgba(255, 255, 255, 0.9)',
                    marginLeft: i === 0 ? 0 : -5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#1E3A8A',
                    fontSize: 8,
                    fontWeight: 900,
                    zIndex: 3 - i,
                  }}
                >
                  {m.name.charAt(0).toUpperCase()}
                </div>
              ))}
            </div>
            {group.members.length > 3 ? (
              <span style={{ fontSize: 9.5, fontWeight: 700, color: '#FFFFFF' }}>+{group.members.length - 3}</span>
            ) : (
              <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>{group.members.length} members</span>
            )}
          </div>

          {/* % used */}
          <div style={{
            fontSize: 11,
            fontWeight: 800,
            color: '#DBEAFE',
            background: 'rgba(255, 255, 255, 0.12)',
            padding: '2px 7px',
            borderRadius: 8,
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}>
            {usedPct}%
          </div>
        </div>
      </div>

      {/* ─── Right Clasp / Snap Strap (with white ring button) ─── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: 0,
          top: '50%',
          transform: isHovered ? 'translateY(-50%) scale(1.04)' : 'translateY(-50%) scale(1)',
          width: 48,
          height: 52,
          borderRadius: 16,
          background: 'linear-gradient(145deg, #60A5FA 0%, #3B82F6 100%)',
          boxShadow: '-3px 4px 14px rgba(15, 23, 42, 0.28), inset 0 1px 2px rgba(255, 255, 255, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 4,
          transition: 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* White ring snap button */}
        <div style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          border: '4.5px solid #FFFFFF',
          boxShadow: '0 2px 5px rgba(15, 23, 42, 0.22)',
          boxSizing: 'border-box',
        }} />
      </div>
    </div>
  );
}

// ── Quick Action Button ──

function QuickAction({
  label, icon, onClick, iconStyle,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  iconStyle?: React.CSSProperties;
}) {
  return (
    <button className="quick-action" onClick={onClick}>
      <div className="quick-action-icon" style={iconStyle}>
        {icon}
      </div>
      <span className="quick-action-label">{label}</span>
    </button>
  );
}

// ── Activity Row ──
function ActivityRow({ tx, isLast }: { tx: Transaction; isLast: boolean }) {
  const isPayment = tx.type === 'payment';

  return (
    <div
      className="tx-row"
      style={{
        padding: '13px 16px',
        borderBottom: isLast ? 'none' : '1px solid rgba(241, 245, 249, 0.85)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        transition: 'background 0.15s ease',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(241, 245, 249, 0.55)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <img
        src={tx.personAvatar}
        alt={tx.personName}
        className="tx-avatar"
        style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          objectFit: 'cover',
          border: '2px solid rgba(255, 255, 255, 0.95)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.07)',
          flexShrink: 0,
        }}
      />
      <div className="tx-info" style={{ flex: 1, minWidth: 0 }}>
        <div className="tx-name" style={{ fontSize: 13.5, color: '#111827', lineHeight: 1.3 }}>
          {isPayment ? (
            <>
              <span style={{ fontWeight: 600 }}>{tx.personName} paid </span>
              <span style={{ fontWeight: 800, color: '#16A34A' }}>-{formatINR(tx.amount)}</span>
            </>
          ) : (
            <>
              <span style={{ fontWeight: 600 }}>You added </span>
              <span style={{ fontWeight: 800, color: '#DC2626' }}>+{formatINR(tx.amount)}</span>
            </>
          )}
        </div>
        <div className="tx-sub" style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>
          {tx.groupName} • {tx.timeAgo}
        </div>
      </div>

      {/* Enhanced Status Badge: Green for Debit / Red for Credit */}
      {isPayment ? (
        <div
          title="Debited"
          style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(240, 253, 244, 0.95) 0%, rgba(220, 252, 231, 0.85) 100%)',
            border: '1.5px solid rgba(134, 239, 172, 0.85)',
            boxShadow: '0 2px 10px rgba(22, 163, 74, 0.16), inset 0 1px 2px rgba(255, 255, 255, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            cursor: 'default',
            transition: 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.18s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.12)';
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(22, 163, 74, 0.28)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 2px 10px rgba(22, 163, 74, 0.16), inset 0 1px 2px rgba(255, 255, 255, 0.9)';
          }}
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path
              d="M16.5 5.5L8.2 13.8L3.5 9.1"
              stroke="#16A34A"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      ) : (
        <div
          title="Credited"
          style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(254, 242, 242, 0.95) 0%, rgba(254, 226, 226, 0.85) 100%)',
            border: '1.5px solid rgba(254, 202, 202, 0.85)',
            boxShadow: '0 2px 10px rgba(220, 38, 38, 0.16), inset 0 1px 2px rgba(255, 255, 255, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            cursor: 'default',
            transition: 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.18s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.12)';
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(220, 38, 38, 0.28)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 2px 10px rgba(220, 38, 38, 0.16), inset 0 1px 2px rgba(255, 255, 255, 0.9)';
          }}
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 4V16M4 10H16"
              stroke="#DC2626"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

// ── Mock data for new sections ──
export interface RewardItem {
  id: string;
  icon: string;
  bg: string;
  color: string;
  borderColor?: string;
  shadow?: string;
  title: string;
  sub: string;
  value: string;
  tag: string;
  isNew?: boolean;
}

const MOCK_REWARDS: RewardItem[] = [
  {
    id: 'r1',
    icon: 'star',
    bg: '#EFF6FF',
    color: '#2563EB',
    borderColor: '#BFDBFE',
    shadow: '0 4px 12px rgba(37, 99, 235, 0.20)',
    title: 'Cashback Earned',
    sub: 'From group payments this month',
    value: '₹120',
    tag: 'Credited',
  },
  {
    id: 'r2',
    icon: 'trophy',
    bg: '#F0FDF4',
    color: '#16A34A',
    borderColor: '#BBF7D0',
    shadow: '0 4px 12px rgba(22, 163, 74, 0.20)',
    title: 'Group Milestone',
    sub: 'Trip Goa reached ₹10k spent',
    value: '₹50',
    tag: 'Bonus',
  },
  {
    id: 'r3',
    icon: 'coin',
    bg: '#F5F3FF',
    color: '#7C3AED',
    borderColor: '#E9D5FF',
    shadow: '0 4px 12px rgba(124, 58, 237, 0.20)',
    title: 'Loyalty Points',
    sub: '320 pts redeemable anytime',
    value: '320 pts',
    tag: 'Active',
  },
];

const MOCK_OTHER_REWARDS: RewardItem[] = [
  {
    id: 'r4',
    icon: 'gift',
    bg: '#F5F3FF',
    color: '#7C3AED',
    borderColor: '#DDD6FE',
    title: 'Welcome Scratch Card',
    sub: 'Unlocked on your first bill split',
    value: '₹75',
    tag: 'Claimed',
  },
  {
    id: 'r5',
    icon: 'party',
    bg: '#F0FDF4',
    color: '#16A34A',
    borderColor: '#BBF7D0',
    title: 'Weekend Split Bonus',
    sub: 'Split dinner with 3+ friends on Saturday',
    value: '₹100',
    tag: 'Claim Now',
    isNew: true,
  },
  {
    id: 'r6',
    icon: 'ticket',
    bg: '#EFF6FF',
    color: '#2563EB',
    borderColor: '#BAE6FD',
    title: 'Movie Night Voucher',
    sub: 'BookMyShow flat ₹150 off on group tickets',
    value: '₹150 OFF',
    tag: 'Active',
  },
  {
    id: 'r7',
    icon: 'shield',
    bg: '#F0FDF4',
    color: '#16A34A',
    borderColor: '#BBF7D0',
    title: 'Top Settler of the Month',
    sub: 'Settled all group dues within 1 hour',
    value: '₹200',
    tag: 'Unlocked',
    isNew: true,
  },
];

const MOCK_REFERRAL_STATS = [
  { label: 'Friends Invited', value: '8' },
  { label: 'Joined', value: '5' },
  { label: 'Earned', value: '₹250' },
];

const MOCK_OFFERS = [
  { id: 'o1', icon: 'offer', bg: '#F5F3FF', color: '#7C3AED', brand: 'Zomato', title: '20% off on group orders', exp: 'Expires in 3 days', pill: 'HOT' },
  { id: 'o2', icon: 'ticket', bg: '#EFF6FF', color: '#2563EB', brand: 'BookMyShow', title: 'Buy 2 get 1 free', exp: 'Expires in 7 days', pill: 'NEW' },
  { id: 'o3', icon: 'gift', bg: '#F0FDF4', color: '#16A34A', brand: 'Amazon', title: '5% back on group buys', exp: 'Limited time', pill: 'TOP' },
];

// ── Reward Row ──
function RewardRow({ item, isLast }: { item: RewardItem; isLast: boolean }) {
  return (
    <div className="tx-row" style={{ padding: '12px 16px', borderBottom: isLast ? 'none' : '1px solid #F9FAFB', display: 'flex', alignItems: 'center', gap: 12 }}>
      <EmojiBadge name={item.icon} size={40} shape="circle" bg={item.bg} color={item.color} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: '#111827' }}>{item.title}</div>
        <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{item.sub}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 13.5, fontWeight: 800, color: '#111827' }}>{item.value}</div>
        <span style={{
          display: 'inline-block',
          marginTop: 4,
          fontSize: 10,
          fontWeight: 700,
          padding: '2px 8px',
          borderRadius: 20,
          background: item.bg,
          color: item.color,
        }}>{item.tag}</span>
      </div>
    </div>
  );
}

// ── Offer Card ──
function OfferCard({ offer }: { offer: typeof MOCK_OFFERS[0] }) {
  return (
    <div style={{
      minWidth: 180,
      background: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderRadius: 18,
      border: `1.5px solid rgba(255, 255, 255, 0.9)`,
      padding: '14px',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
      flexShrink: 0,
      position: 'relative',
      overflow: 'hidden',
      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.08)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.04)';
    }}
    >
      {/* Pill badge */}
      <span style={{
        position: 'absolute',
        top: 10,
        right: 10,
        fontSize: 9,
        fontWeight: 800,
        padding: '3px 7px',
        borderRadius: 20,
        background: offer.bg,
        color: offer.color,
        letterSpacing: 0.5,
      }}>{offer.pill}</span>

      <EmojiBadge name={offer.icon} size={40} shape="circle" bg={offer.bg} color={offer.color} />
      <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 600, marginTop: 10 }}>{offer.brand}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginTop: 3, lineHeight: 1.3 }}>{offer.title}</div>
      <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 6 }}>{offer.exp}</div>
      <button style={{
        marginTop: 10,
        width: '100%',
        padding: '8px 0',
        background: offer.bg,
        color: offer.color,
        border: 'none',
        borderRadius: 10,
        fontSize: 12,
        fontWeight: 700,
        cursor: 'pointer',
      }}>Grab Now</button>
    </div>
  );
}

// ── Unified Payment History (Combined: Personal UPI & Group Vaults) ──
interface PaymentHistorySectionsProps {
  payments: PersonalPayment[];
  onSeeAll?: () => void;
  onOpenGroup?: (groupId: string) => void;
}

export function PaymentHistorySections({
  payments,
  onSeeAll,
  onOpenGroup,
}: PaymentHistorySectionsProps) {
  const [showAll, setShowAll] = useState(false);

  // Interleave and sort payments naturally so Personal and Group are clubbed together
  const combinedPayments = useMemo<PersonalPayment[]>(() => {
    const personal = payments.filter((p: PersonalPayment) => !p.groupId);
    const group = payments.filter((p: PersonalPayment) => !!p.groupId);
    const result: PersonalPayment[] = [];
    const maxLen = Math.max(personal.length, group.length);
    for (let i = 0; i < maxLen; i++) {
      if (group[i]) result.push(group[i]);
      if (personal[i]) result.push(personal[i]);
    }
    return result;
  }, [payments]);

  const displayedPayments = showAll ? combinedPayments : combinedPayments.slice(0, 5);

  // Overall debited and credited totals
  const totalDebit = payments
    .filter((p: PersonalPayment) => p.dir === 'paid')
    .reduce((sum: number, p: PersonalPayment) => sum + p.amount, 0);
  const totalCredit = payments
    .filter((p: PersonalPayment) => p.dir === 'received' || p.dir === 'added')
    .reduce((sum: number, p: PersonalPayment) => sum + p.amount, 0);

  return (
    <div style={{ marginBottom: 24 }}>
      <section>
        {/* Unified Section Header */}
        <div className="section-header">
          <h2 className="section-title">Payment History</h2>
          {onSeeAll && (
            <button onClick={onSeeAll} className="section-link">
              See all
            </button>
          )}
        </div>

        {/* Unified Glass Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.88)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderRadius: 24,
          border: '1.5px solid rgba(255, 255, 255, 0.95)',
          boxShadow: '0 10px 32px rgba(15, 23, 42, 0.05), inset 0 1px 2px rgba(255, 255, 255, 0.9)',
          overflow: 'hidden',
        }}>
          {/* Card Summary Header with Debited & Credited Stats */}
          <div style={{
            padding: '12px 18px',
            background: 'linear-gradient(180deg, rgba(248, 250, 252, 0.95) 0%, rgba(241, 245, 249, 0.6) 100%)',
            borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 10,
          }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#334155' }}>
              All Payments ({combinedPayments.length})
            </div>

            <div style={{ fontSize: 11.5, color: '#64748B', fontWeight: 600 }}>
              <span style={{ color: '#16A34A', fontWeight: 700 }}>
                -₹{new Intl.NumberFormat('en-IN').format(totalDebit)}
              </span> debited
              {totalCredit > 0 && (
                <> · <span style={{ color: '#DC2626', fontWeight: 700 }}>
                  +₹{new Intl.NumberFormat('en-IN').format(totalCredit)}
                </span> credited</>
              )}
            </div>
          </div>

          {/* Combined List of All Payments (Personal + Group Clubbed Together) */}
          <div>
            {displayedPayments.length === 0 ? (
              <div style={{ padding: '28px 16px', textAlign: 'center', color: '#94A3B8', fontSize: 13, fontWeight: 500 }}>
                No payment transactions found.
              </div>
            ) : (
              displayedPayments.map((p: PersonalPayment, idx: number) => {
                const isLast = idx === displayedPayments.length - 1;
                return p.groupId ? (
                  <GroupVaultPayRow
                    key={p.id}
                    payment={p}
                    isLast={isLast}
                    onClick={onOpenGroup ? () => onOpenGroup(p.groupId!) : undefined}
                  />
                ) : (
                  <PersonalPayRow
                    key={p.id}
                    payment={p}
                    isLast={isLast}
                  />
                );
              })
            )}
          </div>

          {/* View More / Collapse Footer */}
          {combinedPayments.length > 5 && (
            <button
              onClick={() => setShowAll(!showAll)}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(248, 250, 252, 0.75)',
                border: 'none',
                borderTop: '1px solid rgba(241, 245, 249, 0.9)',
                color: '#2563EB',
                fontSize: 12.5,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239, 246, 255, 0.85)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(248, 250, 252, 0.75)')}
            >
              <span>{showAll ? 'Show Less' : `View All (${combinedPayments.length}) Payments`}</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transform: showAll ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                }}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

// ── Personal Payment Row (Direct Personal UPI Identity) ──
function PersonalPayRow({ payment: p, isLast }: { payment: PersonalPayment; isLast: boolean }) {
  const isDebit = p.dir === 'paid';
  const isAdded = p.dir === 'added';

  // Green for money debit, Red for credit
  const amountColor = isDebit ? '#16A34A' : '#DC2626';
  const amountPrefix = isDebit ? '-₹' : '+₹';
  const formattedAmount = formatINR(p.amount).replace('₹', '');

  const pillStyle = isDebit
    ? { bg: '#DCFCE7', color: '#16A34A', label: 'Debited' }
    : { bg: '#FEE2E2', color: '#DC2626', label: isAdded ? 'Credited' : 'Received' };

  // Generate merchant avatar initial or glyph
  const initials = p.merchant
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase())
    .join('') || 'UPI';

  // Mode badge icon / label
  const modeBadge = p.paymentMode || (p.upiRef ? 'UPI ID' : 'Transfer');

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '13px 16px',
        borderBottom: isLast ? 'none' : '1px solid rgba(241, 245, 249, 0.85)',
        background: 'rgba(255, 255, 255, 0.72)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        transition: 'background 0.15s ease',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(248, 250, 252, 0.85)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.72)')}
    >
      {/* Left Details: Merchant Avatar & Metadata */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0, paddingRight: 10 }}>
        {/* Personal Contact/Merchant Avatar */}
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: 'linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)',
          color: '#1E293B',
          fontSize: 13,
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          border: '1px solid #CBD5E1',
          position: 'relative',
        }}>
          {initials}
          {/* Mini mode indicator on bottom right */}
          <div style={{
            position: 'absolute',
            bottom: -2,
            right: -2,
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: '#2563EB',
            border: '2px solid #FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="7" height="7" viewBox="0 0 24 24" fill="white">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 14,
            fontWeight: 700,
            color: '#111827',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            lineHeight: 1.25,
          }}>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.merchant}</span>
            <span style={{
              fontSize: 9.5,
              fontWeight: 700,
              padding: '1.5px 6px',
              borderRadius: 6,
              background: '#F1F5F9',
              color: '#475569',
              border: '1px solid #E2E8F0',
              flexShrink: 0,
            }}>
              {modeBadge}
            </span>
          </div>
          <div style={{
            fontSize: 12,
            color: '#475569',
            fontWeight: 500,
            marginTop: 2,
            lineHeight: 1.25,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {p.note}
          </div>
          <div style={{
            fontSize: 11,
            color: '#94A3B8',
            fontWeight: 500,
            marginTop: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            <span>{p.date}</span>
            {p.account && (
              <>
                <span>•</span>
                <span>{p.account}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Amount + Status Pill */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        flexShrink: 0,
      }}>
        <div style={{
          fontSize: 15,
          fontWeight: 700,
          color: amountColor,
          letterSpacing: '-0.3px',
          lineHeight: 1.2,
        }}>
          {amountPrefix}{formattedAmount}
        </div>
        <span style={{
          display: 'inline-block',
          marginTop: 4,
          fontSize: 10,
          fontWeight: 700,
          padding: '2px 8px',
          borderRadius: 10,
          background: pillStyle.bg,
          color: pillStyle.color,
          letterSpacing: '-0.1px',
        }}>
          {pillStyle.label}
        </span>
      </div>
    </div>
  );
}

// ── Group Vault Payment Row (Shared Vault Treasury Identity) ──
function GroupVaultPayRow({
  payment: p,
  isLast,
  onClick,
}: {
  payment: PersonalPayment;
  isLast: boolean;
  onClick?: () => void;
}) {
  const isDebit = p.dir === 'paid';
  const isAdded = p.dir === 'added';

  // Green for money debit, Red for credit
  const amountColor = isDebit ? '#16A34A' : '#DC2626';
  const amountPrefix = isDebit ? '-₹' : '+₹';
  const formattedAmount = formatINR(p.amount).replace('₹', '');

  const pillStyle = isDebit
    ? { bg: '#DCFCE7', color: '#16A34A', label: 'Vault Debited' }
    : { bg: '#FEE2E2', color: '#DC2626', label: isAdded ? 'Vault Funded' : 'Vault Refund' };

  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '13px 16px',
        borderBottom: isLast ? 'none' : '1px solid rgba(241, 245, 249, 0.85)',
        background: 'rgba(255, 255, 255, 0.72)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'background 0.15s ease',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(248, 250, 252, 0.85)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.72)')}
    >
      {/* Left Details: Vault Spend Details */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0, paddingRight: 10 }}>
        {/* Vault Icon */}
        <div style={{
          width: 38,
          height: 38,
          borderRadius: 12,
          background: isDebit ? 'rgba(37, 99, 235, 0.08)' : 'rgba(16, 185, 129, 0.10)',
          color: isDebit ? '#2563EB' : '#059669',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          border: `1px solid ${isDebit ? 'rgba(147, 197, 253, 0.5)' : 'rgba(167, 243, 208, 0.6)'}`,
        }}>
          {isDebit ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
              <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
              <path d="M18 12a2 2 0 0 0 0 4h4v-4z" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 14,
            fontWeight: 700,
            color: '#111827',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            lineHeight: 1.25,
          }}>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.merchant}</span>
            {p.account && (
              <span style={{
                fontSize: 9.5,
                fontWeight: 700,
                padding: '1.5px 6px',
                borderRadius: 6,
                background: `${p.groupTheme || '#2563EB'}12`,
                color: p.groupTheme || '#2563EB',
                border: `1px solid ${p.groupTheme || '#2563EB'}30`,
                flexShrink: 0,
              }}>
                {p.account}
              </span>
            )}
          </div>
          <div style={{
            fontSize: 12,
            color: '#475569',
            fontWeight: 500,
            marginTop: 2,
            lineHeight: 1.25,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {p.note}
          </div>
          <div style={{
            fontSize: 11,
            color: '#94A3B8',
            fontWeight: 500,
            marginTop: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            <span>{p.date}</span>
            {p.category && (
              <>
                <span>•</span>
                <span>{p.category}</span>
              </>
            )}
            {p.upiRef && (
              <>
                <span>•</span>
                <span>Ref {p.upiRef.slice(-4)}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Amount + Status Pill */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        flexShrink: 0,
      }}>
        <div style={{
          fontSize: 15,
          fontWeight: 700,
          color: amountColor,
          letterSpacing: '-0.3px',
          lineHeight: 1.2,
        }}>
          {amountPrefix}{formattedAmount}
        </div>
        <span style={{
          display: 'inline-block',
          marginTop: 4,
          fontSize: 10,
          fontWeight: 700,
          padding: '2px 8px',
          borderRadius: 10,
          background: pillStyle.bg,
          color: pillStyle.color,
          letterSpacing: '-0.1px',
        }}>
          {pillStyle.label}
        </span>
      </div>
    </div>
  );
}

