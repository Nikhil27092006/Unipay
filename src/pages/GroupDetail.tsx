import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_GROUPS, CURRENT_USER, formatINR } from '../data/mockData';
import { EmojiBadge } from '../components/EmojiBadge';

interface ChatMessage {
  id: string;
  senderName: string;
  senderAvatar: string;
  senderColor: string;
  type: 'text' | 'deposit' | 'spend_request';
  time: string;
  text?: string;
  // For deposit
  depositAmount?: number;
  depositTitle?: string;
  depositTag?: string;
  // For spend request
  spendAmount?: number;
  spendTitle?: string;
  spendStore?: string;
  signaturesCount?: number;
  signaturesNeeded?: number;
  spendStatus?: 'pending' | 'approved' | 'declined';
  userApproved?: boolean;
}

export interface GroupActivityTx {
  id: string;
  title: string;
  category: string;
  member: string;
  memberAvatar?: string;
  amount: number;
  type: 'payment' | 'contribution' | 'refund';
  status: 'SUCCESS' | 'PENDING';
  dateLabel: 'Today' | 'Yesterday' | '5 Oct 2026' | '3 Oct 2026';
  time: string;
}

export function GroupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const group = MOCK_GROUPS.find(g => g.id === id) || MOCK_GROUPS[0];

  // Active top section switcher: 'chat' or 'activity'
  const [activeSectionTab, setActiveSectionTab] = useState<'chat' | 'activity'>('chat');
  const [activityFilter, setActivityFilter] = useState<'all' | 'spent' | 'added' | 'pending'>('all');

  // Active modal state
  const [activeModal, setActiveModal] = useState<'send' | 'spend' | 'qr' | 'members' | null>(null);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [inputText, setInputText] = useState('');
  const [vaultBalance, setVaultBalance] = useState(group.balance);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Form states for modals
  const [sendAmount, setSendAmount] = useState('1000');
  const [sendNote, setSendNote] = useState('Monthly Contribution');
  const [spendAmount, setSpendAmount] = useState('1450');
  const [spendTitle, setSpendTitle] = useState('Kitchen & Cleaning Supplies');
  const [spendStore, setSpendStore] = useState('Reliance Smart Bazaar');
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Initial group activities (date-wise transactions for this group)
  const [groupActivities, setGroupActivities] = useState<GroupActivityTx[]>([
    {
      id: 'gtx_1',
      title: 'Reliance Smart Bazaar',
      category: 'Groceries',
      member: 'Rahul Verma',
      memberAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
      amount: -1450,
      type: 'payment',
      status: 'PENDING',
      dateLabel: 'Today',
      time: '10:05 AM',
    },
    {
      id: 'gtx_2',
      title: 'Monthly Pool Contribution',
      category: 'Pool Contribution',
      member: 'Priya Sharma',
      memberAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
      amount: 5000,
      type: 'contribution',
      status: 'SUCCESS',
      dateLabel: 'Today',
      time: '9:20 AM',
    },
    {
      id: 'gtx_3',
      title: 'ABC Restaurant',
      category: 'Food & Dining',
      member: 'Mrunali',
      memberAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
      amount: -650,
      type: 'payment',
      status: 'SUCCESS',
      dateLabel: 'Today',
      time: '1:15 AM',
    },
    {
      id: 'gtx_4',
      title: 'CoWallet Group Pool',
      category: 'Pool Contribution',
      member: 'Gaurang',
      memberAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
      amount: 3000,
      type: 'contribution',
      status: 'SUCCESS',
      dateLabel: 'Yesterday',
      time: '4:45 PM',
    },
    {
      id: 'gtx_5',
      title: 'Wi-Fi & Broadband Bill',
      category: 'Utilities',
      member: 'Priya Sharma',
      memberAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
      amount: -800,
      type: 'payment',
      status: 'SUCCESS',
      dateLabel: 'Yesterday',
      time: '11:30 AM',
    },
    {
      id: 'gtx_6',
      title: 'CoWallet Group Pool',
      category: 'Pool Contribution',
      member: 'Nikhil (You)',
      memberAvatar: CURRENT_USER.avatar,
      amount: 2000,
      type: 'contribution',
      status: 'SUCCESS',
      dateLabel: 'Yesterday',
      time: '9:15 AM',
    },
    {
      id: 'gtx_7',
      title: 'Supermarket Supplies',
      category: 'Groceries',
      member: 'Sneha Patel',
      memberAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces',
      amount: -2100,
      type: 'payment',
      status: 'SUCCESS',
      dateLabel: '5 Oct 2026',
      time: '3:20 PM',
    },
    {
      id: 'gtx_8',
      title: 'Vault Opening Seed Deposit',
      category: 'Pool Contribution',
      member: 'All Members',
      amount: 10000,
      type: 'contribution',
      status: 'SUCCESS',
      dateLabel: '5 Oct 2026',
      time: '10:00 AM',
    },
  ]);

  // Initial chat feed matching the exact screenshot
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      senderName: 'PRIYA SHARMA',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
      senderColor: '#C026D3',
      type: 'text',
      text: 'Hey everyone! Welcome to the group. Rent and common utilities are tracked here.',
      time: '9:15 AM',
    },
    {
      id: 'm2',
      senderName: 'PRIYA SHARMA',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
      senderColor: '#C026D3',
      type: 'deposit',
      depositAmount: 5000,
      depositTitle: 'Monthly Pool Contribution',
      depositTag: 'Instant UPI Consensus',
      time: '9:20 AM',
    },
    {
      id: 'm3',
      senderName: 'RAHUL VERMA',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
      senderColor: '#0284C7',
      type: 'spend_request',
      spendAmount: 1450,
      spendTitle: 'Monthly Kitchen & Cleaning Essentials',
      spendStore: 'Reliance Smart Bazaar',
      signaturesCount: 1,
      signaturesNeeded: 2,
      spendStatus: 'pending',
      userApproved: false,
      time: '10:05 AM',
    },
    {
      id: 'm4',
      senderName: 'SNEHA PATEL',
      senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces',
      senderColor: '#16A34A',
      type: 'text',
      text: 'Checked the grocery receipt, looks accurate. Voting to approve!',
      time: '10:12 AM',
    },
  ]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (activeSectionTab === 'chat') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeSectionTab]);

  // Handle approving a spend request
  const handleApprove = (msgId: string) => {
    setMessages(prev =>
      prev.map(msg => {
        if (msg.id === msgId && msg.type === 'spend_request') {
          const newCount = (msg.signaturesCount || 1) + 1;
          const isFullyApproved = newCount >= (msg.signaturesNeeded || 2);
          if (isFullyApproved) {
            // Also mark corresponding activity as SUCCESS
            setGroupActivities(acts =>
              acts.map(act => (act.amount === -(msg.spendAmount || 0) ? { ...act, status: 'SUCCESS' } : act))
            );
          }
          return {
            ...msg,
            signaturesCount: newCount,
            spendStatus: isFullyApproved ? 'approved' : 'pending',
            userApproved: true,
          };
        }
        return msg;
      })
    );
  };

  // Handle declining a spend request
  const handleDecline = (msgId: string) => {
    setMessages(prev =>
      prev.map(msg => {
        if (msg.id === msgId && msg.type === 'spend_request') {
          return {
            ...msg,
            spendStatus: 'declined',
          };
        }
        return msg;
      })
    );
  };

  // Handle sending a text chat message
  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Check if user typed an amount like "500" or "₹500"
    const cleanedText = inputText.replace(/[₹,\s]/g, '');
    const possibleAmount = parseFloat(cleanedText);

    const newMsg: ChatMessage = {
      id: `m_${Date.now()}`,
      senderName: CURRENT_USER.name.toUpperCase(),
      senderAvatar: CURRENT_USER.avatar,
      senderColor: '#2563EB',
      type: 'text',
      text: inputText.trim(),
      time: timeStr,
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');
  };

  // Handle depositing / adding money to vault
  const handleSendMoneySubmit = () => {
    const amt = parseFloat(sendAmount) || 0;
    if (amt <= 0) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: ChatMessage = {
      id: `m_${Date.now()}`,
      senderName: CURRENT_USER.name.toUpperCase(),
      senderAvatar: CURRENT_USER.avatar,
      senderColor: '#2563EB',
      type: 'deposit',
      depositAmount: amt,
      depositTitle: sendNote.trim() || 'Pool Contribution',
      depositTag: 'Instant UPI Consensus',
      time: timeStr,
    };

    const newTx: GroupActivityTx = {
      id: `gtx_${Date.now()}`,
      title: sendNote.trim() || 'Pool Contribution',
      category: 'Pool Contribution',
      member: CURRENT_USER.name,
      memberAvatar: CURRENT_USER.avatar,
      amount: amt,
      type: 'contribution',
      status: 'SUCCESS',
      dateLabel: 'Today',
      time: timeStr,
    };

    setMessages(prev => [...prev, newMsg]);
    setGroupActivities(prev => [newTx, ...prev]);
    setVaultBalance(prev => prev + amt);
    setActiveModal(null);
  };

  // Handle submitting spend request
  const handleSpendRequestSubmit = () => {
    const amt = parseFloat(spendAmount) || 0;
    if (amt <= 0) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: ChatMessage = {
      id: `m_${Date.now()}`,
      senderName: CURRENT_USER.name.toUpperCase(),
      senderAvatar: CURRENT_USER.avatar,
      senderColor: '#2563EB',
      type: 'spend_request',
      spendAmount: amt,
      spendTitle: spendTitle.trim() || 'Expense Reimbursement',
      spendStore: spendStore.trim() || 'Store Purchase',
      signaturesCount: 1,
      signaturesNeeded: 2,
      spendStatus: 'pending',
      userApproved: true,
      time: timeStr,
    };

    const newTx: GroupActivityTx = {
      id: `gtx_${Date.now()}`,
      title: spendStore.trim() ? `${spendStore} (${spendTitle})` : spendTitle.trim(),
      category: 'Store Purchase',
      member: CURRENT_USER.name,
      memberAvatar: CURRENT_USER.avatar,
      amount: -amt,
      type: 'payment',
      status: 'PENDING',
      dateLabel: 'Today',
      time: timeStr,
    };

    setMessages(prev => [...prev, newMsg]);
    setGroupActivities(prev => [newTx, ...prev]);
    setActiveModal(null);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FAF8F5',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    }}>
      {/* ── Top App Bar ── */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 30,
        background: '#FAF8F5',
        borderBottom: '1px solid #ECE7E1',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Back button */}
          <button
            onClick={() => navigate('/groups')}
            aria-label="Back"
            style={{
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '50%',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#374151',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Group Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: group.iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            }}>
              <EmojiBadge name={group.icon} size={22} shape="none" color="#FFFFFF" />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#111827', lineHeight: 1.2 }}>
                {group.name}
              </div>
              <div style={{ fontSize: 11, color: '#6B7280', marginTop: 1, fontWeight: 500 }}>
                {group.members.length} members · Vault: <span style={{ fontWeight: 700, color: '#059669' }}>{formatINR(vaultBalance)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Action Icons: QR & Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            onClick={() => setActiveModal('qr')}
            aria-label="Group QR"
            style={{
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '50%',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#111827',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
              <rect x="14" y="14" width="3" height="3" fill="currentColor" />
              <rect x="18" y="14" width="3" height="3" fill="currentColor" />
              <rect x="14" y="18" width="3" height="3" fill="currentColor" />
              <rect x="18" y="18" width="3" height="3" fill="currentColor" />
            </svg>
          </button>
          <button
            onClick={() => setActiveModal('members')}
            aria-label="Members & Rules"
            style={{
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '50%',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#111827',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Chat & Activity Switcher Bar ── */}
      <div style={{
        position: 'sticky',
        top: 61,
        zIndex: 25,
        background: '#FAF8F5',
        borderBottom: '1px solid #ECE7E1',
        padding: '8px 16px',
        display: 'flex',
        gap: 8,
      }}>
        {/* Chat Tab */}
        <button
          onClick={() => {
            setActiveSectionTab('chat');
            setShowActionMenu(false);
          }}
          style={{
            flex: 1,
            padding: '9px 12px',
            borderRadius: 14,
            border: activeSectionTab === 'chat' ? '1px solid #E5E7EB' : '1px solid transparent',
            background: activeSectionTab === 'chat' ? '#FFFFFF' : 'transparent',
            color: activeSectionTab === 'chat' ? '#111827' : '#6B7280',
            fontSize: 13,
            fontWeight: activeSectionTab === 'chat' ? 700 : 500,
            cursor: 'pointer',
            boxShadow: activeSectionTab === 'chat' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            transition: 'all 0.15s ease',
          }}
        >

          <span>Chat</span>
          <span style={{
            fontSize: 10,
            fontWeight: 800,
            background: activeSectionTab === 'chat' ? '#EA580C' : '#EDE8E1',
            color: activeSectionTab === 'chat' ? '#FFFFFF' : '#6B7280',
            padding: '1px 6px',
            borderRadius: 10,
          }}>
            {messages.length}
          </span>
        </button>

        {/* Activity Tab */}
        <button
          onClick={() => {
            setActiveSectionTab('activity');
            setShowActionMenu(false);
          }}
          style={{
            flex: 1,
            padding: '9px 12px',
            borderRadius: 14,
            border: activeSectionTab === 'activity' ? '1px solid #E5E7EB' : '1px solid transparent',
            background: activeSectionTab === 'activity' ? '#FFFFFF' : 'transparent',
            color: activeSectionTab === 'activity' ? '#111827' : '#6B7280',
            fontSize: 13,
            fontWeight: activeSectionTab === 'activity' ? 700 : 500,
            cursor: 'pointer',
            boxShadow: activeSectionTab === 'activity' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            transition: 'all 0.15s ease',
          }}
        >

          <span>Activity</span>
          <span style={{
            fontSize: 10,
            fontWeight: 800,
            background: activeSectionTab === 'activity' ? '#2563EB' : '#EDE8E1',
            color: activeSectionTab === 'activity' ? '#FFFFFF' : '#6B7280',
            padding: '1px 6px',
            borderRadius: 10,
          }}>
            {groupActivities.length}
          </span>
        </button>
      </div>

      {/* ── TAB 1: CHAT MESSAGES SECTION ── */}
      {activeSectionTab === 'chat' && (
        <div style={{
        flex: 1,
        padding: '12px 16px 100px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}>
        {/* Consensus Verification Banner */}
        <div style={{
          background: '#FFF3E8',
          border: '1px solid #FED7AA',
          borderRadius: 14,
          padding: '10px 14px',
          textAlign: 'center',
          fontSize: 12,
          color: '#9A3412',
          fontWeight: 600,
          lineHeight: 1.45,
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}>
          Cryptographically verified. Rule: spends &gt; ₹1,000 require 2/2 Admin signatures.
        </div>

        {/* Message Stream */}
        {messages.map(msg => (
          <div key={msg.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            {/* Sender Avatar */}
            <img
              src={msg.senderAvatar}
              alt={msg.senderName}
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                objectFit: 'cover',
                flexShrink: 0,
                marginTop: 2,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            />

            {/* Bubble Container */}
            <div style={{
              flex: 1,
              maxWidth: '88%',
              background: '#FFFFFF',
              borderRadius: 18,
              padding: '12px 14px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              border: '1px solid #F1ECE6',
            }}>
              {/* Sender Name in Accent Color */}
              <div style={{
                fontSize: 11,
                fontWeight: 800,
                color: msg.senderColor,
                letterSpacing: '0.04em',
                marginBottom: 6,
              }}>
                {msg.senderName}
              </div>

              {/* 1. Normal Text Message */}
              {msg.type === 'text' && (
                <div style={{ fontSize: 13.5, color: '#1F2937', lineHeight: 1.45 }}>
                  {msg.text}
                </div>
              )}

              {/* 2. Deposit / Money Added to Vault Card */}
              {msg.type === 'deposit' && (
                <div style={{
                  background: '#F0FDF4',
                  border: '1px solid #BBF7D0',
                  borderRadius: 14,
                  padding: '12px 14px',
                }}>
                  {/* Tag + Amount */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 10.5,
                      fontWeight: 800,
                      color: '#059669',
                      letterSpacing: '0.03em',
                    }}>
                      ✓ MONEY ADDED TO VAULT
                    </span>
                    <span style={{ fontSize: 18, fontWeight: 900, color: '#059669' }}>
                      {formatINR(msg.depositAmount || 0)}
                    </span>
                  </div>

                  {/* Subtitle */}
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: '#374151' }}>
                    {msg.depositTitle}
                  </div>

                  {/* Verification Note */}
                  <div style={{
                    fontSize: 11,
                    color: '#059669',
                    marginTop: 6,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}>
                    ✓ {msg.depositTag}
                  </div>
                </div>
              )}

              {/* 3. Spend Request with Approvals */}
              {msg.type === 'spend_request' && (
                <div style={{
                  background: '#FFF7ED',
                  border: '1px solid #FED7AA',
                  borderRadius: 14,
                  padding: '14px',
                }}>
                  {/* Header Row: SPEND REQUEST + Amount */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{
                      background: '#FFEDD5',
                      color: '#C2410C',
                      fontSize: 10,
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: 6,
                      letterSpacing: '0.04em',
                    }}>
                      SPEND REQUEST
                    </span>
                    <span style={{ fontSize: 18, fontWeight: 900, color: '#EA580C' }}>
                      {formatINR(msg.spendAmount || 0)}
                    </span>
                  </div>

                  {/* Purpose & Store */}
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: '#111827', marginTop: 4 }}>
                    {msg.spendTitle}
                  </div>
                  <div style={{ fontSize: 11.5, color: '#6B7280', marginTop: 2 }}>
                    Store: {msg.spendStore}
                  </div>

                  {/* Signatures status */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 10,
                    paddingTop: 8,
                    borderTop: '1px dashed #FED7AA',
                  }}>
                    <span style={{ fontSize: 11.5, color: '#4B5563', fontWeight: 600 }}>
                      Signatures: {msg.signaturesCount} / {msg.signaturesNeeded}
                    </span>
                    <span style={{
                      fontSize: 10,
                      fontWeight: 800,
                      padding: '2px 7px',
                      borderRadius: 6,
                      background: msg.spendStatus === 'approved' ? '#DCFCE7' : msg.spendStatus === 'declined' ? '#FEE2E2' : '#FEF3C7',
                      color: msg.spendStatus === 'approved' ? '#16A34A' : msg.spendStatus === 'declined' ? '#DC2626' : '#D97706',
                    }}>
                      {msg.spendStatus === 'approved' ? '✓ APPROVED' : msg.spendStatus === 'declined' ? 'DECLINED' : 'PENDING VOTE'}
                    </span>
                  </div>

                  {/* Actions */}
                  {msg.spendStatus === 'pending' && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                      <button
                        onClick={() => handleApprove(msg.id)}
                        disabled={msg.userApproved}
                        style={{
                          flex: 1,
                          background: msg.userApproved ? '#059669' : '#111827',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: 8,
                          padding: '8px 12px',
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: msg.userApproved ? 'default' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 4,
                          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                        }}
                      >
                        {msg.userApproved ? '✓ APPROVED BY YOU' : '✓ APPROVE'}
                      </button>
                      <button
                        onClick={() => handleDecline(msg.id)}
                        style={{
                          background: '#FFFFFF',
                          color: '#4B5563',
                          border: '1px solid #D1D5DB',
                          borderRadius: 8,
                          padding: '8px 14px',
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Timestamp */}
              <div style={{ fontSize: 10, color: '#9CA3AF', textAlign: 'right', marginTop: 4 }}>
                {msg.time}
              </div>
            </div>
          </div>
        ))}
        <div ref={chatBottomRef} />
      </div>
      )}

      {/* ── TAB 2: GROUP ACTIVITY SECTION (Activity Bars & Date-wise Transactions) ── */}
      {activeSectionTab === 'activity' && (
        <div style={{
          flex: 1,
          padding: '16px 16px 110px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}>
          {/* Group Vault Overview Card (Clean White & Multicolor Theme) */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: 20,
            padding: '18px 20px',
            color: '#111827',
            border: '1px solid #ECE7E1',
            boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Group Shared Vault
              </span>
              <span style={{
                fontSize: 11,
                fontWeight: 700,
                background: '#DCFCE7',
                color: '#059669',
                padding: '3px 8px',
                borderRadius: 8,
              }}>
                ● Active Pool
              </span>
            </div>

            <div style={{ fontSize: 28, fontWeight: 900, marginTop: 8, letterSpacing: '-0.02em', color: '#111827' }}>
              {formatINR(vaultBalance)}
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 12,
              marginTop: 16,
              paddingTop: 14,
              borderTop: '1px solid #F3F4F6',
            }}>
              <div>
                <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 600 }}>Total Spent (Oct)</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#DC2626', marginTop: 2 }}>₹8,450</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 600 }}>Total Collected</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#059669', marginTop: 2 }}>₹22,950</div>
              </div>
            </div>
          </div>

          {/* ── ACTIVITY BARS SECTION (Requested Feature) ── */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: 20,
            padding: '18px',
            border: '1px solid #ECE7E1',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>

                <span style={{ fontSize: 14, fontWeight: 800, color: '#111827' }}>Activity & Budget Bars</span>
              </div>
              <span style={{ fontSize: 11, color: '#6B7280', fontWeight: 600 }}>Monthly Limit</span>
            </div>

            {/* 1. Monthly Budget Spend Bar */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
                <span style={{ color: '#374151' }}>Pool Budget Used (34%)</span>
                <span style={{ color: '#EA580C' }}>₹8,450 / ₹25,000</span>
              </div>
              <div style={{ height: 10, background: '#F3F4F6', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: '34%',
                  background: 'linear-gradient(90deg, #F97316 0%, #EA580C 100%)',
                  borderRadius: 999,
                }} />
              </div>
              <div style={{ fontSize: 10.5, color: '#059669', fontWeight: 600, marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
                <span>✓ ₹16,550 safe remaining</span>
                <span>Rule: multi-sig active</span>
              </div>
            </div>

            {/* 2. Category Spending Activity Bars */}
            <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#6B7280', marginBottom: 10, textTransform: 'uppercase' }}>
                Category Activity Breakdown
              </div>

              {/* Bar 1: Groceries */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, fontWeight: 600, marginBottom: 4 }}>
                  <span style={{ color: '#111827' }}>Groceries &amp; Cleaning</span>
                  <span style={{ color: '#4B5563' }}>₹3,550 (42%)</span>
                </div>
                <div style={{ height: 6, background: '#F3F4F6', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '42%', background: '#F97316', borderRadius: 999 }} />
                </div>
              </div>

              {/* Bar 2: Food & Dining */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, fontWeight: 600, marginBottom: 4 }}>
                  <span style={{ color: '#111827' }}>Food &amp; Delivery</span>
                  <span style={{ color: '#4B5563' }}>₹2,410 (28%)</span>
                </div>
                <div style={{ height: 6, background: '#F3F4F6', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '28%', background: '#2563EB', borderRadius: 999 }} />
                </div>
              </div>

              {/* Bar 3: Utilities */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, fontWeight: 600, marginBottom: 4 }}>
                  <span style={{ color: '#111827' }}>Wi-Fi &amp; Utilities</span>
                  <span style={{ color: '#4B5563' }}>₹1,690 (20%)</span>
                </div>
                <div style={{ height: 6, background: '#F3F4F6', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '20%', background: '#10B981', borderRadius: 999 }} />
                </div>
              </div>

              {/* Bar 4: Extras */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, fontWeight: 600, marginBottom: 4 }}>
                  <span style={{ color: '#111827' }}>Leisure &amp; Extras</span>
                  <span style={{ color: '#4B5563' }}>₹800 (10%)</span>
                </div>
                <div style={{ height: 6, background: '#F3F4F6', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '10%', background: '#8B5CF6', borderRadius: 999 }} />
                </div>
              </div>
            </div>

            {/* 3. Member Contribution Activity Bars */}
            <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: 14, marginTop: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#6B7280', marginBottom: 10, textTransform: 'uppercase' }}>
                Member Contribution Share
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { name: 'Priya Sharma', amt: '₹8,000', pct: '35%', color: '#C026D3' },
                  { name: 'Nikhil (You)', amt: '₹6,000', pct: '26%', color: '#2563EB' },
                  { name: 'Gaurang', amt: '₹5,000', pct: '22%', color: '#10B981' },
                  { name: 'Mrunali', amt: '₹3,950', pct: '17%', color: '#F59E0B' },
                ].map(m => (
                  <div key={m.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 600, marginBottom: 3 }}>
                      <span style={{ color: '#111827' }}>{m.name}</span>
                      <span style={{ color: '#4B5563' }}>{m.amt} ({m.pct})</span>
                    </div>
                    <div style={{ height: 5, background: '#F3F4F6', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: m.pct, background: m.color, borderRadius: 999 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── DATE-WISE GROUP TRANSACTIONS LIST ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#111827' }}>
                Group Transaction Ledger
              </div>

              {/* Quick Filter Tabs */}
              <div style={{ display: 'flex', gap: 4 }}>
                {(['all', 'spent', 'added', 'pending'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActivityFilter(tab)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: 8,
                      border: 'none',
                      background: activityFilter === tab ? '#111827' : '#EDE8E1',
                      color: activityFilter === tab ? '#FFFFFF' : '#4B5563',
                      fontSize: 10.5,
                      fontWeight: 700,
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Render Group Transactions Grouped by Date */}
            {(['Today', 'Yesterday', '5 Oct 2026'] as const).map(dateKey => {
              const txsForDate = groupActivities.filter(tx => {
                if (tx.dateLabel !== dateKey) return false;
                if (activityFilter === 'spent') return tx.type === 'payment' && tx.status === 'SUCCESS';
                if (activityFilter === 'added') return tx.type === 'contribution';
                if (activityFilter === 'pending') return tx.status === 'PENDING';
                return true;
              });

              if (txsForDate.length === 0) return null;

              return (
                <div key={dateKey} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    paddingLeft: 4,
                  }}>
                    {dateKey}
                  </div>

                  <div style={{
                    background: '#FFFFFF',
                    borderRadius: 18,
                    overflow: 'hidden',
                    border: '1px solid #ECE7E1',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                  }}>
                    {txsForDate.map((tx, idx) => (
                      <div
                        key={tx.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 14px',
                          borderBottom: idx < txsForDate.length - 1 ? '1px solid #F3F4F6' : 'none',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          {/* Type / Direction Icon */}
                          <div style={{
                            width: 38,
                            height: 38,
                            borderRadius: '50%',
                            background: tx.type === 'contribution' ? '#DCFCE7' : tx.status === 'PENDING' ? '#FFEDD5' : '#FEE2E2',
                            color: tx.type === 'contribution' ? '#16A34A' : tx.status === 'PENDING' ? '#EA580C' : '#DC2626',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: 15,
                            flexShrink: 0,
                          }}>
                            {tx.type === 'contribution' ? '↙' : tx.status === 'PENDING' ? '⏳' : '↗'}
                          </div>

                          <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>
                              {tx.title}
                            </div>
                            <div style={{ fontSize: 11, color: '#6B7280', marginTop: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
                              <span>{tx.member}</span>
                              <span>·</span>
                              <span>{tx.time}</span>
                            </div>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{
                            fontSize: 14,
                            fontWeight: 800,
                            color: tx.type === 'contribution' ? '#059669' : '#111827',
                          }}>
                            {tx.type === 'contribution' ? `+${formatINR(tx.amount)}` : formatINR(tx.amount)}
                          </div>
                          <div style={{
                            fontSize: 9.5,
                            fontWeight: 700,
                            color: tx.status === 'PENDING' ? '#EA580C' : '#059669',
                            marginTop: 1,
                          }}>
                            {tx.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── FLOATING PILL CHAT & ACTION BAR (Matches User Reference Screenshots Exactly) ── */}
      <div style={{
        position: 'fixed',
        bottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)',
        maxWidth: 390,
        zIndex: 40,
      }}>
        {/* 2x2 Action Grid Popover (Screenshot 2: Green Send, Orange Spend, Black QR, Purple Members) */}
        {showActionMenu && (
          <>
            {/* Backdrop to dismiss popover when clicking anywhere outside */}
            <div
              onClick={() => setShowActionMenu(false)}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 38,
                background: 'rgba(0,0,0,0.12)',
              }}
            />

            {/* Floating 2x2 Action Card */}
            <div style={{
              position: 'absolute',
              bottom: 60,
              left: 0,
              width: 255,
              background: '#FFFFFF',
              borderRadius: 24,
              padding: '14px',
              boxShadow: '0 16px 40px rgba(0,0,0,0.16), 0 2px 8px rgba(0,0,0,0.06)',
              border: '1px solid #ECE7E1',
              zIndex: 42,
              animation: 'slideUp 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
              }}>
                {/* 1. Send Money (Green ₹ circle) */}
                <button
                  onClick={() => {
                    setShowActionMenu(false);
                    setActiveModal('send');
                  }}
                  style={{
                    background: '#F5F4F0',
                    border: 'none',
                    borderRadius: 18,
                    padding: '14px 6px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer',
                    transition: 'transform 0.12s ease',
                  }}
                  onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.96)')}
                  onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: '#16A34A',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    fontWeight: 800,
                    boxShadow: '0 4px 12px rgba(22, 163, 74, 0.35)',
                  }}>
                    ₹
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>
                    Send Money
                  </span>
                </button>

                {/* 2. Request Spend (Orange document circle) */}
                <button
                  onClick={() => {
                    setShowActionMenu(false);
                    setActiveModal('spend');
                  }}
                  style={{
                    background: '#F5F4F0',
                    border: 'none',
                    borderRadius: 18,
                    padding: '14px 6px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer',
                    transition: 'transform 0.12s ease',
                  }}
                  onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.96)')}
                  onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: '#EA580C',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(234, 88, 12, 0.35)',
                  }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>
                    Request Spend
                  </span>
                </button>

                {/* 3. Group QR (Black QR circle) */}
                <button
                  onClick={() => {
                    setShowActionMenu(false);
                    setActiveModal('qr');
                  }}
                  style={{
                    background: '#F5F4F0',
                    border: 'none',
                    borderRadius: 18,
                    padding: '14px 6px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer',
                    transition: 'transform 0.12s ease',
                  }}
                  onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.96)')}
                  onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: '#111827',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(17, 24, 39, 0.35)',
                  }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="white" strokeWidth="2" />
                      <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="white" strokeWidth="2" />
                      <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="white" strokeWidth="2" />
                      <rect x="14" y="14" width="3" height="3" rx="0.5" fill="white" />
                      <rect x="18" y="14" width="3" height="3" rx="0.5" fill="white" />
                      <rect x="14" y="18" width="3" height="3" rx="0.5" fill="white" />
                      <rect x="18" y="18" width="3" height="3" rx="0.5" fill="white" />
                    </svg>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>
                    Group QR
                  </span>
                </button>

                {/* 4. Members & Rules (Purple 3-people circle) */}
                <button
                  onClick={() => {
                    setShowActionMenu(false);
                    setActiveModal('members');
                  }}
                  style={{
                    background: '#F5F4F0',
                    border: 'none',
                    borderRadius: 18,
                    padding: '14px 6px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer',
                    transition: 'transform 0.12s ease',
                  }}
                  onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.96)')}
                  onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: '#7C3AED',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(124, 58, 237, 0.35)',
                  }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="9" cy="7" r="4" stroke="white" strokeWidth="2.2" />
                      <path d="M23 21v-2a4 4 0 00-3-3.87" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M16 3.13a4 4 0 010 7.75" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>
                    Members & Rules
                  </span>
                </button>
              </div>
            </div>
          </>
        )}

        {/* ── Seamless Capsule Pill Container (Screenshot 1 & 2) ── */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: 9999,
          padding: '5px 6px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.09), 0 1px 3px rgba(0, 0, 0, 0.04)',
          border: '1px solid #ECE7E1',
          position: 'relative',
        }}>
          {/* Left Action Launcher Button: '+' (Closed) or '✕' with Blue Outline Ring (Open) */}
          <button
            onClick={() => setShowActionMenu(prev => !prev)}
            aria-label={showActionMenu ? "Close Actions" : "Open Actions"}
            style={{
              width: 42,
              height: 42,
              borderRadius: '50%',
              background: showActionMenu ? '#2563EB' : '#F4F4F5',
              color: showActionMenu ? '#FFFFFF' : '#111827',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              // Exact detail from Screenshot 2: Blue circular ring when opened!
              boxShadow: showActionMenu ? '0 0 0 2.5px #2563EB' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            {showActionMenu ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2.8" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            )}
          </button>

          {/* Input Field */}
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder="Message or type ₹amount..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: 14,
              fontWeight: 500,
              color: '#111827',
              padding: '0 4px',
            }}
          />

          {/* Right Blue Send Button with Paper Plane */}
          <button
            onClick={handleSendMessage}
            aria-label="Send"
            style={{
              width: 42,
              height: 42,
              borderRadius: '50%',
              background: '#2563EB',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              boxShadow: '0 3px 14px rgba(37, 99, 235, 0.45)',
              transition: 'transform 0.12s ease',
            }}
            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.92)')}
            onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ transform: 'translate(1px, -1px)' }}>
              <path
                d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"
                fill="white"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* ====================================================
          MODAL 1: SEND MONEY (Add to Vault)
          ==================================================== */}
      {activeModal === 'send' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  background: '#10B981',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  fontWeight: 800,
                }}>
                  ₹
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: '#111827', margin: 0 }}>Send Money to Vault</h3>
                  <div style={{ fontSize: 11, color: '#6B7280' }}>Deposits into {group.name} shared pool</div>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                style={{ background: '#F3F4F6', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>Amount (₹)</label>
              <div style={{ position: 'relative', marginTop: 6 }}>
                <span style={{ position: 'absolute', left: 14, top: 11, fontSize: 20, fontWeight: 800, color: '#059669' }}>₹</span>
                <input
                  type="number"
                  value={sendAmount}
                  onChange={e => setSendAmount(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 32px',
                    fontSize: 22,
                    fontWeight: 800,
                    borderRadius: 12,
                    border: '1.5px solid #10B981',
                    outline: 'none',
                    color: '#111827',
                  }}
                />
              </div>
              {/* Quick Chip Presets */}
              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                {['500', '1000', '2000', '5000'].map(val => (
                  <button
                    key={val}
                    onClick={() => setSendAmount(val)}
                    style={{
                      flex: 1,
                      padding: '5px 0',
                      background: sendAmount === val ? '#DCFCE7' : '#F3F4F6',
                      color: sendAmount === val ? '#059669' : '#4B5563',
                      border: sendAmount === val ? '1px solid #86EFAC' : 'none',
                      borderRadius: 8,
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    +₹{val}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>Contribution Note</label>
              <input
                type="text"
                value={sendNote}
                onChange={e => setSendNote(e.target.value)}
                placeholder="e.g. Monthly rent, groceries share"
                style={{
                  width: '100%',
                  marginTop: 6,
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1px solid #D1D5DB',
                  fontSize: 13,
                  outline: 'none',
                }}
              />
            </div>

            <button
              onClick={handleSendMoneySubmit}
              style={{
                width: '100%',
                background: '#10B981',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 12,
                padding: '13px 0',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
              }}
            >
              Deposit ₹{sendAmount || 0} via UPI Consensus
            </button>
          </div>
        </div>
      )}

      {/* ====================================================
          MODAL 2: REQUEST SPEND
          ==================================================== */}
      {activeModal === 'spend' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  background: '#EA580C',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: '#111827', margin: 0 }}>Request Group Spend</h3>
                  <div style={{ fontSize: 11, color: '#6B7280' }}>Requires admin consensus signature</div>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                style={{ background: '#F3F4F6', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>Amount to Spend (₹)</label>
              <div style={{ position: 'relative', marginTop: 6 }}>
                <span style={{ position: 'absolute', left: 14, top: 11, fontSize: 20, fontWeight: 800, color: '#EA580C' }}>₹</span>
                <input
                  type="number"
                  value={spendAmount}
                  onChange={e => setSpendAmount(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 32px',
                    fontSize: 22,
                    fontWeight: 800,
                    borderRadius: 12,
                    border: '1.5px solid #EA580C',
                    outline: 'none',
                    color: '#111827',
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>Purpose / Item</label>
              <input
                type="text"
                value={spendTitle}
                onChange={e => setSpendTitle(e.target.value)}
                placeholder="e.g. Monthly Kitchen & Cleaning Essentials"
                style={{
                  width: '100%',
                  marginTop: 6,
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1px solid #D1D5DB',
                  fontSize: 13,
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>Store / Merchant</label>
              <input
                type="text"
                value={spendStore}
                onChange={e => setSpendStore(e.target.value)}
                placeholder="e.g. Reliance Smart Bazaar, Swiggy, D-Mart"
                style={{
                  width: '100%',
                  marginTop: 6,
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1px solid #D1D5DB',
                  fontSize: 13,
                  outline: 'none',
                }}
              />
            </div>

            <div style={{
              background: '#FFF7ED',
              borderRadius: 10,
              padding: '10px 12px',
              fontSize: 11,
              color: '#C2410C',
              fontWeight: 600,
              marginBottom: 18,
            }}>
              Consensus Rule: Spends &gt; ₹1,000 will be posted into the group feed for 2/2 Admin approval.
            </div>

            <button
              onClick={handleSpendRequestSubmit}
              style={{
                width: '100%',
                background: '#EA580C',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 12,
                padding: '13px 0',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(234, 88, 12, 0.4)',
              }}
            >
              Post Spend Request for Approval
            </button>
          </div>
        </div>
      )}

      {/* ====================================================
          MODAL 3: GROUP QR CODE
          ==================================================== */}
      {activeModal === 'qr' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ textAlign: 'center' }}>
            <div className="modal-handle" />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 6 }}>
              <button
                onClick={() => setActiveModal(null)}
                style={{ background: '#F3F4F6', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{
              width: 54,
              height: 54,
              borderRadius: '50%',
              background: group.iconBg,
              margin: '0 auto 10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}>
              <EmojiBadge name={group.icon} size={30} shape="none" color="#FFFFFF" />
            </div>

            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#111827', margin: 0 }}>
              {group.name} Vault QR
            </h3>
            <p style={{ fontSize: 12, color: '#6B7280', margin: '4px 0 16px' }}>
              Scan with any UPI app to deposit funds directly into group vault
            </p>

            {/* QR Card */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: 20,
              padding: 20,
              border: '2px solid #E5E7EB',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              display: 'inline-block',
              marginBottom: 16,
            }}>
              <svg width="180" height="180" viewBox="0 0 120 120" fill="none">
                {/* 3 Finder patterns */}
                <rect x="10" y="10" width="30" height="30" rx="4" stroke="#111827" strokeWidth="6" />
                <rect x="19" y="19" width="12" height="12" rx="2" fill="#111827" />

                <rect x="80" y="10" width="30" height="30" rx="4" stroke="#111827" strokeWidth="6" />
                <rect x="89" y="19" width="12" height="12" rx="2" fill="#111827" />

                <rect x="10" y="80" width="30" height="30" rx="4" stroke="#111827" strokeWidth="6" />
                <rect x="19" y="89" width="12" height="12" rx="2" fill="#111827" />

                {/* Data modules */}
                <rect x="48" y="15" width="6" height="6" rx="1" fill="#111827" />
                <rect x="60" y="15" width="6" height="6" rx="1" fill="#111827" />
                <rect x="48" y="27" width="6" height="6" rx="1" fill="#111827" />
                <rect x="66" y="27" width="6" height="6" rx="1" fill="#111827" />

                <rect x="48" y="48" width="8" height="8" rx="1.5" fill="#10B981" />
                <rect x="62" y="48" width="8" height="8" rx="1.5" fill="#EA580C" />
                <rect x="48" y="62" width="8" height="8" rx="1.5" fill="#2563EB" />
                <rect x="62" y="62" width="8" height="8" rx="1.5" fill="#7C3AED" />

                <rect x="15" y="48" width="6" height="6" rx="1" fill="#111827" />
                <rect x="27" y="48" width="6" height="6" rx="1" fill="#111827" />
                <rect x="15" y="60" width="6" height="6" rx="1" fill="#111827" />

                <rect x="80" y="48" width="6" height="6" rx="1" fill="#111827" />
                <rect x="95" y="48" width="6" height="6" rx="1" fill="#111827" />
                <rect x="85" y="62" width="6" height="6" rx="1" fill="#111827" />

                <rect x="48" y="85" width="6" height="6" rx="1" fill="#111827" />
                <rect x="60" y="85" width="6" height="6" rx="1" fill="#111827" />
                <rect x="75" y="85" width="6" height="6" rx="1" fill="#111827" />
                <rect x="90" y="85" width="6" height="6" rx="1" fill="#111827" />

                <rect x="48" y="98" width="6" height="6" rx="1" fill="#111827" />
                <rect x="66" y="98" width="6" height="6" rx="1" fill="#111827" />
                <rect x="82" y="98" width="6" height="6" rx="1" fill="#111827" />
                <rect x="100" y="98" width="6" height="6" rx="1" fill="#111827" />
              </svg>

              <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', marginTop: 8 }}>
                UPI ID: cowallet.{group.id}@okhdfcbank
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => {
                  setCopiedUpi(true);
                  setTimeout(() => setCopiedUpi(false), 2000);
                }}
                style={{
                  flex: 1,
                  background: '#F3F4F6',
                  color: '#111827',
                  border: 'none',
                  borderRadius: 12,
                  padding: '12px 0',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {copiedUpi ? '✓ UPI ID Copied!' : 'Copy UPI ID'}
              </button>
              <button
                onClick={() => setActiveModal(null)}
                style={{
                  flex: 1,
                  background: '#111827',
                  color: '#FFFFFF',
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

      {/* ====================================================
          MODAL 4: MEMBERS & RULES
          ==================================================== */}
      {activeModal === 'members' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxHeight: '85vh', overflowY: 'auto' }}>
            <div className="modal-handle" />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: '#111827', margin: 0 }}>
                {group.name} Members & Rules
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                style={{ background: '#F3F4F6', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* Consensus Rules Card */}
            <div style={{
              background: '#F5F3FF',
              borderRadius: 14,
              border: '1px solid #DDD6FE',
              padding: '14px',
              marginBottom: 20,
            }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
                Group Consensus Governance
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: '#4C1D95' }}>
                <div>• <strong>Spend Threshold:</strong> Spends &gt; ₹1,000 require 2/2 Admin approval signatures.</div>
                <div>• <strong>Auto-Pass:</strong> Everyday micro-expenses &lt; ₹200 pass automatically.</div>
                <div>• <strong>Multi-Sig Escrow:</strong> Vault funds cannot be withdrawn unilaterally.</div>
              </div>
            </div>

            {/* Members List */}
            <div style={{ fontSize: 12, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>
              Group Members ({group.members.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {group.members.map(m => (
                <div key={m.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#F9FAFB',
                  borderRadius: 12,
                  padding: '10px 14px',
                  border: '1px solid #F3F4F6',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src={m.avatar} alt={m.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{m.name}</div>
                      <div style={{ fontSize: 11, color: '#9CA3AF' }}>Active Participant</div>
                    </div>
                  </div>
                  <span style={{
                    fontSize: 10,
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: 6,
                    background: m.role === 'admin' ? '#DBEAFE' : '#F3F4F6',
                    color: m.role === 'admin' ? '#1D4ED8' : '#6B7280',
                  }}>
                    {m.role === 'admin' ? 'ADMIN' : 'MEMBER'}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveModal(null)}
              style={{
                width: '100%',
                background: '#111827',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 12,
                padding: '12px 0',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
