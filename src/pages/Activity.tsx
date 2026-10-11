import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  formatINR, CURRENT_USER, MOCK_PERSONAL_PAYMENTS,
  type PersonalPayment
} from '../data/mockData';
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
    groupColor: '#16A34A',
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
    groupColor: '#16A34A',
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
    groupColor: '#16A34A',
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
    groupColor: '#16A34A',
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

  // Top-level History Source Switcher: Group Payments vs Personal UPI
  const [historySource, setHistorySource] = useState<'groups' | 'personal'>('groups');
  const [personalTab, setPersonalTab] = useState<'All' | 'Debited' | 'Credited' | 'Top-ups'>('All');
  const [selectedPersonalTx, setSelectedPersonalTx] = useState<PersonalPayment | null>(null);

  // Personal live balance in activity
  const [personalBalance, setPersonalBalance] = useState(CURRENT_USER.personalBalance);
  const [isFetchingBal, setIsFetchingBal] = useState(false);
  const [lastBalFetch, setLastBalFetch] = useState<string | null>('1:05 PM');
  const [balFetchSuccess, setBalFetchSuccess] = useState(false);

  const handleFetchBal = () => {
    setIsFetchingBal(true);
    setTimeout(() => {
      setIsFetchingBal(false);
      setPersonalBalance(3250);
      const now = new Date();
      setLastBalFetch(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setBalFetchSuccess(true);
      setTimeout(() => setBalFetchSuccess(false), 2200);
    }, 750);
  };

  const handleOpenPaymentHub = () => {
    window.dispatchEvent(new CustomEvent('cowallet-open-payment-modal'));
  };

  // Group list for tabs
  const groupNames = ['All', 'Flatmates', 'Ganpati Group', 'Weekend Group'];

  // Toggle group accordion
  const toggleGroupCollapse = (grp: string) => {
    setCollapsedGroups(prev => ({ ...prev, [grp]: !prev[grp] }));
  };

  // Filtered personal transactions
  const filteredPersonalPayments = useMemo(() => {
    return MOCK_PERSONAL_PAYMENTS.filter(tx => {
      if (personalTab === 'Debited' && tx.dir !== 'paid') return false;
      if (personalTab === 'Credited' && tx.dir !== 'received') return false;
      if (personalTab === 'Top-ups' && tx.dir !== 'added') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesMerchant = tx.merchant.toLowerCase().includes(q);
        const matchesNote = tx.note.toLowerCase().includes(q);
        const matchesCategory = (tx.category || '').toLowerCase().includes(q);
        const matchesRef = (tx.upiRef || '').toLowerCase().includes(q);
        if (!matchesMerchant && !matchesNote && !matchesCategory && !matchesRef) return false;
      }
      return true;
    });
  }, [personalTab, searchQuery]);

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
        marginBottom: 16,
      }}>
        <div>
          <h1 style={{
            fontSize: 26,
            fontWeight: 800,
            color: '#111827',
            margin: 0,
            letterSpacing: '-0.02em',
          }}>
            Activity
          </h1>
          <p style={{ fontSize: 12, color: '#6B7280', margin: '3px 0 0', fontWeight: 500 }}>
            Track group expenses & personal UPI payments
          </p>
        </div>

        {historySource === 'groups' ? (
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
        ) : (
          <button
            onClick={handleOpenPaymentHub}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              border: 'none',
              borderRadius: 12,
              padding: '7px 14px',
              color: '#FFFFFF',
              fontSize: 12.5,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 3px 10px rgba(37, 99, 235, 0.28)',
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L15 22L11 13L2 9L22 2Z" fill="white" stroke="white" strokeWidth="1"/>
            </svg>
            Pay UPI
          </button>
        )}
      </div>

      {/* ── Top Level Selector: Group Payment History vs Personal Payment History ── */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '1.5px solid rgba(255, 255, 255, 0.95)',
        borderRadius: 16,
        padding: 4,
        display: 'flex',
        gap: 6,
        marginBottom: 16,
        boxShadow: '0 4px 20px rgba(15, 23, 42, 0.05)',
      }}>
        <button
          onClick={() => setHistorySource('groups')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 7,
            padding: '10px 14px',
            borderRadius: 12,
            border: 'none',
            background: historySource === 'groups' ? 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' : 'transparent',
            color: historySource === 'groups' ? '#FFFFFF' : '#4B5563',
            fontSize: 13,
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: historySource === 'groups' ? '0 4px 14px rgba(37, 99, 235, 0.28)' : 'none',
            transition: 'all 0.18s ease',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
          </svg>
          <span>Group Payments</span>
        </button>

        <button
          onClick={() => setHistorySource('personal')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 7,
            padding: '10px 14px',
            borderRadius: 12,
            border: 'none',
            background: historySource === 'personal' ? 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)' : 'transparent',
            color: historySource === 'personal' ? '#FFFFFF' : '#4B5563',
            fontSize: 13,
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: historySource === 'personal' ? '0 4px 14px rgba(124, 58, 237, 0.28)' : 'none',
            transition: 'all 0.18s ease',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <rect x="2" y="5" width="20" height="14" rx="3"/>
            <line x1="2" y1="10" x2="22" y2="10"/>
            <circle cx="7" cy="15" r="1.5" fill="currentColor"/>
          </svg>
          <span>Personal UPI</span>
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

      {/* ── Main View: Group Payments vs Personal UPI ── */}
      {historySource === 'groups' ? (
        <>
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
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(16px) saturate(180%)',
                WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                borderRadius: 22,
                border: '1.5px solid rgba(255, 255, 255, 0.95)',
                overflow: 'hidden',
                boxShadow: '0 8px 30px rgba(15, 23, 42, 0.05), inset 0 1px 1.5px rgba(255, 255, 255, 0.95)',
              }}>
                {/* ── Group Section Header Card (Tap to collapse) ── */}
                <button
                  onClick={() => toggleGroupCollapse(grpName)}
                  style={{
                    width: '100%',
                    background: `linear-gradient(135deg, ${grpData.groupColor}12 0%, rgba(255, 255, 255, 0.90) 100%)`,
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: 'none',
                    borderBottom: isCollapsed ? 'none' : '1px solid rgba(243, 244, 246, 0.8)',
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
        </>
      ) : (
        /* ══════════════════════════════════════════════════════
            MODE B: PERSONAL UPI HISTORY & FEATURES
            ══════════════════════════════════════════════════════ */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Personal UPI Summary Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 10,
          }}>
            <div style={{
              background: 'rgba(240, 253, 244, 0.9)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(134, 239, 172, 0.85)',
              borderRadius: 16,
              padding: '12px 14px',
            }}>
              <div style={{ fontSize: 11, color: '#166534', fontWeight: 600 }}>Total Debited (Spent)</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#16A34A', marginTop: 3 }}>-₹4,675.00</div>
            </div>
            <div style={{
              background: 'rgba(254, 242, 242, 0.9)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(254, 202, 202, 0.85)',
              borderRadius: 16,
              padding: '12px 14px',
            }}>
              <div style={{ fontSize: 11, color: '#991B1B', fontWeight: 600 }}>Total Credited (Inflow)</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#DC2626', marginTop: 3 }}>+₹16,300.00</div>
            </div>
          </div>

          {/* Personal Filter Tabs */}
          <div style={{
            background: '#EDE8E1',
            border: '1px solid #E5E7EB',
            borderRadius: 24,
            padding: 4,
            display: 'flex',
            alignItems: 'center',
          }}>
            {(['All', 'Debited', 'Credited', 'Top-ups'] as const).map(tab => {
              const isActive = personalTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setPersonalTab(tab)}
                  style={{
                    flex: 1,
                    padding: '8px 4px',
                    borderRadius: 20,
                    background: isActive ? '#7C3AED' : 'transparent',
                    color: isActive ? '#FFFFFF' : '#6B7280',
                    border: 'none',
                    fontSize: 12.5,
                    fontWeight: 800,
                    cursor: 'pointer',
                    textAlign: 'center',
                    boxShadow: isActive ? '0 2px 6px rgba(124, 58, 237, 0.3)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Personal Payment History List */}
          {filteredPersonalPayments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px 20px', color: '#6B7280' }}>
              <div style={{ fontSize: 32, marginBottom: 8, color: '#D1D5DB' }}>◌</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>No personal transactions found</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>Try clearing the search query or selecting a different filter.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filteredPersonalPayments.map(tx => {
                const isDebit = tx.dir === 'paid';
                return (
                  <div
                    key={tx.id}
                    onClick={() => setSelectedPersonalTx(tx)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.85)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      border: '1.5px solid rgba(255, 255, 255, 0.95)',
                      borderRadius: 16,
                      padding: '13px 15px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
                      transition: 'transform 0.15s ease, background 0.15s ease',
                    }}
                    onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.985)')}
                    onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    {/* Left Icon: Green for Debit / Red for Credit */}
                    <div style={{
                      width: 42,
                      height: 42,
                      borderRadius: 12,
                      background: isDebit ? '#DCFCE7' : '#FEE2E2',
                      border: isDebit ? '1px solid #86EFAC' : '1px solid #FECACA',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {isDebit ? (
                        /* Debit: Outflow ↗ in Green */
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M7 17L17 7M17 7H7M17 7V17" stroke="#16A34A" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        /* Credit: Inflow ↙ in Red */
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M17 7L7 17M7 17H17M7 17V7" stroke="#DC2626" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>

                    {/* Transaction Details */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {tx.merchant}
                      </div>
                      <div style={{ fontSize: 11.5, color: '#6B7280', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span>{tx.note}</span>
                        <span>•</span>
                        <span style={{ color: '#7C3AED', fontWeight: 600 }}>{tx.paymentMode || 'UPI'}</span>
                      </div>
                      <div style={{ fontSize: 10.5, color: '#9CA3AF', marginTop: 2 }}>
                        {tx.date} · {tx.account || 'HDFC Bank ••4921'}
                      </div>
                    </div>

                    {/* Amount & Status: Debit in Green / Credit in Red */}
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{
                        fontSize: 15,
                        fontWeight: 800,
                        color: isDebit ? '#16A34A' : '#DC2626',
                        letterSpacing: '-0.01em',
                      }}>
                        {isDebit ? '-' : '+'}{formatINR(tx.amount)}
                      </div>
                      <div style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: '#16A34A',
                        background: '#DCFCE7',
                        padding: '2px 6px',
                        borderRadius: 6,
                        display: 'inline-block',
                        marginTop: 3,
                      }}>
                        SUCCESS
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Personal Transaction Receipt Modal Sheet ── */}
      {selectedPersonalTx && (
        <div
          onClick={() => setSelectedPersonalTx(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 80,
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            padding: '0 0 max(10px, env(safe-area-inset-bottom, 10px)) 0',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 390,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(28px) saturate(190%)',
              WebkitBackdropFilter: 'blur(28px) saturate(190%)',
              borderRadius: 24,
              border: '1.5px solid rgba(255, 255, 255, 0.95)',
              padding: '20px 20px 28px',
              boxShadow: '0 24px 60px rgba(15, 23, 42, 0.22)',
            }}
          >
            <div style={{ width: 36, height: 4, background: '#D1D5DB', borderRadius: 2, margin: '0 auto 16px' }} />

            <div style={{ textAlign: 'center', marginBottom: 18 }}>
              <div style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: selectedPersonalTx.dir === 'paid' ? '#DCFCE7' : '#FEE2E2',
                border: selectedPersonalTx.dir === 'paid' ? '2px solid #86EFAC' : '2px solid #FECACA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 10px',
              }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17L4 12" stroke={selectedPersonalTx.dir === 'paid' ? '#16A34A' : '#DC2626'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={{ fontSize: 24, fontWeight: 900, color: selectedPersonalTx.dir === 'paid' ? '#16A34A' : '#DC2626' }}>
                {selectedPersonalTx.dir === 'paid' ? '-' : '+'}{formatINR(selectedPersonalTx.amount)}
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#111827', marginTop: 4 }}>
                {selectedPersonalTx.merchant}
              </div>
              <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>
                {selectedPersonalTx.note}
              </div>
            </div>

            {/* Details Breakdown */}
            <div style={{
              background: '#F8FAFC',
              borderRadius: 14,
              border: '1px solid #E2E8F0',
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              fontSize: 12,
              marginBottom: 18,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6B7280' }}>Account</span>
                <span style={{ fontWeight: 700, color: '#111827' }}>{selectedPersonalTx.account || 'HDFC Bank •••• 4921'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6B7280' }}>UPI Ref / UTR</span>
                <span style={{ fontWeight: 700, color: '#111827' }}>UPI/{selectedPersonalTx.upiRef || '4291829104'}/NPCI</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6B7280' }}>Payment Mode</span>
                <span style={{ fontWeight: 700, color: '#7C3AED' }}>{selectedPersonalTx.paymentMode || 'UPI ID'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6B7280' }}>Timestamp</span>
                <span style={{ fontWeight: 700, color: '#111827' }}>{selectedPersonalTx.date}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6B7280' }}>Status</span>
                <span style={{ fontWeight: 800, color: '#16A34A' }}>Successful (NPCI Verified)</span>
              </div>
            </div>

            {/* Modal Buttons */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => {
                  setSelectedPersonalTx(null);
                  handleOpenPaymentHub();
                }}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 12,
                  padding: '12px 0',
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" fill="white" stroke="white" strokeWidth="1"/>
                </svg>
                Repeat Payment
              </button>
              <button
                onClick={() => setSelectedPersonalTx(null)}
                style={{
                  flex: 1,
                  background: '#F1F5F9',
                  color: '#475569',
                  border: 'none',
                  borderRadius: 12,
                  padding: '12px 0',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Done
              </button>
            </div>
          </div>
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
        background: 'rgba(255, 255, 255, 0.78)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1.5px solid rgba(255, 255, 255, 0.95)',
        borderRadius: 16,
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04), inset 0 1px 1px rgba(255, 255, 255, 0.9)',
        transition: 'transform 0.15s ease, background 0.15s ease',
      }}
      onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.98)')}
      onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
    >
      {/* ── Left Icon Box: Green for Debit / Red for Credit ── */}
      <div style={{
        width: 40,
        height: 40,
        borderRadius: 12,
        background: isCredit ? '#FEE2E2' : '#DCFCE7',
        border: isCredit ? '1px solid #FECACA' : '1px solid #86EFAC',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        {isCredit ? (
          /* Credit: Inflow ↙ in Red */
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M17 7L7 17M7 17H17M7 17V7" stroke="#DC2626" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          /* Debit: Outflow ↗ in Green */
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="#16A34A" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
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

      {/* ── Right Amount + Status: Debit in Green / Credit in Red ── */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{
          fontSize: 14.5,
          fontWeight: 800,
          color: isCredit ? '#DC2626' : '#16A34A',
          letterSpacing: '-0.01em',
        }}>
          {isCredit ? '+' : '−'}{formatINR(Math.abs(tx.amount))}
        </div>
        <div style={{
          fontSize: 10,
          fontWeight: 700,
          color: tx.status === 'PENDING' ? '#7C3AED' : (isCredit ? '#DC2626' : '#16A34A'),
          letterSpacing: '0.02em',
          marginTop: 1,
        }}>
          {tx.status}
        </div>
      </div>
    </div>
  );
}
