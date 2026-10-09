import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../components/AppHeader';
import { MOCK_GROUPS, formatINR, pct, type Group } from '../data/mockData';
import { EmojiBadge } from '../components/EmojiBadge';

// ── Total vault stats ──────────────────────────────────────────
const totalBalance = MOCK_GROUPS.reduce((s, g) => s + g.balance, 0);
const totalCap = MOCK_GROUPS.reduce((s, g) => s + g.cap, 0);
const totalSpent = MOCK_GROUPS.reduce((s, g) => s + g.spentThisMonth, 0);

// Member avatar monogram color generator
const MONOGRAM_COLORS = [
  'linear-gradient(135deg, #3B82F6, #1D4ED8)',
  'linear-gradient(135deg, #8B5CF6, #6D28D9)',
  'linear-gradient(135deg, #10B981, #047857)',
  'linear-gradient(135deg, #F59E0B, #D97706)',
  'linear-gradient(135deg, #EC4899, #BE185D)',
  'linear-gradient(135deg, #06B6D4, #0E7490)',
];

export function Groups() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>('all');

  const categories = [
    { id: 'all', label: `All (${MOCK_GROUPS.length})` },
    { id: 'living', label: 'Living' },
    { id: 'events', label: 'Events' },
    { id: 'trip', label: 'Trips' },
    { id: 'dining', label: 'Dining' },
  ];

  const filteredGroups = filter === 'all'
    ? MOCK_GROUPS
    : MOCK_GROUPS.filter(g => g.category.toLowerCase() === filter);

  return (
    <>
      <AppHeader />
      <div className="page-content" style={{ paddingTop: 10, paddingBottom: 110 }}>

        {/* ── Simplified & Clean Vault Overview Header ── */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: 20,
          padding: '18px 20px',
          border: '1.5px solid rgba(255, 255, 255, 0.95)',
          boxShadow: '0 4px 20px rgba(15, 23, 42, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 18,
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#2563EB', marginBottom: 2 }}>
              Total Pooled Liquidity
            </div>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#0F172A', letterSpacing: '-0.5px' }}>
              {formatINR(totalBalance)}
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#64748B', marginTop: 2 }}>
              Across {MOCK_GROUPS.length} active pools
            </div>
          </div>

          <button
            onClick={() => navigate('/create-group')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: '#2563EB',
              color: '#FFFFFF', border: 'none', borderRadius: 14,
              padding: '10px 16px', fontSize: 13, fontWeight: 700,
              cursor: 'pointer', boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)',
              transition: 'transform 0.15s ease',
            }}
            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.95)')}
            onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.8" strokeLinecap="round" />
            </svg>
            New Vault
          </button>
        </div>

        {/* ── Filter Chips ── */}
        <div style={{
          display: 'flex', gap: 8, overflowX: 'auto',
          scrollbarWidth: 'none', paddingBottom: 4, marginBottom: 16,
        }}>
          {categories.map(cat => {
            const active = filter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                style={{
                  padding: '7px 14px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: active ? 700 : 600,
                  border: active ? '1.5px solid #2563EB' : '1px solid rgba(226, 232, 240, 0.8)',
                  background: active ? '#2563EB' : 'rgba(255, 255, 255, 0.8)',
                  color: active ? '#FFFFFF' : '#64748B',
                  cursor: 'pointer',
                  flexShrink: 0,
                  backdropFilter: 'blur(10px)',
                  boxShadow: active ? '0 2px 10px rgba(37, 99, 235, 0.25)' : '0 1px 3px rgba(0, 0, 0, 0.03)',
                  transition: 'all 0.15s ease',
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* ── Group Cards List ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filteredGroups.map(group => (
            <EnhancedGroupCard
              key={group.id}
              group={group}
              onClick={() => navigate(`/groups/${group.id}`)}
            />
          ))}
        </div>

        {/* ── Bottom Quick Actions (Create / Join Tiles) ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 22 }}>
          {/* Create Group */}
          <button
            onClick={() => navigate('/create-group')}
            style={{
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1.5px solid rgba(255, 255, 255, 0.95)',
              borderRadius: 20, padding: '16px 14px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              cursor: 'pointer',
              boxShadow: '0 4px 18px rgba(15, 23, 42, 0.04)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(37, 99, 235, 0.12)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 18px rgba(15, 23, 42, 0.04)';
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: 'linear-gradient(135deg, #DBEAFE 0%, #EFF6FF 100%)',
              border: '1.5px solid #BFDBFE',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.12)',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="#2563EB" strokeWidth="2.6" strokeLinecap="round" />
              </svg>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#111827' }}>Create Vault</div>
              <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 1, fontWeight: 500 }}>Start a new pool</div>
            </div>
          </button>

          {/* Join Group */}
          <button
            onClick={() => navigate('/join-group')}
            style={{
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1.5px solid rgba(255, 255, 255, 0.95)',
              borderRadius: 20, padding: '16px 14px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              cursor: 'pointer',
              boxShadow: '0 4px 18px rgba(15, 23, 42, 0.04)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(124, 58, 237, 0.12)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 18px rgba(15, 23, 42, 0.04)';
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: 'linear-gradient(135deg, #EDE9FE 0%, #F5F3FF 100%)',
              border: '1.5px solid #C4B5FD',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(124, 58, 237, 0.12)',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" stroke="#7C3AED" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#111827' }}>Join Vault</div>
              <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 1, fontWeight: 500 }}>Enter invite code</div>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}

// ── God-Level Group Card ─────────────────────────────────────────
function EnhancedGroupCard({ group, onClick }: { group: Group; onClick: () => void }) {
  const usedPct = pct(group.balance, group.cap);
  const remaining = group.cap - group.balance;
  const isHealthy = usedPct >= 50;

  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative',
        background: `linear-gradient(145deg, ${group.cardBg}85 0%, rgba(255, 255, 255, 0.96) 75%, ${group.cardBg}45 100%)`,
        borderRadius: 22,
        border: `1.5px solid ${group.cardBorder}`,
        boxShadow: `0 6px 22px ${group.themeColor}15, 0 1px 3px rgba(0, 0, 0, 0.02)`,
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = `0 14px 30px ${group.themeColor}25, 0 2px 6px rgba(0,0,0,0.03)`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = `0 6px 22px ${group.themeColor}15, 0 1px 3px rgba(0, 0, 0, 0.02)`;
      }}
    >
      {/* Top subtle color indicator accent */}
      <div style={{
        height: 3.5,
        background: `linear-gradient(90deg, ${group.themeColor}, ${group.cardBorder}, transparent)`,
      }} />

      <div style={{ padding: '16px 18px 18px' }}>
        {/* Row 1: Squircle Badge + Name & Category + Balance */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
          {/* Enhanced Squircle Icon Badge */}
          <div style={{
            width: 50, height: 50, borderRadius: 16, flexShrink: 0,
            background: '#FFFFFF',
            border: `1.5px solid ${group.cardBorder}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 4px 14px ${group.themeColor}22`,
          }}>
            <EmojiBadge name={group.icon} bg="transparent" color={group.themeColor} size={28} shape="none" />
          </div>

          {/* Group Name & Tags */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 16, fontWeight: 800,
              color: '#0F172A', letterSpacing: '-0.2px',
              lineHeight: 1.25,
            }}>
              {group.name}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
              <span style={{
                fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
                background: group.cardBg, color: group.themeColor,
                padding: '2px 7px', borderRadius: 6,
                border: `1px solid ${group.cardBorder}`,
              }}>
                {group.category}
              </span>

              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 3,
                fontSize: 10, fontWeight: 600, color: '#64748B',
                background: '#F8FAFC', padding: '2px 6px', borderRadius: 6,
                border: '1px solid #E2E8F0',
              }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke="#64748B" strokeWidth="2.5" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#64748B" strokeWidth="2.5" />
                </svg>
                Multi-Sig
              </span>
            </div>
          </div>

          {/* Balance & Cap */}
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{
              fontSize: 18, fontWeight: 900,
              color: '#0F172A', letterSpacing: '-0.4px',
            }}>
              {formatINR(group.balance)}
            </div>
            <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500, marginTop: 1 }}>
              / {formatINR(group.cap)} cap
            </div>
          </div>
        </div>

        {/* Luminous Glowing Progress Bar */}
        <div style={{
          height: 7, background: '#F1F5F9',
          borderRadius: 99, overflow: 'hidden',
          marginBottom: 10,
        }}>
          <div style={{
            height: '100%',
            width: `${usedPct}%`,
            background: `linear-gradient(90deg, ${group.themeColor}CC 0%, ${group.themeColor} 100%)`,
            borderRadius: 99,
            transition: 'width 0.5s ease',
            boxShadow: `0 0 10px ${group.themeColor}66`,
          }} />
        </div>

        {/* Metrics Row: % funded | Spent | Remaining */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 14,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: group.themeColor,
              boxShadow: `0 0 6px ${group.themeColor}`,
            }} />
            <span style={{ fontSize: 12, color: group.themeColor, fontWeight: 800 }}>
              {usedPct}% funded
            </span>
          </div>

          <div style={{ fontSize: 11, color: '#64748B', fontWeight: 500 }}>
            {formatINR(group.spentThisMonth)} spent
          </div>

          <span style={{
            fontSize: 11, fontWeight: 700,
            color: isHealthy ? '#059669' : '#D97706',
            background: isHealthy ? '#ECFDF5' : '#FFFBEB',
            padding: '2.5px 8px', borderRadius: 8,
            border: `1px solid ${isHealthy ? '#A7F3D0' : '#FDE68A'}`,
          }}>
            {formatINR(remaining)} left
          </span>
        </div>

        {/* Bottom Row: Monogram Initials Monograms (NO photos) + Open CTA */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingTop: 12,
          borderTop: '1px solid #F1F5F9',
        }}>
          {/* Monogram Circles */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginRight: 8 }}>
              {group.members.slice(0, 4).map((m, i) => (
                <div
                  key={m.id || i}
                  title={m.name}
                  style={{
                    width: 25,
                    height: 25,
                    borderRadius: '50%',
                    background: MONOGRAM_COLORS[i % MONOGRAM_COLORS.length],
                    border: '2px solid #FFFFFF',
                    marginLeft: i === 0 ? 0 : -7,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontSize: 10,
                    fontWeight: 800,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    zIndex: 4 - i,
                  }}
                >
                  {m.name.charAt(0).toUpperCase()}
                </div>
              ))}
              {group.members.length > 4 && (
                <div style={{
                  width: 25,
                  height: 25,
                  borderRadius: '50%',
                  background: '#E2E8F0',
                  border: '2px solid #FFFFFF',
                  marginLeft: -7,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#475569',
                  fontSize: 9.5,
                  fontWeight: 700,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}>
                  +{group.members.length - 4}
                </div>
              )}
            </div>
            <span style={{ fontSize: 11.5, color: '#64748B', fontWeight: 600 }}>
              {group.members.length} members
            </span>
          </div>

          {/* Subtle View Vault Button */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            fontSize: 12, fontWeight: 700,
            color: group.themeColor,
          }}>
            <span>Open Vault</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
