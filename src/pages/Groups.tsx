import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../components/AppHeader';
import { MOCK_GROUPS, type Group } from '../data/mockData';

export function Groups() {
  const navigate = useNavigate();
  const [groupTab, setGroupTab] = useState<'active' | 'closed'>('active');

  const activeGroups = MOCK_GROUPS.filter(g => g.status === 'active');
  const closedGroups = MOCK_GROUPS.filter(g => g.status === 'terminated' || (g.status as string) === 'closed' || (g.status as string) === 'suspended');

  const displayedGroups = groupTab === 'active' ? activeGroups : closedGroups;

  return (
    <>
      <AppHeader />
      <div className="page-content" style={{ paddingTop: 10, paddingBottom: 110 }}>

        {/* ── Bar-like Segmented Switcher (Active Groups vs Closed Groups) ── */}
        <div style={{
          display: 'flex',
          background: 'rgba(241, 245, 249, 0.95)',
          border: '1px solid #E2E8F0',
          borderRadius: 14,
          padding: 3,
          marginBottom: 16,
          gap: 4,
        }}>
          <button
            type="button"
            onClick={() => setGroupTab('active')}
            style={{
              flex: 1,
              padding: '9px 14px',
              borderRadius: 11,
              border: 'none',
              background: groupTab === 'active' ? '#FFFFFF' : 'transparent',
              color: groupTab === 'active' ? '#1D4ED8' : '#64748B',
              fontWeight: groupTab === 'active' ? 700 : 600,
              fontSize: 13,
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
              padding: '9px 14px',
              borderRadius: 11,
              border: 'none',
              background: groupTab === 'closed' ? '#FFFFFF' : 'transparent',
              color: groupTab === 'closed' ? '#1D4ED8' : '#64748B',
              fontWeight: groupTab === 'closed' ? 700 : 600,
              fontSize: 13,
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

        {/* ── Groups List ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {displayedGroups.length === 0 ? (
            <div style={{
              padding: '36px 16px',
              textAlign: 'center',
              color: '#94A3B8',
              fontSize: 13,
              fontWeight: 500,
              background: 'rgba(255, 255, 255, 0.7)',
              borderRadius: 20,
              border: '1px solid #E2E8F0',
            }}>
              No {groupTab === 'active' ? 'active' : 'closed'} groups found.
            </div>
          ) : (
            displayedGroups.map(group => (
              <WalletCard
                key={group.id}
                group={group}
                onClick={() => navigate(`/groups/${group.id}`)}
              />
            ))
          )}
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

function WalletCard({ group, onClick }: { group: Group; onClick: () => void }) {
  const isActive = group.status === 'active';

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
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onClick()}
      style={{
        borderRadius: 22,
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        background: isActive
          ? `linear-gradient(140deg, ${group.themeColor || '#2563EB'} 0%, #2454D9 55%, #1E3FA8 100%)`
          : 'linear-gradient(140deg, #64748B 0%, #475569 60%, #334155 100%)',
        boxShadow: isActive
          ? `0 10px 26px ${group.themeColor || '#2563EB'}35, 0 2px 6px rgba(15,23,42,0.12)`
          : '0 8px 20px rgba(71,85,105,0.25)',
        border: '1px solid rgba(255, 255, 255, 0.16)',
        transition: 'transform 0.2s cubic-bezier(.22,.68,0,1.2), box-shadow 0.2s ease',
        padding: '16px 18px 15px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        userSelect: 'none',
        opacity: isActive ? 1 : 0.88,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
      }}
    >
      {/* Sheen overlay */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 48,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.14) 0%, transparent 100%)',
        borderRadius: '22px 22px 0 0',
        pointerEvents: 'none',
      }} />

      {/* TOP ROW: Simple Group Name + Active Members + Coin Button */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
        <div style={{ flex: 1, minWidth: 0, marginRight: 12 }}>
          {/* Simple group name */}
          <div style={{
            fontSize: 17,
            fontWeight: 800,
            color: '#FFFFFF',
            letterSpacing: '-0.3px',
            lineHeight: 1.2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {group.name}
          </div>

          {/* Active members */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 5 }}>
            {isActive ? (
              <>
                <span style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: '#34D399',
                  boxShadow: '0 0 8px #34D399',
                  display: 'inline-block',
                }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#BFDBFE' }}>
                  {group.activeMemberCount || group.members.length} active members
                </span>
                {/* Member avatars */}
                <div style={{ display: 'flex', alignItems: 'center', marginLeft: 4 }}>
                  {group.members.slice(0, 3).map((m, i) => (
                    <div
                      key={m.id || i}
                      title={m.name}
                      style={{
                        width: 18, height: 18, borderRadius: '50%',
                        background: MONO_COLORS[i % MONO_COLORS.length],
                        border: '1.5px solid rgba(255,255,255,0.85)',
                        marginLeft: i === 0 ? 0 : -5,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#1E3A8A', fontSize: 7.5, fontWeight: 900,
                        zIndex: 3 - i,
                      }}
                    >
                      {m.name.charAt(0).toUpperCase()}
                    </div>
                  ))}
                  {group.members.length > 3 && (
                    <span style={{ fontSize: 9.5, fontWeight: 700, color: '#FFFFFF', marginLeft: 4 }}>
                      +{group.members.length - 3}
                    </span>
                  )}
                </div>
              </>
            ) : (
              <>
                <span style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: '#94A3B8',
                  display: 'inline-block',
                }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#CBD5E1' }}>
                  0 active members
                </span>
              </>
            )}
          </div>
        </div>

        {/* Coin / Wallet Button */}
        <div style={{
          width: 36, height: 36,
          borderRadius: 12,
          background: 'rgba(255,255,255,0.16)',
          backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          flexShrink: 0,
        }}>
          <div style={{
            width: 16, height: 16,
            borderRadius: '50%',
            border: '3.5px solid rgba(255,255,255,0.9)',
          }} />
        </div>
      </div>

      {/* BOTTOM ROW: Message of the user */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        padding: '9px 12px',
        borderRadius: 13,
        background: 'rgba(255, 255, 255, 0.12)',
        backdropFilter: 'blur(6px)',
        border: '1px solid rgba(255, 255, 255, 0.14)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0, flex: 1 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: isActive ? '#93C5FD' : '#CBD5E1', flexShrink: 0 }}>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <div style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 12 }}>
            <span style={{ fontWeight: 700, color: isActive ? '#BFDBFE' : '#E2E8F0', marginRight: 5 }}>
              {group.latestMessage.sender}:
            </span>
            <span style={{ color: '#FFFFFF', fontWeight: 500, opacity: 0.95 }}>
              "{group.latestMessage.text}"
            </span>
          </div>
        </div>
        <span style={{
          fontSize: 10.5,
          fontWeight: 600,
          color: 'rgba(255, 255, 255, 0.65)',
          flexShrink: 0,
        }}>
          {group.latestMessage.time}
        </span>
      </div>
    </div>
  );
}
