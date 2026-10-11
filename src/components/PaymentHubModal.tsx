import { useState } from 'react';
import { CURRENT_USER, MOCK_GROUPS, formatINR, type Group } from '../data/mockData';
import { EmojiBadge } from './EmojiBadge';

interface PaymentHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess?: (payment: {
    type: 'personal' | 'group';
    amount: number;
    recipient: string;
    groupName?: string;
  }) => void;
}

export function PaymentHubModal({ isOpen, onClose, onPaymentSuccess }: PaymentHubModalProps) {
  const [payMode, setPayMode] = useState<'personal' | 'group'>('personal');

  // Personal state
  const [personalBalance, setPersonalBalance] = useState(CURRENT_USER.personalBalance);
  const [isFetchingBalance, setIsFetchingBalance] = useState(false);
  const [balanceFetchedAt, setBalanceFetchedAt] = useState<string | null>(null);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  // Group state
  const [selectedGroup, setSelectedGroup] = useState<Group>(MOCK_GROUPS[0]);
  const [groupAmount, setGroupAmount] = useState('');
  const [groupMerchant, setGroupMerchant] = useState('');
  const [groupNote, setGroupNote] = useState('');

  // Flow states: 'form' | 'pin' | 'success'
  const [step, setStep] = useState<'form' | 'pin' | 'success'>('form');
  const [pin, setPin] = useState(['', '', '', '']);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  // Handle Fetch Balance from Bank
  const handleFetchBalance = () => {
    setIsFetchingBalance(true);
    setTimeout(() => {
      setIsFetchingBalance(false);
      setPersonalBalance(3250);
      const now = new Date();
      setBalanceFetchedAt(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 850);
  };

  // Quick recipient select
  const quickContacts = [
    { name: 'Aarav', upi: 'aarav@okhdfc', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces' },
    { name: 'Priya', upi: 'priya@oksbi', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces' },
    { name: 'Nikhil', upi: 'nikhil@axis', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces' },
    { name: 'Sneha', upi: 'sneha@icici', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces' },
  ];

  // Initiate Payment
  const handleInitiatePay = (e: React.FormEvent) => {
    e.preventDefault();
    const payVal = payMode === 'personal' ? parseFloat(amount) : parseFloat(groupAmount);
    if (!payVal || payVal <= 0) return;
    setStep('pin');
  };

  // Confirm PIN / Process Payment
  const handleConfirmPin = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
      const amtVal = payMode === 'personal' ? parseFloat(amount) : parseFloat(groupAmount);
      if (payMode === 'personal') {
        setPersonalBalance(prev => Math.max(0, prev - amtVal));
      }
      if (onPaymentSuccess) {
        onPaymentSuccess({
          type: payMode,
          amount: amtVal,
          recipient: payMode === 'personal' ? (recipient || 'Contact') : groupMerchant,
          groupName: payMode === 'group' ? selectedGroup.name : undefined,
        });
      }
    }, 1200);
  };

  const handleReset = () => {
    setStep('form');
    setAmount('');
    setRecipient('');
    setNote('');
    setGroupAmount('');
    setGroupMerchant('');
    setGroupNote('');
    setPin(['', '', '', '']);
    onClose();
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
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
          background: 'rgba(255, 255, 255, 0.90)',
          backdropFilter: 'blur(28px) saturate(190%)',
          WebkitBackdropFilter: 'blur(28px) saturate(190%)',
          borderRadius: 28,
          border: '1.5px solid rgba(255, 255, 255, 0.95)',
          boxShadow: '0 24px 60px rgba(15, 23, 42, 0.22), inset 0 1px 2px rgba(255, 255, 255, 0.95)',
          overflow: 'hidden',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideUp 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Top Drag Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10, paddingBottom: 4 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(148, 163, 184, 0.5)' }} />
        </div>

        {/* Modal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 18px 12px',
          borderBottom: '1px solid rgba(226, 232, 240, 0.7)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Blue Paper Plane Icon Badge */}
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #38BDF8 0%, #2563EB 60%, #1D4ED8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.28)',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L15 22L11 13L2 9L22 2Z" fill="white" stroke="white" strokeWidth="1" />
              </svg>
            </div>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.3px' }}>
                Payment Hub
              </h2>
              <p style={{ fontSize: 11.5, color: '#64748B', margin: '1px 0 0', fontWeight: 500 }}>
                Choose personal or group method
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'rgba(241, 245, 249, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#475569',
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div style={{ overflowY: 'auto', padding: '16px 18px 24px', flex: 1 }}>
          {step === 'form' && (
            <>
              {/* ── Mode Switcher Pills ── */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 6,
                background: 'rgba(241, 245, 249, 0.85)',
                backdropFilter: 'blur(12px)',
                padding: 4,
                borderRadius: 16,
                border: '1px solid rgba(226, 232, 240, 0.8)',
                marginBottom: 16,
              }}>
                {/* Personal UPI Option */}
                <button
                  type="button"
                  onClick={() => setPayMode('personal')}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 12,
                    border: payMode === 'personal' ? '1.5px solid #2563EB' : '1.5px solid transparent',
                    background: payMode === 'personal' ? '#FFFFFF' : 'transparent',
                    color: payMode === 'personal' ? '#2563EB' : '#64748B',
                    fontSize: 13,
                    fontWeight: payMode === 'personal' ? 800 : 600,
                    boxShadow: payMode === 'personal' ? '0 4px 14px rgba(37, 99, 235, 0.12)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                    <line x1="2" y1="10" x2="22" y2="10" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  Personal UPI
                </button>

                {/* Group Vault Option */}
                <button
                  type="button"
                  onClick={() => setPayMode('group')}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 12,
                    border: payMode === 'group' ? '1.5px solid #7C3AED' : '1.5px solid transparent',
                    background: payMode === 'group' ? '#FFFFFF' : 'transparent',
                    color: payMode === 'group' ? '#7C3AED' : '#64748B',
                    fontSize: 13,
                    fontWeight: payMode === 'group' ? 800 : 600,
                    boxShadow: payMode === 'group' ? '0 4px 14px rgba(124, 58, 237, 0.12)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Group Vault
                </button>
              </div>

              {/* ── MODE 1: PERSONAL UPI PAYMENT ── */}
              {payMode === 'personal' && (
                <form onSubmit={handleInitiatePay} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {/* Bank Account & Live Fetch Balance Glass Card */}
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(239, 246, 255, 0.90) 0%, rgba(219, 234, 254, 0.75) 100%)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    borderRadius: 20,
                    padding: '14px 16px',
                    border: '1.5px solid rgba(147, 197, 253, 0.65)',
                    boxShadow: '0 8px 26px -2px rgba(37, 99, 235, 0.10), inset 0 1px 1.5px rgba(255, 255, 255, 0.95)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                          width: 28,
                          height: 28,
                          borderRadius: 8,
                          background: '#2563EB',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 11,
                          fontWeight: 800,
                        }}>
                          UPI
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A' }}>
                            HDFC Bank <span style={{ fontWeight: 600, color: '#64748B' }}>•••• 4921</span>
                          </div>
                          <div style={{ fontSize: 11, color: '#2563EB', fontWeight: 600 }}>
                            {CURRENT_USER.upiId}
                          </div>
                        </div>
                      </div>

                      {/* Fetch Live Balance Button */}
                      <button
                        type="button"
                        onClick={handleFetchBalance}
                        disabled={isFetchingBalance}
                        style={{
                          background: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid rgba(147, 197, 253, 0.8)',
                          borderRadius: 10,
                          padding: '6px 10px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          fontSize: 11,
                          fontWeight: 700,
                          color: '#1D4ED8',
                          cursor: 'pointer',
                          boxShadow: '0 2px 6px rgba(37, 99, 235, 0.08)',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          style={{
                            transform: isFetchingBalance ? 'rotate(360deg)' : 'none',
                            transition: isFetchingBalance ? 'transform 0.8s linear infinite' : 'none',
                          }}
                        >
                          <path d="M23 4v6h-6M1 20v-6h6M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"
                            stroke="#1D4ED8" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {isFetchingBalance ? 'Checking...' : 'Fetch Balance'}
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderTop: '1px dashed rgba(147, 197, 253, 0.6)', paddingTop: 8, marginTop: 4 }}>
                      <span style={{ fontSize: 11, color: '#475569', fontWeight: 600 }}>Available Bank Balance</span>
                      <span style={{ fontSize: 18, fontWeight: 900, color: '#0F172A', letterSpacing: '-0.3px' }}>
                        {formatINR(personalBalance)}
                      </span>
                    </div>

                    {balanceFetchedAt && (
                      <div style={{ fontSize: 10, color: '#16A34A', fontWeight: 600, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span>✓ Live balance verified via UPI at {balanceFetchedAt}</span>
                      </div>
                    )}
                  </div>

                  {/* Quick Contacts Row */}
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 8 }}>
                      Quick Pay Contacts
                    </label>
                    <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 2, scrollbarWidth: 'none' }}>
                      {quickContacts.map(c => (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => setRecipient(c.upi)}
                          style={{
                            background: recipient === c.upi ? 'rgba(239, 246, 255, 0.9)' : 'rgba(255, 255, 255, 0.75)',
                            border: recipient === c.upi ? '1.5px solid #2563EB' : '1px solid rgba(226, 232, 240, 0.8)',
                            borderRadius: 14,
                            padding: '8px 10px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 4,
                            minWidth: 70,
                            cursor: 'pointer',
                            flexShrink: 0,
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <img src={c.avatar} alt={c.name} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                          <span style={{ fontSize: 11, fontWeight: 700, color: '#0F172A' }}>{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Recipient UPI / Phone */}
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 6 }}>
                      Payee UPI ID or Phone
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        value={recipient}
                        onChange={e => setRecipient(e.target.value)}
                        placeholder="e.g. priya@oksbi or 9876543210"
                        required
                        style={{
                          width: '100%',
                          padding: '11px 14px',
                          borderRadius: 12,
                          background: 'rgba(255, 255, 255, 0.9)',
                          border: '1.5px solid rgba(203, 213, 225, 0.8)',
                          fontSize: 13.5,
                          fontWeight: 600,
                          color: '#0F172A',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  {/* Amount to Pay */}
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 6 }}>
                      Amount (₹)
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 14, top: 10, fontSize: 20, fontWeight: 800, color: '#2563EB' }}>₹</span>
                      <input
                        type="number"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        placeholder="0"
                        min="1"
                        max={personalBalance}
                        required
                        style={{
                          width: '100%',
                          padding: '10px 14px 10px 32px',
                          borderRadius: 12,
                          background: 'rgba(255, 255, 255, 0.9)',
                          border: '1.5px solid #2563EB',
                          fontSize: 22,
                          fontWeight: 800,
                          color: '#0F172A',
                          outline: 'none',
                        }}
                      />
                    </div>

                    {/* Quick Amount Chips */}
                    <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                      {[100, 250, 500, 1000].map(val => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setAmount(String(val))}
                          style={{
                            flex: 1,
                            padding: '5px 0',
                            borderRadius: 8,
                            background: amount === String(val) ? '#2563EB' : 'rgba(239, 246, 255, 0.8)',
                            color: amount === String(val) ? '#FFFFFF' : '#2563EB',
                            border: '1px solid rgba(147, 197, 253, 0.6)',
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

                  {/* Note */}
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 6 }}>
                      Note (Optional)
                    </label>
                    <input
                      type="text"
                      value={note}
                      onChange={e => setNote(e.target.value)}
                      placeholder="e.g. Dinner share, Coffee, Rent"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: 12,
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid rgba(203, 213, 225, 0.8)',
                        fontSize: 13,
                        color: '#0F172A',
                        outline: 'none',
                      }}
                    />
                  </div>

                  {/* Primary Pay Button */}
                  <button
                    type="submit"
                    style={{
                      marginTop: 4,
                      width: '100%',
                      padding: '14px',
                      borderRadius: 14,
                      background: 'linear-gradient(135deg, #38BDF8 0%, #2563EB 55%, #1D4ED8 100%)',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: 15,
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '0 6px 20px rgba(37, 99, 235, 0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                    }}
                  >
                    <span>Proceed to Pay {amount ? `₹${amount}` : ''}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </form>
              )}

              {/* ── MODE 2: GROUP VAULT PAYMENT ── */}
              {payMode === 'group' && (
                <form onSubmit={handleInitiatePay} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {/* Select Group Vault */}
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 8 }}>
                      Select Shared Vault to Pay From
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      {MOCK_GROUPS.map(g => {
                        const isSel = selectedGroup.id === g.id;
                        return (
                          <button
                            key={g.id}
                            type="button"
                            onClick={() => setSelectedGroup(g)}
                            style={{
                              background: isSel ? `linear-gradient(135deg, ${g.cardBg} 0%, rgba(255,255,255,0.95) 100%)` : 'rgba(255, 255, 255, 0.75)',
                              border: isSel ? `1.5px solid ${g.themeColor}` : '1px solid rgba(226, 232, 240, 0.8)',
                              borderRadius: 14,
                              padding: '10px 12px',
                              textAlign: 'left',
                              cursor: 'pointer',
                              boxShadow: isSel ? `0 4px 14px ${g.themeColor}22` : 'none',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                              <EmojiBadge name={g.icon} size={22} color={g.themeColor} bg="transparent" shape="none" />
                              <span style={{ fontSize: 12.5, fontWeight: 800, color: '#0F172A' }}>{g.name}</span>
                            </div>
                            <div style={{ fontSize: 11, color: '#475569', fontWeight: 600 }}>
                              Balance: <span style={{ fontWeight: 800, color: g.themeColor }}>{formatINR(g.balance)}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Selected Group Summary Glass Card */}
                  <div style={{
                    background: `linear-gradient(135deg, ${selectedGroup.cardBg}99 0%, rgba(255,255,255,0.92) 100%)`,
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    borderRadius: 16,
                    padding: '12px 14px',
                    border: `1.5px solid ${selectedGroup.cardBorder}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <div>
                      <div style={{ fontSize: 10.5, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                        Active Group Pool
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A' }}>
                        {selectedGroup.name} · {selectedGroup.members.length} Members
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 16, fontWeight: 900, color: selectedGroup.themeColor }}>
                        {formatINR(selectedGroup.balance)}
                      </div>
                      <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600 }}>
                        Cap: {formatINR(selectedGroup.cap)}
                      </div>
                    </div>
                  </div>

                  {/* Merchant / Purpose */}
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 6 }}>
                      Merchant or Payee
                    </label>
                    <input
                      type="text"
                      value={groupMerchant}
                      onChange={e => setGroupMerchant(e.target.value)}
                      placeholder="e.g. Swiggy, D-Mart, Electricity Board"
                      required
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: 12,
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: '1.5px solid rgba(203, 213, 225, 0.8)',
                        fontSize: 13.5,
                        fontWeight: 600,
                        color: '#0F172A',
                        outline: 'none',
                      }}
                    />
                  </div>

                  {/* Group Amount */}
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 6 }}>
                      Spend Amount (₹)
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 14, top: 10, fontSize: 20, fontWeight: 800, color: selectedGroup.themeColor }}>₹</span>
                      <input
                        type="number"
                        value={groupAmount}
                        onChange={e => setGroupAmount(e.target.value)}
                        placeholder="0"
                        min="1"
                        max={selectedGroup.balance}
                        required
                        style={{
                          width: '100%',
                          padding: '10px 14px 10px 32px',
                          borderRadius: 12,
                          background: 'rgba(255, 255, 255, 0.9)',
                          border: `1.5px solid ${selectedGroup.themeColor}`,
                          fontSize: 22,
                          fontWeight: 800,
                          color: '#0F172A',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  {/* Note */}
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 6 }}>
                      Itemized Description
                    </label>
                    <input
                      type="text"
                      value={groupNote}
                      onChange={e => setGroupNote(e.target.value)}
                      placeholder="e.g. Weekly kitchen supply & groceries"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: 12,
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid rgba(203, 213, 225, 0.8)',
                        fontSize: 13,
                        color: '#0F172A',
                        outline: 'none',
                      }}
                    />
                  </div>

                  {/* Consensus Rule Notice */}
                  <div style={{
                    background: 'rgba(245, 243, 255, 0.85)',
                    border: '1px solid rgba(196, 181, 253, 0.65)',
                    borderRadius: 12,
                    padding: '8px 12px',
                    fontSize: 11,
                    color: '#6D28D9',
                    fontWeight: 600,
                  }}>
                    Consensus Rule: Spends &gt; ₹1,000 will be verified with 2/2 Admin approval before payout.
                  </div>

                  {/* Primary Group Pay Button */}
                  <button
                    type="submit"
                    style={{
                      marginTop: 4,
                      width: '100%',
                      padding: '14px',
                      borderRadius: 14,
                      background: `linear-gradient(135deg, ${selectedGroup.themeColor} 0%, #4338CA 100%)`,
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: 15,
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: `0 6px 20px ${selectedGroup.themeColor}40`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                    }}
                  >
                    <span>Pay from {selectedGroup.name} Vault</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </form>
              )}
            </>
          )}

          {/* ── STEP 2: PIN ENTRY SIMULATION ── */}
          {step === 'pin' && (
            <div style={{ textAlign: 'center', padding: '10px 4px 6px' }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: payMode === 'personal' ? '#EFF6FF' : '#F5F3FF',
                color: payMode === 'personal' ? '#2563EB' : '#7C3AED',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>

              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Enter UPI PIN
              </h3>
              <p style={{ fontSize: 12.5, color: '#64748B', marginTop: 4, marginBottom: 18 }}>
                Paying {formatINR(parseFloat(payMode === 'personal' ? amount : groupAmount))} to{' '}
                <strong style={{ color: '#0F172A' }}>{payMode === 'personal' ? recipient : groupMerchant}</strong>
              </p>

              {/* 4 Digit Dots */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
                {[0, 1, 2, 3].map(i => (
                  <div
                    key={i}
                    style={{
                      width: 44,
                      height: 50,
                      borderRadius: 12,
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: pin[i] ? '2px solid #2563EB' : '1.5px solid #CBD5E1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 22,
                      fontWeight: 800,
                      color: '#0F172A',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                    }}
                  >
                    {pin[i] ? '•' : ''}
                  </div>
                ))}
              </div>

              {/* Number Pad Simulation */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, maxWidth: 280, margin: '0 auto 20px' }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '✓'].map(btn => (
                  <button
                    key={String(btn)}
                    type="button"
                    onClick={() => {
                      if (btn === 'C') {
                        setPin(['', '', '', '']);
                      } else if (btn === '✓') {
                        handleConfirmPin();
                      } else {
                        const next = [...pin];
                        const idx = next.findIndex(p => p === '');
                        if (idx !== -1) {
                          next[idx] = String(btn);
                          setPin(next);
                        }
                      }
                    }}
                    style={{
                      padding: '12px 0',
                      borderRadius: 12,
                      background: btn === '✓' ? '#2563EB' : 'rgba(255, 255, 255, 0.85)',
                      color: btn === '✓' ? '#FFFFFF' : '#0F172A',
                      border: '1px solid rgba(226, 232, 240, 0.8)',
                      fontSize: 16,
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
                    }}
                  >
                    {btn}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleConfirmPin}
                disabled={isProcessing}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: 15,
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(22, 163, 74, 0.35)',
                }}
              >
                {isProcessing ? 'Verifying with NPCI...' : 'Confirm & Authorize Payment'}
              </button>
            </div>
          )}

          {/* ── STEP 3: SUCCESS CONFIRMATION ── */}
          {step === 'success' && (
            <div style={{ textAlign: 'center', padding: '16px 8px 10px' }}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: '#DCFCE7',
                border: '2px solid #86EFAC',
                color: '#16A34A',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                marginBottom: 14,
                boxShadow: '0 8px 24px rgba(22, 163, 74, 0.25)',
              }}>
                ✓
              </div>

              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Payment Successful!
              </h3>
              <p style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>
                {payMode === 'personal' ? 'Debited from HDFC Bank UPI' : `Debited from ${selectedGroup.name} Vault`}
              </p>

              {/* Receipt Glass Card */}
              <div style={{
                background: 'rgba(248, 250, 252, 0.85)',
                backdropFilter: 'blur(16px)',
                borderRadius: 18,
                padding: '16px',
                border: '1.5px solid rgba(226, 232, 240, 0.8)',
                margin: '16px 0 20px',
                textAlign: 'left',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: '#64748B' }}>Amount Paid</span>
                  <span style={{ fontSize: 16, fontWeight: 900, color: '#16A34A' }}>
                    -{formatINR(parseFloat(payMode === 'personal' ? amount : groupAmount))}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: '#64748B' }}>Paid To</span>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: '#0F172A' }}>
                    {payMode === 'personal' ? recipient : groupMerchant}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: '#64748B' }}>Payment Method</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#2563EB' }}>
                    {payMode === 'personal' ? 'Personal UPI (mrunali@upi)' : `${selectedGroup.name} Group Vault`}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: '#64748B' }}>UPI Ref ID</span>
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: '#475569', fontFamily: 'monospace' }}>
                    UPI/{Date.now().toString().slice(-8)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleReset}
                style={{
                  width: '100%',
                  padding: '13px',
                  borderRadius: 14,
                  background: '#2563EB',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: 14.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
                }}
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
