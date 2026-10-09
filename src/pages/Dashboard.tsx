import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../components/AppHeader';
import {
  CURRENT_USER, MOCK_GROUPS, MOCK_RECENT_ACTIVITY, MOCK_PERSONAL_PAYMENTS,
  formatINR, pct, type Group, type Transaction, type PersonalPayment
} from '../data/mockData';
import { EmojiBadge } from '../components/EmojiBadge';

export function Dashboard() {
  const navigate = useNavigate();
  const [showRewardsModal, setShowRewardsModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

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
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111827', lineHeight: 1.2, display: 'flex', alignItems: 'center', gap: 6 }}>
            Hey, {CURRENT_USER.name} <EmojiBadge name="wave" size="inline" />
          </h1>
          <p style={{ fontSize: 13, color: '#6B7280', marginTop: 3, fontWeight: 500 }}>
            Groups. Payments. Together.
          </p>
        </div>

        {/* ── Your Groups ── */}
        <section style={{ marginBottom: 20 }}>
          <div className="section-header">
            <h2 className="section-title">Your Groups</h2>
            <button className="section-link" onClick={() => navigate('/groups')}>See all</button>
          </div>

          {/* Horizontal scroll */}
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
            {MOCK_GROUPS.slice(0, 3).map(group => (
              <GroupCard key={group.id} group={group} onClick={() => navigate(`/groups/${group.id}`)} />
            ))}
          </div>
        </section>

        {/* ── Quick Actions ── */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: 24,
          gap: 4,
        }}>
          <QuickAction
            label="Scan & Pay"
            onClick={() => navigate('/scan')}
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2"
                  stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="7" y1="12" x2="17" y2="12" stroke="#2563EB" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            }
          />
          <QuickAction
            label="Pay Contact"
            onClick={() => navigate('/pay-contact')}
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="9" cy="7" r="4" stroke="#2563EB" strokeWidth="1.8"/>
                <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M19 8v6M22 11h-6" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            }
          />
          <QuickAction
            label="Add Money"
            onClick={() => navigate('/add-money')}
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="6" width="20" height="14" rx="3" stroke="#2563EB" strokeWidth="1.8"/>
                <path d="M2 10h20M12 14v2M12 14v-2M12 14h2M12 14h-2" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            }
          />
          <QuickAction
            label="Choose Group"
            onClick={() => navigate('/groups')}
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
                  stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
          />
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
            background: 'linear-gradient(135deg, rgba(224, 242, 254, 0.65) 0%, rgba(255, 255, 255, 0.8) 45%, rgba(243, 232, 255, 0.65) 100%)',
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
                background: 'linear-gradient(135deg, #E0F2FE 0%, #EDE9FE 100%)',
                border: '1.5px solid rgba(255, 255, 255, 0.95)',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.16)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
                  <defs>
                    <linearGradient id="giftBodyPurple" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#A855F7" />
                      <stop offset="100%" stopColor="#7C3AED" />
                    </linearGradient>
                    <linearGradient id="giftBodyBlue" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#38BDF8" />
                      <stop offset="100%" stopColor="#0284C7" />
                    </linearGradient>
                    <linearGradient id="giftRibbonGold" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FDE047" />
                      <stop offset="50%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#D97706" />
                    </linearGradient>
                  </defs>

                  {/* Sparkles */}
                  <path d="M7 6L7.8 8.5L10.3 9.3L7.8 10.1L7 12.6L6.2 10.1L3.7 9.3L6.2 8.5L7 6Z" fill="#38BDF8" opacity="0.9" />
                  <circle cx="18" cy="4" r="1.5" fill="#F59E0B" opacity="0.95" />
                  <path d="M29 7L29.6 9L31.6 9.6L29.6 10.2L29 12.2L28.4 10.2L26.4 9.6L28.4 9L29 7Z" fill="#A855F7" opacity="0.9" />

                  {/* Box Body */}
                  <path d="M8 17H17V27C17 28.1 16.1 29 15 29H10C8.9 29 8 28.1 8 27V17Z" fill="url(#giftBodyPurple)" />
                  <path d="M19 17H28V27C28 28.1 27.1 29 26 29H21C19.9 29 19 28.1 19 27V17Z" fill="url(#giftBodyBlue)" />

                  {/* Vertical Ribbon */}
                  <rect x="16.5" y="17" width="3" height="12" fill="url(#giftRibbonGold)" />

                  {/* Box Lids */}
                  <path d="M6 14C6 13.4 6.4 13 7 13H17V17H6V14Z" fill="#8B5CF6" />
                  <path d="M19 13H29C29.6 13 30 13.4 30 14V17H19V13Z" fill="#0EA5E9" />
                  <rect x="16.5" y="13" width="3" height="4" fill="url(#giftRibbonGold)" />

                  {/* Gold Bow on top */}
                  <path d="M17 13C17 13 13.5 8.5 11 10C8.8 11.2 11 13 17 13Z" fill="#FBBF24" stroke="#F59E0B" strokeWidth="0.8" />
                  <path d="M19 13C19 13 22.5 8.5 25 10C27.2 11.2 25 13 19 13Z" fill="#FBBF24" stroke="#F59E0B" strokeWidth="0.8" />
                  <circle cx="18" cy="13" r="2.2" fill="#F59E0B" />
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

        {/* ── Personal Payment History ── */}
        <section style={{ marginBottom: 24 }}>
          <div className="section-header">
            <h2 className="section-title">My Payment History</h2>
            <button className="section-link" onClick={() => navigate('/activity')}>See all</button>
          </div>
          <PersonalHistory payments={MOCK_PERSONAL_PAYMENTS} />
        </section>

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

      </div>

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
    </>
  );
}

// ── Group Card ──
function GroupCard({ group, onClick }: { group: Group; onClick: () => void }) {
  const usedPct = pct(group.balance, group.cap);

  const MONO_COLORS = [
    'linear-gradient(135deg, #3B82F6, #1D4ED8)',
    'linear-gradient(135deg, #8B5CF6, #6D28D9)',
    'linear-gradient(135deg, #10B981, #047857)',
    'linear-gradient(135deg, #F59E0B, #D97706)',
  ];

  return (
    <div
      className="group-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      style={{
        flexShrink: 0,
        width: 178,
        borderRadius: 22,
        padding: '16px 14px',
        cursor: 'pointer',
        background: `linear-gradient(145deg, ${group.cardBg}85 0%, rgba(255, 255, 255, 0.96) 75%, ${group.cardBg}45 100%)`,
        border: `1.5px solid ${group.cardBorder}`,
        boxShadow: `0 6px 20px ${group.themeColor}15, 0 1px 3px rgba(0, 0, 0, 0.02)`,
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = `0 12px 28px ${group.themeColor}25, 0 2px 6px rgba(0,0,0,0.04)`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = `0 6px 20px ${group.themeColor}15, 0 1px 3px rgba(0, 0, 0, 0.02)`;
      }}
    >
      {/* Top subtle color indicator line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 3,
        background: `linear-gradient(90deg, ${group.themeColor}, ${group.cardBorder}, transparent)`,
      }} />

      {/* Top row: Squircle icon + chevron */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 14,
          background: '#FFFFFF',
          border: `1.5px solid ${group.cardBorder}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 3px 10px ${group.themeColor}20`,
        }}>
          <EmojiBadge
            name={group.icon}
            bg="transparent"
            color={group.themeColor}
            size={24}
            shape="none"
          />
        </div>

        <div style={{
          width: 26, height: 26, borderRadius: '50%',
          background: '#F8FAFC', border: '1px solid #E2E8F0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: group.themeColor,
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Name */}
      <div style={{
        fontSize: 14, fontWeight: 800,
        color: '#0F172A', marginBottom: 3,
        letterSpacing: '-0.2px', lineHeight: 1.25,
      }}>
        {group.name}
      </div>

      {/* Balance / Cap */}
      <div style={{ fontSize: 14.5, fontWeight: 900, color: '#0F172A', letterSpacing: '-0.3px', marginBottom: 2 }}>
        {formatINR(group.balance)}
      </div>
      <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500, marginBottom: 10 }}>
        / {formatINR(group.cap)} cap
      </div>

      {/* Luminous Progress bar */}
      <div style={{
        height: 6, background: '#F1F5F9',
        borderRadius: 99, overflow: 'hidden',
        marginBottom: 10,
      }}>
        <div
          style={{
            height: '100%',
            width: `${usedPct}%`,
            background: `linear-gradient(90deg, ${group.themeColor}CC, ${group.themeColor})`,
            borderRadius: 99,
            boxShadow: `0 0 8px ${group.themeColor}66`,
          }}
        />
      </div>

      {/* Bottom row: Monogram avatar circles + % used */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {group.members.slice(0, 3).map((m, i) => (
            <div
              key={m.id || i}
              title={m.name}
              style={{
                width: 20, height: 20, borderRadius: '50%',
                background: MONO_COLORS[i % MONO_COLORS.length],
                border: '1.5px solid #FFFFFF',
                marginLeft: i === 0 ? 0 : -6,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#FFFFFF', fontSize: 8.5, fontWeight: 800,
                zIndex: 3 - i,
              }}
            >
              {m.name.charAt(0).toUpperCase()}
            </div>
          ))}
          {group.members.length > 3 && (
            <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600, marginLeft: 4 }}>
              +{group.members.length - 3}
            </span>
          )}
        </div>

        <div style={{ fontSize: 11, color: group.themeColor, fontWeight: 800 }}>
          {usedPct}%
        </div>
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
              <span style={{ fontWeight: 800 }}>{formatINR(tx.amount)}</span>
            </>
          ) : (
            <>
              <span style={{ fontWeight: 600 }}>You added </span>
              <span style={{ fontWeight: 800 }}>{formatINR(tx.amount)}</span>
            </>
          )}
        </div>
        <div className="tx-sub" style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>
          {tx.groupName} • {tx.timeAgo}
        </div>
      </div>

      {/* Enhanced Status Badge */}
      {tx.status === 'success' ? (
        <div
          title="Completed"
          style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(239, 246, 255, 0.95) 0%, rgba(219, 234, 254, 0.85) 100%)',
            border: '1.5px solid rgba(147, 197, 253, 0.85)',
            boxShadow: '0 2px 10px rgba(37, 99, 235, 0.16), inset 0 1px 2px rgba(255, 255, 255, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            cursor: 'default',
            transition: 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.18s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.12)';
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(37, 99, 235, 0.28)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 2px 10px rgba(37, 99, 235, 0.16), inset 0 1px 2px rgba(255, 255, 255, 0.9)';
          }}
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path
              d="M16.5 5.5L8.2 13.8L3.5 9.1"
              stroke="#1D4ED8"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      ) : (
        <div
          title="Added"
          style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(240, 249, 255, 0.95) 0%, rgba(224, 242, 254, 0.85) 100%)',
            border: '1.5px solid rgba(186, 230, 253, 0.85)',
            boxShadow: '0 2px 10px rgba(2, 132, 199, 0.16), inset 0 1px 2px rgba(255, 255, 255, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            cursor: 'default',
            transition: 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.18s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.12)';
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(2, 132, 199, 0.28)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 2px 10px rgba(2, 132, 199, 0.16), inset 0 1px 2px rgba(255, 255, 255, 0.9)';
          }}
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 4V16M4 10H16"
              stroke="#0284C7"
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
    bg: '#FEF3C7',
    color: '#D97706',
    borderColor: '#FDE68A',
    shadow: '0 4px 12px rgba(217, 119, 6, 0.20)',
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
    bg: '#FCE7F3',
    color: '#DB2777',
    borderColor: '#FBCFE8',
    title: 'Welcome Scratch Card',
    sub: 'Unlocked on your first bill split',
    value: '₹75',
    tag: 'Claimed',
  },
  {
    id: 'r5',
    icon: 'party',
    bg: '#FEF3C7',
    color: '#D97706',
    borderColor: '#FDE68A',
    title: 'Weekend Split Bonus',
    sub: 'Split dinner with 3+ friends on Saturday',
    value: '₹100',
    tag: 'Claim Now',
    isNew: true,
  },
  {
    id: 'r6',
    icon: 'ticket',
    bg: '#E0F2FE',
    color: '#0284C7',
    borderColor: '#BAE6FD',
    title: 'Movie Night Voucher',
    sub: 'BookMyShow flat ₹150 off on group tickets',
    value: '₹150 OFF',
    tag: 'Active',
  },
  {
    id: 'r7',
    icon: 'shield',
    bg: '#ECFDF5',
    color: '#059669',
    borderColor: '#A7F3D0',
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
  { id: 'o1', icon: 'offer', bg: '#FEE2E2', color: '#DC2626', brand: 'Zomato', title: '20% off on group orders', exp: 'Expires in 3 days', pill: 'HOT' },
  { id: 'o2', icon: 'ticket', bg: '#E0F2FE', color: '#0284C7', brand: 'BookMyShow', title: 'Buy 2 get 1 free', exp: 'Expires in 7 days', pill: 'NEW' },
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

// ── Personal History (grouped accordion) ──
function PersonalHistory({ payments }: { payments: PersonalPayment[] }) {
  // Group by groupId
  const grouped = payments.reduce<Record<string, PersonalPayment[]>>((acc, p) => {
    if (!acc[p.groupId]) acc[p.groupId] = [];
    acc[p.groupId].push(p);
    return acc;
  }, {});

  const groupIds = Object.keys(grouped);
  // Default: first group open
  const [openId, setOpenId] = useState<string | null>(groupIds[0] ?? null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {groupIds.map(gid => {
        const items = grouped[gid];
        const first = items[0];
        const isOpen = openId === gid;

        // Total spent / added for this group
        const totalPaid = items.filter(p => p.dir === 'paid').reduce((s, p) => s + p.amount, 0);
        const totalAdded = items.filter(p => p.dir === 'added').reduce((s, p) => s + p.amount, 0);

        return (
          <div
            key={gid}
            style={{
              background: '#FFFFFF',
              borderRadius: 20,
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(15, 23, 42, 0.05), 0 1px 3px rgba(0, 0, 0, 0.02)',
              border: '1.5px solid rgba(226, 232, 240, 0.85)',
              transition: 'box-shadow 0.2s ease',
            }}
          >
            {/* Group Header (tap to toggle) */}
            <button
              onClick={() => setOpenId(isOpen ? null : gid)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '14px 16px',
                background: '#E0ECFF',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.15s ease',
              }}
            >
              {/* Blue circular badge with white icon */}
              <div style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.28)',
              }}>
                {first.groupIcon === 'flatmates' ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                    <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z"/>
                  </svg>
                ) : (
                  <EmojiBadge name={first.groupIcon} size={28} shape="circle" bg="transparent" color="#FFFFFF" />
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 15.5,
                  fontWeight: 700,
                  color: '#0F172A',
                  letterSpacing: '-0.2px',
                  lineHeight: 1.25,
                }}>
                  {first.groupName}
                </div>
                <div style={{
                  fontSize: 12,
                  color: '#4B5563',
                  fontWeight: 500,
                  marginTop: 3,
                }}>
                  {items.length} txn · Paid {formatINR(totalPaid)} · Added {formatINR(totalAdded)}
                </div>
              </div>

              {/* Blue Chevron (points UP when open, DOWN when closed) */}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                style={{
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  flexShrink: 0,
                }}
              >
                <path
                  d="M6 9l6 6 6-6"
                  stroke="#1D4ED8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Transactions List */}
            {isOpen && (
              <div style={{ background: '#FFFFFF' }}>
                {items.map((p, idx) => (
                  <PersonalPayRow key={p.id} payment={p} isLast={idx === items.length - 1} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Single personal payment row ──
function PersonalPayRow({ payment: p, isLast }: { payment: PersonalPayment; isLast: boolean }) {
  const isPaid = p.dir === 'paid';
  const isAdded = p.dir === 'added';

  const amountColor = isPaid ? '#DC2626' : (isAdded ? '#1D4ED8' : '#16A34A');
  const amountPrefix = isPaid ? '-₹' : '+₹';
  const formattedAmount = formatINR(p.amount).replace('₹', '');

  const pillStyle = isPaid
    ? { bg: '#FEE2E2', color: '#DC2626', label: 'Paid' }
    : isAdded
    ? { bg: '#DBEAFE', color: '#1D4ED8', label: 'Added' }
    : { bg: '#DCFCE7', color: '#16A34A', label: 'Received' };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        padding: '14px 18px',
        borderBottom: isLast ? 'none' : '1px solid #F1F5F9',
        background: '#FFFFFF',
        transition: 'background 0.15s ease',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(248, 250, 252, 0.75)')}
      onMouseLeave={e => (e.currentTarget.style.background = '#FFFFFF')}
    >
      {/* Left Details */}
      <div style={{ flex: 1, minWidth: 0, paddingRight: 12 }}>
        <div style={{
          fontSize: 14.5,
          fontWeight: 700,
          color: '#111827',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          lineHeight: 1.25,
        }}>
          <span>{p.merchant}</span>
          <span style={{
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: '#CBD5E1',
            display: 'inline-block',
            flexShrink: 0,
          }} />
        </div>
        <div style={{
          fontSize: 12,
          color: '#475569',
          fontWeight: 500,
          marginTop: 3,
          lineHeight: 1.25,
        }}>
          {p.note}
        </div>
        <div style={{
          fontSize: 11.5,
          color: '#64748B',
          fontWeight: 400,
          marginTop: 3,
        }}>
          {p.date}
        </div>
      </div>

      {/* Right Column: Amount + Pill Badge */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        flexShrink: 0,
      }}>
        <div style={{
          fontSize: 15.5,
          fontWeight: 700,
          color: amountColor,
          letterSpacing: '-0.3px',
          lineHeight: 1.2,
        }}>
          {amountPrefix}{formattedAmount}
        </div>
        <span style={{
          display: 'inline-block',
          marginTop: 6,
          fontSize: 10.5,
          fontWeight: 600,
          padding: '2.5px 9px',
          borderRadius: 12,
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
