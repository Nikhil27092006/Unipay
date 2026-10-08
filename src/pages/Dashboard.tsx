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

          <div style={{ background: '#FFFFFF', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            {MOCK_RECENT_ACTIVITY.slice(0, 3).map((tx, idx) => (
              <ActivityRow key={tx.id} tx={tx} isLast={idx === 2} />
            ))}
          </div>
        </section>

        {/* ── Rewards ── */}
        <section style={{ marginBottom: 24 }}>
          <div className="section-header">
            <h2 className="section-title">Rewards</h2>
            <button className="section-link" onClick={() => setShowRewardsModal(true)}>View all</button>
          </div>
          {/* Three Google Pay style reward circles with title only */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: 20,
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            border: '1px solid #F1F5F9',
            padding: '20px 12px 18px',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
            {/* 1. Cashback (Google Pay Trophy & Sparkles) */}
            <button
              onClick={() => setShowRewardsModal(true)}
              style={{
                background: 'none',
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                flex: 1,
                padding: '0 4px',
                transition: 'transform 0.15s ease',
              }}
              onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.94)')}
              onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <div style={{
                width: 62,
                height: 62,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #FDE047 0%, #F59E0B 50%, #D97706 100%)',
                boxShadow: '0 6px 18px rgba(245, 158, 11, 0.35), inset 0 2px 4px rgba(255, 255, 255, 0.65)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 9,
                position: 'relative',
              }}>
                <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
                  {/* Top-right sparkle */}
                  <path d="M29 3L30.2 6.8L34 8L30.2 9.2L29 13L27.8 9.2L24 8L27.8 6.8L29 3Z" fill="#FFFFFF" opacity="0.95" />
                  {/* Bottom-left sparkle */}
                  <path d="M6 18L6.8 20.8L9.5 21.5L6.8 22.2L6 25L5.2 22.2L2.5 21.5L5.2 20.8L6 18Z" fill="#FFFFFF" opacity="0.8" />
                  {/* Trophy Base */}
                  <path d="M13 28H23V30C23 31.1 22.1 32 21 32H15C13.9 32 13 31.1 13 30V28Z" fill="#FFFBEB" />
                  <path d="M16 23H20V28H16V23Z" fill="#FEF08A" />
                  {/* Handles */}
                  <path d="M9 11C9 15.4 12.6 19 17 19" stroke="#FFFBEB" strokeWidth="2.4" strokeLinecap="round" />
                  <path d="M27 11C27 15.4 23.4 19 19 19" stroke="#FFFBEB" strokeWidth="2.4" strokeLinecap="round" />
                  {/* Cup Body */}
                  <path d="M10 8H26V15C26 19.4 22.4 23 18 23C13.6 23 10 19.4 10 15V8Z" fill="#FFFFFF" />
                  <path d="M10 8H26V10H10V8Z" fill="#FEF08A" />
                  {/* Star */}
                  <path d="M18 11.5L19.2 14.2L22 14.5L19.9 16.3L20.5 19L18 17.6L15.5 19L16.1 16.3L14 14.5L16.8 14.2L18 11.5Z" fill="#F59E0B" />
                </svg>
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#111827', letterSpacing: '-0.01em' }}>
                Cashback
              </span>
            </button>

            {/* 2. Milestone (Google Pay Medal Rosette & Sparkles) */}
            <button
              onClick={() => setShowRewardsModal(true)}
              style={{
                background: 'none',
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                flex: 1,
                padding: '0 4px',
                transition: 'transform 0.15s ease',
              }}
              onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.94)')}
              onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <div style={{
                width: 62,
                height: 62,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6EE7B7 0%, #10B981 50%, #047857 100%)',
                boxShadow: '0 6px 18px rgba(16, 185, 129, 0.35), inset 0 2px 4px rgba(255, 255, 255, 0.65)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 9,
                position: 'relative',
              }}>
                <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
                  {/* Sparkle top-left */}
                  <path d="M7 4L8.2 7.8L12 9L8.2 10.2L7 14L5.8 10.2L2 9L5.8 7.8L7 4Z" fill="#FFFFFF" opacity="0.95" />
                  {/* Sparkle bottom-right */}
                  <path d="M30 19L30.8 21.8L33.5 22.5L30.8 23.2L30 26L29.2 23.2L26.5 22.5L29.2 21.8L30 19Z" fill="#FFFFFF" opacity="0.85" />
                  {/* Ribbon tails */}
                  <path d="M13 22L10 32L15 29L19 32L17 22" fill="#D1FAE5" />
                  <path d="M23 22L26 32L21 29L17 32L19 22" fill="#A7F3D0" />
                  {/* Medal Center */}
                  <circle cx="18" cy="15" r="10" fill="#FFFFFF" />
                  <circle cx="18" cy="15" r="8" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" />
                  {/* Star */}
                  <path d="M18 9.5L19.5 13.2L23.5 13.5L20.5 16.1L21.4 20L18 18L14.6 20L15.5 16.1L12.5 13.5L16.5 13.2L18 9.5Z" fill="#059669" />
                </svg>
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#111827', letterSpacing: '-0.01em' }}>
                Milestone
              </span>
            </button>

            {/* 3. Points (Google Pay 3D Rupee Coin & Sparkles) */}
            <button
              onClick={() => setShowRewardsModal(true)}
              style={{
                background: 'none',
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                flex: 1,
                padding: '0 4px',
                transition: 'transform 0.15s ease',
              }}
              onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.94)')}
              onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <div style={{
                width: 62,
                height: 62,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #C4B5FD 0%, #8B5CF6 50%, #6D28D9 100%)',
                boxShadow: '0 6px 18px rgba(139, 92, 246, 0.35), inset 0 2px 4px rgba(255, 255, 255, 0.65)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 9,
                position: 'relative',
              }}>
                <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
                  {/* Sparkle top-right */}
                  <path d="M29 4L30.2 7.8L34 9L30.2 10.2L29 14L27.8 10.2L24 9L27.8 7.8L29 4Z" fill="#FFFFFF" opacity="0.95" />
                  {/* Sparkle bottom-left */}
                  <path d="M6 21L6.8 23.8L9.5 24.5L6.8 25.2L6 28L5.2 25.2L2.5 24.5L5.2 23.8L6 21Z" fill="#FFFFFF" opacity="0.8" />
                  {/* 3D Coin Body */}
                  <ellipse cx="18" cy="18" rx="12" ry="12" fill="#FFFFFF" />
                  <ellipse cx="18" cy="18" rx="9.8" ry="9.8" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="1.5" />
                  {/* Rupee Symbol */}
                  <path
                    d="M14.5 12.5H21.5M14.5 14.8H20.5M14.5 14.8C16.8 14.8 18.2 15.8 18.2 17.5C18.2 19.5 16.8 20.3 14.5 20.3H14M16.5 20.3L21 24.5"
                    stroke="#7C3AED"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#111827', letterSpacing: '-0.01em' }}>
                Points
              </span>
            </button>
          </div>
        </section>

        {/* ── Referrals ── */}
        <section style={{ marginBottom: 24 }}>
          <div className="section-header">
            <h2 className="section-title">Referrals</h2>
            <button className="section-link">Share</button>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
            borderRadius: 16,
            border: '1px solid #BFDBFE',
            padding: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
              <EmojiBadge name="referral" size={48} shape="circle" bg="#DBEAFE" color="#2563EB" />
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1D4ED8' }}>Invite Friends & Earn</div>
                <div style={{ fontSize: 12, color: '#3B82F6', marginTop: 2 }}>Get ₹50 for every friend who joins</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {MOCK_REFERRAL_STATS.map(stat => (
                <div key={stat.label} style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.7)',
                  borderRadius: 12,
                  padding: '10px 12px',
                  textAlign: 'center',
                  border: '1px solid rgba(191,219,254,0.6)',
                }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#1D4ED8' }}>{stat.value}</div>
                  <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 500, marginTop: 2 }}>{stat.label}</div>
                </div>
              ))}
            </div>
            <button style={{
              marginTop: 14,
              width: '100%',
              padding: '11px 0',
              background: '#2563EB',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: 0.2,
            }}>
              🔗 Copy Referral Link
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

  return (
    <div
      className="group-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      style={{
        background: group.cardBg,
        border: `1px solid ${group.cardBorder}`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
      }}
    >
      {/* Top row: icon + chevron */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
        <EmojiBadge
          name={group.icon}
          bg={group.iconBg}
          color={group.iconColor}
          size={42}
          shape="circle"
        />
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M9 18l6-6-6-6" stroke={group.themeColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Name */}
      <div style={{ fontSize: 13.5, fontWeight: 700, color: '#111827', marginBottom: 4, lineHeight: 1.2 }}>
        {group.name}
      </div>

      {/* Balance / Cap */}
      <div style={{ fontSize: 12, color: '#6B7280', fontWeight: 500, marginBottom: 8 }}>
        {formatINR(group.balance)} <span style={{ color: '#9CA3AF' }}>/ {formatINR(group.cap)}</span>
      </div>

      {/* Members count */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 11, color: '#6B7280', fontWeight: 500 }}>
          {group.members.length} members
        </span>
      </div>


      {/* Progress bar */}
      <div className="progress-track" style={{ background: 'rgba(0,0,0,0.06)' }}>
        <div
          className="progress-fill"
          style={{ width: `${usedPct}%`, background: group.themeColor }}
        />
      </div>

      {/* % used */}
      <div style={{ fontSize: 11, color: group.themeColor, fontWeight: 700, marginTop: 4 }}>
        {usedPct}% used
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
    <div className="tx-row" style={{
      padding: '12px 16px',
      borderBottom: isLast ? 'none' : '1px solid #F9FAFB',
    }}>
      <img src={tx.personAvatar} alt={tx.personName} className="tx-avatar" />
      <div className="tx-info">
        <div className="tx-name" style={{ fontSize: 13.5, color: '#111827' }}>
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
      {/* Status icon */}
      {tx.status === 'success' ? (
        <div className="status-circle success">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17l-5-5" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      ) : (
        <div className="status-circle add">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
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
      background: '#fff',
      borderRadius: 16,
      border: `1px solid ${offer.bg}`,
      padding: '14px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      flexShrink: 0,
      position: 'relative',
      overflow: 'hidden',
    }}>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {groupIds.map(gid => {
        const items = grouped[gid];
        const first = items[0];
        const isOpen = openId === gid;

        // Total spent / added for this group
        const totalPaid = items.filter(p => p.dir === 'paid').reduce((s, p) => s + p.amount, 0);
        const totalAdded = items.filter(p => p.dir === 'added').reduce((s, p) => s + p.amount, 0);

        return (
          <div key={gid} style={{
            background: '#fff',
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
            border: `1px solid ${first.groupCardBg}`,
          }}>
            {/* Group Header (tap to toggle) */}
            <button
              onClick={() => setOpenId(isOpen ? null : gid)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 16px',
                background: first.groupCardBg,
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <EmojiBadge name={first.groupIcon} size={38} shape="circle"
                bg={first.groupTheme} color="#FFFFFF" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{first.groupName}</div>
                <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
                  {items.length} txn · Paid {formatINR(totalPaid)} · Added {formatINR(totalAdded)}
                </div>
              </div>
              {/* Chevron */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease', flexShrink: 0 }}>
                <path d="M6 9l6 6 6-6" stroke={first.groupTheme} strokeWidth="2.2"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Transactions */}
            {isOpen && (
              <div>
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
  const dirConfig = {
    paid:     { label: 'Paid',     color: '#EF4444', bg: '#FEE2E2', prefix: '−' },
    received: { label: 'Received', color: '#16A34A', bg: '#DCFCE7', prefix: '+' },
    added:    { label: 'Added',    color: '#2563EB', bg: '#DBEAFE', prefix: '+' },
  }[p.dir];

  const statusDot = {
    success: '#16A34A',
    pending: '#F59E0B',
    failed: '#EF4444',
  }[p.status];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '11px 16px',
      borderBottom: isLast ? 'none' : '1px solid #F3F4F6',
    }}>

      {/* Details */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: 6 }}>
          {p.merchant}
          {/* Status dot */}
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusDot, display: 'inline-block', marginLeft: 2 }} />
        </div>
        <div style={{ fontSize: 11.5, color: '#6B7280', marginTop: 1 }}>{p.note}</div>
        <div style={{ fontSize: 10.5, color: '#9CA3AF', marginTop: 1 }}>{p.date}</div>
      </div>

      {/* Amount + dir badge */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: dirConfig.color }}>
          {dirConfig.prefix}{formatINR(p.amount)}
        </div>
        <span style={{
          display: 'inline-block',
          marginTop: 4,
          fontSize: 9,
          fontWeight: 700,
          padding: '2px 7px',
          borderRadius: 20,
          background: dirConfig.bg,
          color: dirConfig.color,
          letterSpacing: 0.3,
        }}>{dirConfig.label}</span>
      </div>
    </div>
  );
}
