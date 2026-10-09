import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatINR } from '../data/mockData';
import { EmojiBadge } from '../components/EmojiBadge';

export interface ActivityTx {
  id: string;
  title: string;
  groupName: string;
  groupId: string;
  groupIcon: string;
  groupColor: string;
  category: string;
  member: string;
  amount: number;
  type: 'payment' | 'contribution' | 'refund';
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  dateLabel: 'Today' | 'Yesterday' | '5 Oct 2026' | '3 Oct 2026' | '28 Sep 2026';
  dateSort: number;
}

const ALL_ACTIVITY_TXS: ActivityTx[] = [
  // ── Flatmates ──
  {
    id: 'tx_1',
    title: 'ABC Restaurant',
    groupName: 'Flatmates',
    groupId: 'g1',
    groupIcon: 'flatmates',
    groupColor: '#2563EB',
    category: 'Food',
    member: 'Mrunali',
    amount: -650,
    type: 'payment',
    status: 'SUCCESS',
    dateLabel: 'Today',
    dateSort: 10,
  },
  {
    id: 'tx_2',
    title: 'CoWallet Group Pool',
    groupName: 'Flatmates',
    groupId: 'g1',
    groupIcon: 'flatmates',
    groupColor: '#2563EB',
    category: 'Contribution',
    member: 'Mrunali',
    amount: 2000,
    type: 'contribution',
    status: 'SUCCESS',
    dateLabel: 'Today',
    dateSort: 9,
  },
  {
    id: 'tx_3',
    title: 'CoWallet Group Pool',
    groupName: 'Flatmates',
    groupId: 'g1',
    groupIcon: 'flatmates',
    groupColor: '#2563EB',
    category: 'Contribution',
    member: 'Mrunali',
    amount: 3000,
    type: 'contribution',
    status: 'SUCCESS',
    dateLabel: 'Today',
    dateSort: 8,
  },
  {
    id: 'tx_4',
    title: 'CoWallet Group Pool',
    groupName: 'Flatmates',
    groupId: 'g1',
    groupIcon: 'flatmates',
    groupColor: '#2563EB',
    category: 'Contribution',
    member: 'Gaurang',
    amount: 3000,
    type: 'contribution',
    status: 'SUCCESS',
    dateLabel: 'Yesterday',
    dateSort: 7,
  },
  {
    id: 'tx_5',
    title: 'CoWallet Group Pool',
    groupName: 'Flatmates',
    groupId: 'g1',
    groupIcon: 'flatmates',
    groupColor: '#2563EB',
    category: 'Contribution',
    member: 'Nikhil',
    amount: 2000,
    type: 'contribution',
    status: 'SUCCESS',
    dateLabel: 'Yesterday',
    dateSort: 6,
  },
  {
    id: 'tx_6',
    title: 'CoWallet Group Pool',
    groupName: 'Flatmates',
    groupId: 'g1',
    groupIcon: 'flatmates',
    groupColor: '#2563EB',
    category: 'Contribution',
    member: 'Ansha',
    amount: 2000,
    type: 'contribution',
    status: 'SUCCESS',
    dateLabel: 'Yesterday',
    dateSort: 5,
  },
  {
    id: 'tx_7',
    title: 'Uber Airport & Metro',
    groupName: 'Flatmates',
    groupId: 'g1',
    groupIcon: 'flatmates',
    groupColor: '#2563EB',
    category: 'Transport',
    member: 'Gaurang',
    amount: -850,
    type: 'payment',
    status: 'SUCCESS',
    dateLabel: '5 Oct 2026',
    dateSort: 4,
  },
  {
    id: 'tx_8',
    title: 'Tata Power & Fiber',
    groupName: 'Flatmates',
    groupId: 'g1',
    groupIcon: 'flatmates',
    groupColor: '#2563EB',
    category: 'Bills',
    member: 'Nikhil',
    amount: -900,
    type: 'payment',
    status: 'SUCCESS',
    dateLabel: '5 Oct 2026',
    dateSort: 3,
  },

  // ── Ganpati Group ──
  {
    id: 'tx_9',
    title: 'Prasad & Flower Garland',
    groupName: 'Ganpati Group',
    groupId: 'g2',
    groupIcon: 'ganpati',
    groupColor: '#7C3AED',
    category: 'Puja Items',
    member: 'Sneha',
    amount: -1200,
    type: 'payment',
    status: 'SUCCESS',
    dateLabel: 'Today',
    dateSort: 10,
  },
  {
    id: 'tx_10',
    title: 'Modak & Laddoo Catering',
    groupName: 'Ganpati Group',
    groupId: 'g2',
    groupIcon: 'ganpati',
    groupColor: '#7C3AED',
    category: 'Sweets',
    member: 'Vikram',
    amount: -2400,
    type: 'payment',
    status: 'SUCCESS',
    dateLabel: 'Yesterday',
    dateSort: 7,
  },
  {
    id: 'tx_11',
    title: 'Festival Pool Contribution',
    groupName: 'Ganpati Group',
    groupId: 'g2',
    groupIcon: 'ganpati',
    groupColor: '#7C3AED',
    category: 'Contribution',
    member: 'Aarav',
    amount: 5000,
    type: 'contribution',
    status: 'SUCCESS',
    dateLabel: '3 Oct 2026',
    dateSort: 2,
  },

  // ── Weekend Group ──
  {
    id: 'tx_12',
    title: 'Highway Fastag & Fuel',
    groupName: 'Weekend Group',
    groupId: 'g3',
    groupIcon: 'weekend',
    groupColor: '#0D9488',
    category: 'Transport',
    member: 'Nikhil',
    amount: -1150,
    type: 'payment',
    status: 'SUCCESS',
    dateLabel: 'Today',
    dateSort: 10,
  },
  {
    id: 'tx_13',
    title: 'Resort Booking Advance',
    groupName: 'Weekend Group',
    groupId: 'g3',
    groupIcon: 'weekend',
    groupColor: '#0D9488',
    category: 'Stay',
    member: 'Priya',
    amount: -6800,
    type: 'payment',
    status: 'SUCCESS',
    dateLabel: 'Yesterday',
    dateSort: 7,
  },
  {
    id: 'tx_14',
    title: 'Goa Trip Contribution',
    groupName: 'Weekend Group',
    groupId: 'g3',
    groupIcon: 'weekend',
    groupColor: '#0D9488',
    category: 'Contribution',
    member: 'Mrunali',
    amount: 3500,
    type: 'contribution',
    status: 'SUCCESS',
    dateLabel: '3 Oct 2026',
    dateSort: 2,
  },
  {
    id: 'tx_15',
    title: 'Activity Refund (Kayaking)',
    groupName: 'Weekend Group',
    groupId: 'g3',
    groupIcon: 'weekend',
    groupColor: '#0D9488',
    category: 'Refund',
    member: 'Goa Adventures',
    amount: 800,
    type: 'refund',
    status: 'SUCCESS',
    dateLabel: '28 Sep 2026',
    dateSort: 1,
  },
];

export function Activity() {
  const navigate = useNavigate();

  // Filter States
  const [activeTab, setActiveTab] = useState<'All' | 'Payments' | 'Contributions' | 'Refunds'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'group_first' | 'date_first'>('group_first');
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Group list for tabs
  const groupNames = ['All', 'Flatmates', 'Ganpati Group', 'Weekend Group'];

  // Toggle group accordion
  const toggleGroupCollapse = (grp: string) => {
    setCollapsedGroups(prev => ({ ...prev, [grp]: !prev[grp] }));
  };

  // Filtered transactions
  const filteredTxs = useMemo(() => {
    return ALL_ACTIVITY_TXS.filter(tx => {
      // Tab filter
      if (activeTab === 'Payments' && tx.type !== 'payment') return false;
      if (activeTab === 'Contributions' && tx.type !== 'contribution') return false;
      if (activeTab === 'Refunds' && tx.type !== 'refund') return false;

      // Group chip filter
      if (selectedGroup !== 'All' && tx.groupName !== selectedGroup) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = tx.title.toLowerCase().includes(q);
        const matchesGroup = tx.groupName.toLowerCase().includes(q);
        const matchesMember = tx.member.toLowerCase().includes(q);
        const matchesCategory = tx.category.toLowerCase().includes(q);
        if (!matchesTitle && !matchesGroup && !matchesMember && !matchesCategory) return false;
      }

      return true;
    });
  }, [activeTab, selectedGroup, searchQuery]);

  // Grouped by Group first, then Date inside
  const groupedByGroupAndDate = useMemo(() => {
    const groups: Record<string, {
      groupId: string;
      groupIcon: string;
      groupColor: string;
      dates: Record<string, ActivityTx[]>;
      totalAmount: number;
      txCount: number;
    }> = {};

    filteredTxs.forEach(tx => {
      if (!groups[tx.groupName]) {
        groups[tx.groupName] = {
          groupId: tx.groupId,
          groupIcon: tx.groupIcon,
          groupColor: tx.groupColor,
          dates: {},
          totalAmount: 0,
          txCount: 0,
        };
      }
      groups[tx.groupName].totalAmount += tx.amount;
      groups[tx.groupName].txCount += 1;

      if (!groups[tx.groupName].dates[tx.dateLabel]) {
        groups[tx.groupName].dates[tx.dateLabel] = [];
      }
      groups[tx.groupName].dates[tx.dateLabel].push(tx);
    });

    return groups;
  }, [filteredTxs]);

  // Grouped by Date first, then Group inside
  const groupedByDateAndGroup = useMemo(() => {
    const dates: Record<string, Record<string, ActivityTx[]>> = {};

    filteredTxs.forEach(tx => {
      if (!dates[tx.dateLabel]) {
        dates[tx.dateLabel] = {};
      }
      if (!dates[tx.dateLabel][tx.groupName]) {
        dates[tx.dateLabel][tx.groupName] = [];
      }
      dates[tx.dateLabel][tx.groupName].push(tx);
    });

    return dates;
  }, [filteredTxs]);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FAF8F5',
      color: '#111827',
      padding: '16px 16px 100px',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    }}>
      {/* ── Top Header ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 18,
      }}>
        <h1 style={{
          fontSize: 26,
          fontWeight: 800,
          color: '#111827',
          margin: 0,
          letterSpacing: '-0.02em',
        }}>
          Activity
        </h1>

        <button
          onClick={() => setShowFilterModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: 12,
            padding: '7px 14px',
            color: '#111827',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"
              stroke="#16A34A" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Filters
        </button>
      </div>

      {/* ── Search Bar ── */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #ECE7E1',
        borderRadius: 14,
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16,
        boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ color: '#9CA3AF', flexShrink: 0 }}>
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.2" />
          <path d="M20 20L16 16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search merchant, group, member, ID..."
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: 13.5,
            color: '#111827',
          }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', fontSize: 14 }}
          >
            ✕
          </button>
        )}
      </div>

      {/* ── Type Filter Tabs Pill Track (Clean Light Theme) ── */}
      <div style={{
        background: '#EDE8E1',
        border: '1px solid #E5E7EB',
        borderRadius: 24,
        padding: '4px',
        display: 'flex',
        alignItems: 'center',
        marginBottom: 14,
      }}>
        {(['All', 'Payments', 'Contributions', 'Refunds'] as const).map(tab => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: '8px 4px',
                borderRadius: 20,
                background: isActive ? '#10B981' : 'transparent',
                color: isActive ? '#FFFFFF' : '#6B7280',
                border: 'none',
                fontSize: 12.5,
                fontWeight: isActive ? 800 : 600,
                cursor: 'pointer',
                textAlign: 'center',
                boxShadow: isActive ? '0 2px 6px rgba(16, 185, 129, 0.3)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* ── Quick Group Selector Chips & Mode Switcher ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 18,
        gap: 8,
      }}>
        {/* Horizontal Group Chips */}
        <div style={{
          display: 'flex',
          gap: 6,
          overflowX: 'auto',
          scrollbarWidth: 'none',
          paddingBottom: 2,
          flex: 1,
        }}>
          {groupNames.map(grp => {
            const isSel = selectedGroup === grp;
            return (
              <button
                key={grp}
                onClick={() => setSelectedGroup(grp)}
                style={{
                  flexShrink: 0,
                  padding: '6px 14px',
                  borderRadius: 12,
                  background: isSel ? '#111827' : '#FFFFFF',
                  color: isSel ? '#FFFFFF' : '#4B5563',
                  border: isSel ? '1px solid #111827' : '1px solid #E5E7EB',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                  fontSize: 11.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {grp}
              </button>
            );
          })}
        </div>

        {/* View Mode Switcher Button */}
        <button
          onClick={() => setViewMode(prev => prev === 'group_first' ? 'date_first' : 'group_first')}
          title="Toggle view grouping"
          style={{
            flexShrink: 0,
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: 10,
            padding: '6px 11px',
            fontSize: 11,
            color: '#374151',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
          }}
        >
          {viewMode === 'group_first' ? 'By Group' : 'By Date'}
        </button>
      </div>

      {/* ── Transaction List: Group & Date Wise ── */}
      {filteredTxs.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#6B7280',
        }}>
          <div style={{ fontSize: 36, marginBottom: 10, color: '#D1D5DB' }}>◌</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>No transactions found</div>
          <div style={{ fontSize: 12, marginTop: 4 }}>Try clearing search or changing the filter.</div>
        </div>
      ) : viewMode === 'group_first' ? (
        /* MODE 1: GROUP-FIRST, DATE-WISE INSIDE */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {Object.entries(groupedByGroupAndDate).map(([grpName, grpData]) => {
            const isCollapsed = !!collapsedGroups[grpName];

            return (
              <div key={grpName} style={{
                background: '#FFFFFF',
                borderRadius: 20,
                border: '1px solid #ECE7E1',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}>
                {/* ── Group Section Header Card (Tap to collapse) ── */}
                <button
                  onClick={() => toggleGroupCollapse(grpName)}
                  style={{
                    width: '100%',
                    background: '#FFFFFF',
                    border: 'none',
                    borderBottom: isCollapsed ? 'none' : '1px solid #F3F4F6',
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 38,
                      height: 38,
                      borderRadius: '50%',
                      background: grpData.groupColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                    }}>
                      <EmojiBadge name={grpData.groupIcon} size={20} shape="none" color="#FFFFFF" />
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: '#111827' }}>
                        {grpName}
                      </div>
                      <div style={{ fontSize: 11, color: '#6B7280', marginTop: 1, fontWeight: 500 }}>
                        {grpData.txCount} transactions
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      fontSize: 12,
                      fontWeight: 800,
                      color: grpData.totalAmount >= 0 ? '#059669' : '#DC2626',
                      background: grpData.totalAmount >= 0 ? '#DCFCE7' : '#FEE2E2',
                      padding: '3px 9px',
                      borderRadius: 8,
                      border: `1px solid ${grpData.totalAmount >= 0 ? '#86EFAC' : '#FECACA'}`,
                    }}>
                      {grpData.totalAmount >= 0 ? '+' : ''}{formatINR(grpData.totalAmount)}
                    </span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      style={{
                        transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                        color: '#9CA3AF',
                      }}
                    >
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </button>

                {/* ── Date-wise Transactions inside Group ── */}
                {!isCollapsed && (
                  <div style={{ padding: '14px 14px 8px', background: '#FFFFFF' }}>
                    {Object.entries(grpData.dates).map(([dateLabel, txs]) => (
                      <div key={dateLabel} style={{ marginBottom: 14 }}>
                        {/* Date Divider Badge */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          fontSize: 11,
                          fontWeight: 800,
                          color: '#6B7280',
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase',
                          marginBottom: 8,
                          paddingLeft: 4,
                        }}>
                          <span>• {dateLabel}</span>
                          <div style={{ flex: 1, height: 1, background: '#F3F4F6' }} />
                        </div>

                        {/* Transaction Cards */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {txs.map(tx => (
                            <TransactionCard key={tx.id} tx={tx} onClick={() => navigate(`/groups/${tx.groupId}`)} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* MODE 2: DATE-FIRST, GROUP-WISE INSIDE */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {Object.entries(groupedByDateAndGroup).map(([dateLabel, grpMap]) => (
            <div key={dateLabel}>
              {/* Date Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 12,
                fontWeight: 800,
                color: '#374151',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginBottom: 10,
              }}>
                <span>{dateLabel}</span>
                <div style={{ flex: 1, height: 1, background: '#ECE7E1' }} />
              </div>

              {/* Groups within this Date */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {Object.entries(grpMap).map(([grpName, txs]) => (
                  <div key={grpName} style={{
                    background: '#FFFFFF',
                    borderRadius: 18,
                    border: '1px solid #ECE7E1',
                    padding: '14px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                  }}>
                    {/* Small Group Pill Header */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 12,
                      fontWeight: 800,
                      color: '#2563EB',
                      marginBottom: 10,
                    }}>
                      <span>{grpName}</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {txs.map(tx => (
                        <TransactionCard key={tx.id} tx={tx} onClick={() => navigate(`/groups/${tx.groupId}`)} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Filters Modal Sheet (Light & Multicolor) ── */}
      {showFilterModal && (
        <div
          onClick={() => setShowFilterModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 60,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 390,
              background: '#FFFFFF',
              borderTop: '1px solid #E5E7EB',
              borderRadius: '24px 24px 0 0',
              padding: '20px 20px 34px',
              animation: 'slideUp 0.25s cubic-bezier(0.16,1,0.3,1)',
              color: '#111827',
              boxShadow: '0 -10px 40px rgba(0,0,0,0.12)',
            }}
          >
            {/* Handle */}
            <div style={{ width: 36, height: 4, background: '#D1D5DB', borderRadius: 2, margin: '0 auto 16px' }} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#111827' }}>Filter Activity</h3>
              <button
                onClick={() => setShowFilterModal(false)}
                style={{ background: '#F3F4F6', border: 'none', borderRadius: '50%', width: 30, height: 30, color: '#4B5563', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* Filter by Group */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Group
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                {groupNames.map(g => {
                  const isSel = selectedGroup === g;
                  return (
                    <button
                      key={g}
                      onClick={() => setSelectedGroup(g)}
                      style={{
                        padding: '7px 14px',
                        borderRadius: 12,
                        background: isSel ? '#10B981' : '#F3F4F6',
                        color: isSel ? '#FFFFFF' : '#374151',
                        border: 'none',
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: isSel ? '0 2px 6px rgba(16, 185, 129, 0.3)' : 'none',
                      }}
                    >
                      {g}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter by Type */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Transaction Type
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                {(['All', 'Payments', 'Contributions', 'Refunds'] as const).map(t => {
                  const isSel = activeTab === t;
                  return (
                    <button
                      key={t}
                      onClick={() => setActiveTab(t)}
                      style={{
                        padding: '7px 14px',
                        borderRadius: 12,
                        background: isSel ? '#10B981' : '#F3F4F6',
                        color: isSel ? '#FFFFFF' : '#374151',
                        border: 'none',
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: isSel ? '0 2px 6px rgba(16, 185, 129, 0.3)' : 'none',
                      }}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => {
                  setSelectedGroup('All');
                  setActiveTab('All');
                  setSearchQuery('');
                  setShowFilterModal(false);
                }}
                style={{
                  flex: 1,
                  background: '#F3F4F6',
                  color: '#4B5563',
                  border: 'none',
                  borderRadius: 12,
                  padding: '12px 0',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Reset
              </button>
              <button
                onClick={() => setShowFilterModal(false)}
                style={{
                  flex: 1,
                  background: '#10B981',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 12,
                  padding: '12px 0',
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)',
                }}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Single Transaction Card (Clean White & Multicolor Theme) ──
function TransactionCard({ tx, onClick }: { tx: ActivityTx; onClick: () => void }) {
  const isCredit = tx.amount > 0;

  return (
    <div
      onClick={onClick}
      style={{
        background: '#FAF8F5',
        border: '1px solid #ECE7E1',
        borderRadius: 16,
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        cursor: 'pointer',
        transition: 'transform 0.15s ease, background 0.15s ease',
      }}
      onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.98)')}
      onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
    >
      {/* ── Left Icon Box (↗ or ↙) ── */}
      <div style={{
        width: 40,
        height: 40,
        borderRadius: 12,
        background: isCredit ? '#DCFCE7' : '#F1F5F9',
        border: isCredit ? '1px solid #86EFAC' : '1px solid #E2E8F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        {isCredit ? (
          /* Credit: Down-Left Arrow ↙ */
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M17 7L7 17M7 17H17M7 17V7" stroke="#16A34A" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          /* Debit: Up-Right Arrow ↗ */
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="#374151" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>

      {/* ── Center Details ── */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14,
          fontWeight: 700,
          color: '#111827',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {tx.title}
        </div>
        <div style={{
          fontSize: 11.5,
          color: '#6B7280',
          marginTop: 2,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {tx.groupName} · {tx.category} · {tx.member}
        </div>
      </div>

      {/* ── Right Amount + Status ── */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{
          fontSize: 14.5,
          fontWeight: 800,
          color: isCredit ? '#059669' : '#111827',
          letterSpacing: '-0.01em',
        }}>
          {isCredit ? '+' : '−'}{formatINR(Math.abs(tx.amount))}
        </div>
        <div style={{
          fontSize: 10,
          fontWeight: 700,
          color: tx.status === 'PENDING' ? '#EA580C' : '#059669',
          letterSpacing: '0.02em',
          marginTop: 1,
        }}>
          {tx.status}
        </div>
      </div>
    </div>
  );
}
