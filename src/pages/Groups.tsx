import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../components/AppHeader';
import { MOCK_GROUPS, formatINR, pct, type Group } from '../data/mockData';
import { EmojiBadge } from '../components/EmojiBadge';

// ── Total vault stats ──────────────────────────────────────────
const totalBalance = MOCK_GROUPS.reduce((s, g) => s + g.balance, 0);
const totalCap = MOCK_GROUPS.reduce((s, g) => s + g.cap, 0);
const totalSpent = MOCK_GROUPS.reduce((s, g) => s + g.spentThisMonth, 0);

// ── Chevron icon ────────────────────────────────────────────────
function Chevron() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Main Page ───────────────────────────────────────────────────
export function Groups() {
  const navigate = useNavigate();

  return (
    <>
      <AppHeader />
      <div className="page-content" style={{ paddingTop: 8, paddingBottom: 100 }}>

        {/* ── Header row ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111827', margin: 0 }}>Your Groups</h1>
            <p style={{ fontSize: 12, color: '#6B7280', margin: '2px 0 0', fontWeight: 500 }}>
              {MOCK_GROUPS.length} active wallets
            </p>
          </div>
          <button
            onClick={() => navigate('/create-group')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
              color: '#FFFFFF', border: 'none', borderRadius: 12,
              padding: '9px 16px', fontSize: 13, fontWeight: 700,
              cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.30)',
              letterSpacing: '0.01em',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            New Group
          </button>
        </div>



        {/* ── Group Cards ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {MOCK_GROUPS.map((group, index) => (
            <GroupCard key={group.id} group={group} index={index} onClick={() => navigate(`/groups/${group.id}`)} />
          ))}
        </div>

        {/* ── Quick Action Buttons ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 22 }}>
          {/* Create Group */}
          <button
            onClick={() => navigate('/create-group')}
            style={{
              background: '#FFFFFF',
              border: '1.5px solid #E5E7EB',
              borderRadius: 18, padding: '18px 14px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
              cursor: 'pointer',
              boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.97)')}
            onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <div style={{
              width: 46, height: 46, borderRadius: 14,
              background: 'linear-gradient(135deg, #DBEAFE, #EFF6FF)',
              border: '1px solid #BFDBFE',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#111827' }}>Create Group</div>
              <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2, fontWeight: 500 }}>Start a new wallet</div>
            </div>
          </button>

          {/* Join Group */}
          <button
            onClick={() => navigate('/join-group')}
            style={{
              background: '#FFFFFF',
              border: '1.5px solid #E5E7EB',
              borderRadius: 18, padding: '18px 14px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
              cursor: 'pointer',
              boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.97)')}
            onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <div style={{
              width: 46, height: 46, borderRadius: 14,
              background: 'linear-gradient(135deg, #EDE9FE, #F5F3FF)',
              border: '1px solid #C4B5FD',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#111827' }}>Join Group</div>
              <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2, fontWeight: 500 }}>Enter invite code</div>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}

// ── Group Card ──────────────────────────────────────────────────
function GroupCard({ group, index, onClick }: { group: Group; index: number; onClick: () => void }) {
  const usedPct = pct(group.balance, group.cap);
  const remaining = group.cap - group.balance;
  const isHealthy = usedPct >= 50;

  // Staggered subtle animation delay via inline style trick
  const animDelay = `${index * 0.04}s`;

  return (
    <div
      onClick={onClick}
      style={{
        background: '#FFFFFF',
        borderRadius: 22,
        border: '1px solid #F0EEF8',
        boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
        animationDelay: animDelay,
      }}
      onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.985)'; e.currentTarget.style.boxShadow = '0 1px 6px rgba(0,0,0,0.08)'; }}
      onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.06)'; }}
    >
      {/* Coloured top accent bar */}
      <div style={{ height: 4, background: `linear-gradient(90deg, ${group.themeColor}, ${group.cardBorder})` }} />

      <div style={{ padding: '16px 18px 18px' }}>
        {/* Row 1: Icon + Name + Amount */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
          {/* Icon */}
          <div style={{
            width: 52, height: 52, borderRadius: 16, flexShrink: 0,
            background: group.cardBg,
            border: `1.5px solid ${group.cardBorder}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 4px 12px ${group.themeColor}22`,
          }}>
            <EmojiBadge name={group.icon} bg="transparent" color={group.iconBg} size={28} shape="none" />
          </div>

          {/* Name + category + members */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#111827', letterSpacing: '-0.01em' }}>
              {group.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
              <span style={{
                fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                background: group.cardBg, color: group.themeColor,
                padding: '2px 7px', borderRadius: 6,
                border: `1px solid ${group.cardBorder}`,
              }}>
                {group.category}
              </span>
              <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500 }}>
                {group.members.length} members
              </span>
            </div>
          </div>

          {/* Balance + chevron */}
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: 17, fontWeight: 900, color: '#111827', letterSpacing: '-0.02em' }}>
              {formatINR(group.balance)}
            </div>
            <div style={{ color: '#D1D5DB', marginTop: 2 }}>
              <Chevron />
            </div>
          </div>
        </div>

        {/* Spent this month */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 14 }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600 }}>
            {formatINR(group.spentThisMonth)} this month
          </span>
        </div>


        {/* Progress bar */}
        <div style={{ height: 7, background: '#F3F4F6', borderRadius: 99, overflow: 'hidden', marginBottom: 8 }}>
          <div style={{
            height: '100%',
            width: `${usedPct}%`,
            background: `linear-gradient(90deg, ${group.themeColor}CC, ${group.themeColor})`,
            borderRadius: 99,
            transition: 'width 0.5s ease',
            boxShadow: `0 0 8px ${group.themeColor}55`,
          }} />
        </div>

        {/* Footer: funded % + cap left */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: group.themeColor, boxShadow: `0 0 4px ${group.themeColor}` }} />
            <span style={{ fontSize: 12, color: group.themeColor, fontWeight: 800 }}>
              {usedPct}% funded
            </span>
          </div>
          <span style={{
            fontSize: 11, fontWeight: 700,
            color: isHealthy ? '#059669' : '#EA580C',
            background: isHealthy ? '#F0FDF4' : '#FFF7ED',
            padding: '3px 9px', borderRadius: 8,
            border: `1px solid ${isHealthy ? '#D1FAE5' : '#FED7AA'}`,
          }}>
            {formatINR(remaining)} left
          </span>
        </div>
      </div>
    </div>
  );
}
