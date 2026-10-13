import { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_GROUPS, formatINR, type Group } from '../data/mockData';

// ── Rocket Launch Keyframes ─────────────────────────────────────────────────
const LAUNCH_STYLES = `
@keyframes btnRumble {
  0%,100% { transform: translateX(0) rotate(0); }
  10% { transform: translateX(-4px) rotate(-1deg); }
  20% { transform: translateX(4px) rotate(1deg); }
  30% { transform: translateX(-3px) rotate(-0.5deg); }
  40% { transform: translateX(3px) rotate(0.5deg); }
  50% { transform: translateX(-2px); }
  60% { transform: translateX(2px); }
}
@keyframes planeShoot {
  0%   { transform: translate(-50%, -50%) rotate(-30deg) scale(1); opacity: 1; }
  60%  { transform: translate(120vw, -80px) rotate(-30deg) scale(1.3); opacity: 1; }
  100% { transform: translate(150vw, -120px) rotate(-30deg) scale(0.5); opacity: 0; }
}
@keyframes particle {
  0%   { transform: translate(0,0) scale(1); opacity: 1; }
  100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
}
@keyframes btnShrink {
  0%   { transform: scaleX(1); opacity: 1; }
  100% { transform: scaleX(0.05) scaleY(0.6); opacity: 0; }
}
@keyframes btnGlow {
  0%,100% { box-shadow: 0 4px 14px rgba(37,99,235,0.35); }
  50%  { box-shadow: 0 0 40px rgba(37,99,235,0.9), 0 0 80px rgba(96,165,250,0.5); }
}
`;

export function GroupPay() {
  const navigate = useNavigate();

  // Search query for groups
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Group for Payment Flow
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  // Flow step: 'select_group' | 'amount' | 'pin' | 'processing' | 'success'
  const [step, setStep] = useState<'select_group' | 'amount' | 'pin' | 'processing' | 'success'>('select_group');
  const [pin, setPin] = useState(['', '', '', '']);
  const [pinError, setPinError] = useState(false);
  const [paidTx, setPaidTx] = useState<{ amount: number; merchant: string; groupName: string; refId: string; note: string } | null>(null);
  const [isLaunching, setIsLaunching] = useState(false);
  const [particles, setParticles] = useState<{ id: number; tx: string; ty: string; color: string }[]>([]);
  const btnRef = useRef<HTMLButtonElement>(null);

  // Active groups
  const activeGroups = useMemo(() => {
    return MOCK_GROUPS.filter(g => g.status === 'active');
  }, []);

  const filteredGroups = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return activeGroups;
    return activeGroups.filter(g => g.name.toLowerCase().includes(q));
  }, [activeGroups, searchQuery]);

  // When user clicks a group
  const handleSelectGroup = (group: Group) => {
    setSelectedGroup(group);
    setMerchant('');
    setAmount('');
    setNote('');
    setIsAddingNote(false);
    setStep('amount');
  };

  // Proceed to PIN Step — with rocket launch animation
  const handleProceedToPin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const payAmt = parseFloat(amount);
    if (!payAmt || payAmt <= 0) return;
    if (isLaunching) return;

    const colors = ['#2563EB','#60A5FA','#38BDF8','#818CF8','#34D399','#FBBF24'];
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      tx: `${(Math.random() - 0.5) * 220}px`,
      ty: `${-(Math.random() * 160 + 40)}px`,
      color: colors[i % colors.length],
    }));
    setParticles(newParticles);
    setIsLaunching(true);

    setTimeout(() => {
      setIsLaunching(false);
      setParticles([]);
      setPin(['', '', '', '']);
      setPinError(false);
      setStep('pin');
    }, 900);
  };

  // Virtual Keypad Handler
  const handleKeypadPress = (val: string) => {
    if (val === 'back') {
      setPin(prev => {
        const next = [...prev];
        const lastFilledIdx = next.map(d => d !== '').lastIndexOf(true);
        if (lastFilledIdx >= 0) next[lastFilledIdx] = '';
        return next;
      });
      return;
    }

    setPin(prev => {
      const next = [...prev];
      const firstEmptyIdx = next.indexOf('');
      if (firstEmptyIdx >= 0) {
        next[firstEmptyIdx] = val;
      }
      return next;
    });
  };

  // Confirm PIN & Process Group Vault Payment
  const handleConfirmPayment = () => {
    const enteredPin = pin.join('');
    if (enteredPin.length < 4) {
      setPinError(true);
      return;
    }

    if (!selectedGroup) return;

    setStep('processing');
    const payAmt = parseFloat(amount);
    const refId = `VAULT/${Math.floor(100000000000 + Math.random() * 900000000000)}`;

    setTimeout(() => {
      // Deduct from group balance
      selectedGroup.balance = Math.max(0, selectedGroup.balance - payAmt);
      selectedGroup.spentThisMonth = (selectedGroup.spentThisMonth || 0) + payAmt;

      setPaidTx({
        amount: payAmt,
        merchant: merchant.trim() || 'Merchant',
        groupName: selectedGroup.name,
        refId,
        note: note.trim(),
      });
      setStep('success');
    }, 1100);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#FFFFFF',
        color: '#0F172A',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Top Header ── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          background: '#FFFFFF',
          borderBottom: '1px solid #F1F5F9',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            onClick={() => {
              if (step === 'amount') {
                setStep('select_group');
                setSelectedGroup(null);
              } else if (step === 'pin') {
                setStep('amount');
              } else {
                navigate('/');
              }
            }}
            aria-label="Back"
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#F8FAFC',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#0F172A',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: '#0F172A', letterSpacing: '-0.2px' }}>
            {step === 'amount' ? 'Pay with Group Vault' : 'Select Group'}
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#64748B', fontSize: 11.5, fontWeight: 600 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.2">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span>Vault</span>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════
          VIEW 1: GROUP SELECTION LIST
          (Minimal, Premium, Classic: JUST the group name, nothing more)
          ══════════════════════════════════════════════════════════ */}
      {step === 'select_group' && (
        <main style={{ padding: '16px 18px 40px', flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Clean Google Pay Search Bar */}
          <div
            style={{
              background: '#F1F5F9',
              borderRadius: 24,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search group"
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: 14.5,
                color: '#0F172A',
                fontWeight: 500,
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: 14 }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Group List: Just the Group Name, Clean & Classic */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 10 }}>
              Your Groups
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {filteredGroups.map((group, idx) => (
                <div
                  key={group.id}
                  onClick={() => handleSelectGroup(group)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 4px',
                    borderBottom: idx < filteredGroups.length - 1 ? '1px solid #F1F5F9' : 'none',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    {/* Minimal Monogram Circle */}
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        background: '#EFF6FF',
                        border: '1.5px solid #DBEAFE',
                        color: '#2563EB',
                        fontSize: 16,
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {group.name.charAt(0).toUpperCase()}
                    </div>

                    {/* ONLY Group Name */}
                    <span
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: '#0F172A',
                        letterSpacing: '-0.2px',
                      }}
                    >
                      {group.name}
                    </span>
                  </div>

                  {/* Clean chevron */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* ══════════════════════════════════════════════════════════
          VIEW 2: GOOGLE PAY PAYMENT SCREEN FOR GROUP VAULT
          (Seamless unified full-screen layout without card boxes)
          ══════════════════════════════════════════════════════════ */}
      {step === 'amount' && selectedGroup && (
        <main
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: '#FFFFFF',
            minHeight: 0,
          }}
        >
          {/* ── Blue-tinted top hero section ── */}
          <div
            style={{
              background: 'linear-gradient(175deg, #EFF6FF 0%, #DBEAFE 45%, #FFFFFF 100%)',
              padding: '28px 24px 32px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            {/* Group monogram with blue ring */}
            <div style={{ position: 'relative', marginBottom: 14 }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #2563EB 0%, #60A5FA 100%)',
                  border: '3px solid #2563EB',
                  boxShadow: '0 0 0 5px rgba(37,99,235,0.12), 0 8px 24px rgba(37,99,235,0.2)',
                  color: '#FFFFFF',
                  fontSize: 28,
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {selectedGroup.name.charAt(0).toUpperCase()}
              </div>
              {/* Vault badge */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: '#1D4ED8',
                  border: '2.5px solid #EFF6FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
            </div>

            <div style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.3px' }}>
              {selectedGroup.name}
            </div>
            <div style={{ fontSize: 12.5, color: '#2563EB', marginTop: 4, fontWeight: 600 }}>
              Group Vault Payment
            </div>

            {/* Merchant input */}
            <div style={{ marginTop: 20, width: '100%', maxWidth: 300 }}>
              <input
                type="text"
                placeholder="Pay to (merchant or recipient)"
                value={merchant}
                onChange={e => setMerchant(e.target.value)}
                autoFocus
                style={{
                  width: '100%',
                  padding: '10px 18px',
                  borderRadius: 24,
                  border: `1.5px solid ${merchant.trim() ? '#2563EB' : '#BFDBFE'}`,
                  background: merchant.trim() ? '#EFF6FF' : '#F8FAFC',
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#0F172A',
                  textAlign: 'center',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s ease',
                }}
              />
            </div>

            {/* Amount input */}
            <div style={{ marginTop: 28, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  borderBottom: `2px solid ${parseFloat(amount) > 0 ? '#2563EB' : '#CBD5E1'}`,
                  paddingBottom: 6,
                  transition: 'border-color 0.2s ease',
                }}
              >
                <span
                  style={{
                    fontSize: 38,
                    fontWeight: 700,
                    color: parseFloat(amount) > 0 ? '#2563EB' : '#94A3B8',
                    lineHeight: 1,
                    transition: 'color 0.2s ease',
                  }}
                >
                  ₹
                </span>
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="0"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  style={{
                    fontSize: 52,
                    fontWeight: 800,
                    color: '#0F172A',
                    border: 'none',
                    outline: 'none',
                    width: '180px',
                    textAlign: 'center',
                    background: 'transparent',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    caretColor: '#2563EB',
                  }}
                />
              </div>

              {/* Note pill */}
              <div style={{ marginTop: 20, width: '100%', maxWidth: 270 }}>
                {isAddingNote || note ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      background: '#EFF6FF',
                      border: '1px solid #BFDBFE',
                      borderRadius: 20,
                      padding: '8px 14px',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Add a note"
                      value={note}
                      onChange={e => setNote(e.target.value)}
                      style={{
                        flex: 1,
                        border: 'none',
                        background: 'transparent',
                        outline: 'none',
                        fontSize: 13,
                        color: '#1E3A8A',
                        fontWeight: 500,
                      }}
                    />
                    {note && (
                      <button
                        type="button"
                        onClick={() => { setNote(''); setIsAddingNote(false); }}
                        style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: 12 }}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsAddingNote(true)}
                    style={{
                      background: 'rgba(37,99,235,0.07)',
                      border: '1px dashed #93C5FD',
                      borderRadius: 20,
                      padding: '7px 18px',
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: '#2563EB',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    <span>Add a note</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── Bottom payment bar ── */}
          <div
            style={{
              padding: '16px 20px calc(20px + env(safe-area-inset-bottom, 12px))',
              borderTop: '1px solid #F1F5F9',
              background: '#FFFFFF',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            {/* Vault source row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: 14,
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    background: 'linear-gradient(135deg, #1D4ED8, #2563EB)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: 13,
                  }}
                >
                  {selectedGroup.name.charAt(0)}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>
                  {selectedGroup.name} Vault
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ fontSize: 11, color: '#2563EB', fontWeight: 600 }}>Shared</span>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Inject keyframe styles */}
            <style>{LAUNCH_STYLES}</style>

            {/* Rocket Launch Pay Button */}
            <div style={{ position: 'relative', width: '100%' }}>
              {particles.map(p => (
                <div
                  key={p.id}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: p.color,
                    pointerEvents: 'none',
                    '--tx': p.tx,
                    '--ty': p.ty,
                    animation: 'particle 0.7s cubic-bezier(0.25,0.46,0.45,0.94) forwards',
                  } as React.CSSProperties}
                />
              ))}

              {isLaunching && (
                <div
                  style={{
                    position: 'fixed',
                    top: btnRef.current ? btnRef.current.getBoundingClientRect().top + 26 : '50%',
                    left: btnRef.current ? btnRef.current.getBoundingClientRect().left + btnRef.current.offsetWidth / 2 : '50%',
                    pointerEvents: 'none',
                    zIndex: 9999,
                    animation: 'planeShoot 0.75s cubic-bezier(0.25,0.46,0.45,0.94) forwards',
                  }}
                >
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
                    <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" fill="#2563EB" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}

              <button
                ref={btnRef}
                type="button"
                onClick={handleProceedToPin}
                disabled={!parseFloat(amount) || parseFloat(amount) <= 0 || !merchant.trim() || isLaunching}
                style={{
                  width: '100%',
                  height: 52,
                  borderRadius: 26,
                  background: (!parseFloat(amount) || parseFloat(amount) <= 0 || !merchant.trim())
                    ? '#CBD5E1'
                    : 'linear-gradient(90deg, #1D4ED8 0%, #2563EB 60%, #3B82F6 100%)',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: 15.5,
                  fontWeight: 700,
                  cursor: (!parseFloat(amount) || parseFloat(amount) <= 0 || !merchant.trim()) ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  position: 'relative',
                  overflow: 'hidden',
                  animation: isLaunching
                    ? 'btnRumble 0.3s ease, btnShrink 0.35s 0.3s ease forwards, btnGlow 0.3s ease'
                    : 'none',
                  boxShadow: (!parseFloat(amount) || parseFloat(amount) <= 0 || !merchant.trim())
                    ? 'none'
                    : '0 6px 20px rgba(37,99,235,0.4)',
                  transition: 'box-shadow 0.2s ease',
                  letterSpacing: '0.01em',
                }}
              >
                {!isLaunching && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M22 2L11 13" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2.2" fill="white" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                <span>
                  {isLaunching ? '🚀 Launching...' : parseFloat(amount) > 0 ? `Pay ${formatINR(parseFloat(amount))}` : 'Enter amount'}
                </span>
              </button>
            </div>
          </div>
        </main>
      )}

      {/* ══════════════════════════════════════════════════════════
          VIEW 3: GOOGLE PAY 4-DIGIT PIN SCREEN
          ══════════════════════════════════════════════════════════ */}
      {step === 'pin' && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: '#0F172A',
            color: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '24px 20px 40px',
            animation: 'fadeIn 0.15s ease',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 14 }}>
              <div>
                <div style={{ fontSize: 12.5, color: '#94A3B8' }}>Paying from {selectedGroup?.name}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF' }}>{merchant}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12.5, color: '#94A3B8' }}>Amount</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#60A5FA' }}>{formatINR(parseFloat(amount))}</div>
              </div>
            </div>

            {note && (
              <div style={{ marginTop: 12, fontSize: 12.5, color: '#94A3B8', textAlign: 'center' }}>
                Note: "{note}"
              </div>
            )}

            <div style={{ textAlign: 'center', marginTop: 44 }}>
              <p style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '0.08em', color: '#94A3B8', textTransform: 'uppercase' }}>
                Enter 4-Digit UPI PIN
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginTop: 24 }}>
                {pin.map((digit, i) => (
                  <div
                    key={i}
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      background: digit !== '' ? '#38BDF8' : 'rgba(255, 255, 255, 0.2)',
                      boxShadow: digit !== '' ? '0 0 12px rgba(56, 189, 248, 0.8)' : 'none',
                      transition: 'all 0.15s ease',
                    }}
                  />
                ))}
              </div>

              {pinError && (
                <p style={{ color: '#F87171', fontSize: 12, marginTop: 14, fontWeight: 600 }}>
                  Please enter your complete 4-digit UPI PIN
                </p>
              )}

              <p style={{ fontSize: 11, color: '#64748B', marginTop: 18 }}>
                Encrypted & secure vault debit authorization
              </p>
            </div>
          </div>

          {/* Virtual Keypad */}
          <div style={{ maxWidth: 320, width: '100%', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleKeypadPress(num)}
                  style={{
                    height: 56,
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: 'none',
                    color: '#FFFFFF',
                    fontSize: 22,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {num}
                </button>
              ))}

              <button
                type="button"
                onClick={() => handleKeypadPress('back')}
                style={{
                  height: 56,
                  borderRadius: '50%',
                  background: 'transparent',
                  border: 'none',
                  color: '#94A3B8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                  <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                  <line x1="18" y1="9" x2="12" y2="15" />
                  <line x1="12" y1="9" x2="18" y2="15" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => handleKeypadPress('0')}
                style={{
                  height: 56,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: 22,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                0
              </button>

              <button
                type="button"
                onClick={handleConfirmPayment}
                style={{
                  height: 56,
                  borderRadius: '50%',
                  background: '#2563EB',
                  border: 'none',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.5)',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          VIEW 4: PROCESSING SPINNER
          ══════════════════════════════════════════════════════════ */}
      {step === 'processing' && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 110,
            background: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              border: '3.5px solid #E2E8F0',
              borderTopColor: '#2563EB',
              animation: 'spin 0.8s linear infinite',
              marginBottom: 20,
            }}
          />
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', margin: '0 0 6px' }}>
            Authorizing Vault Debit
          </h2>
          <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>
            Deducting from {selectedGroup?.name}
          </p>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          VIEW 5: GOOGLE PAY SUCCESS SCREEN
          ══════════════════════════════════════════════════════════ */}
      {step === 'success' && paidTx && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 120,
            background: '#FFFFFF',
            color: '#0F172A',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '40px 24px calc(24px + env(safe-area-inset-bottom, 16px))',
            animation: 'fadeIn 0.25s ease',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: 40 }}>
            <div
              style={{
                width: 76,
                height: 76,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.35)',
                marginBottom: 20,
              }}
            >
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <div style={{ fontSize: 13, fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Paid
            </div>

            <div style={{ fontSize: 38, fontWeight: 800, color: '#0F172A', margin: '6px 0 2px' }}>
              {formatINR(paidTx.amount)}
            </div>

            <div style={{ fontSize: 16, fontWeight: 600, color: '#475569' }}>
              to {paidTx.merchant} from {paidTx.groupName}
            </div>

            {paidTx.note && (
              <div
                style={{
                  marginTop: 14,
                  background: '#F1F5F9',
                  padding: '6px 16px',
                  borderRadius: 16,
                  fontSize: 13,
                  color: '#334155',
                }}
              >
                "{paidTx.note}"
              </div>
            )}


          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
            <button
              onClick={() => navigate('/')}
              style={{
                width: '100%',
                height: 50,
                borderRadius: 25,
                background: '#2563EB',
                border: 'none',
                color: '#FFFFFF',
                fontSize: 15.5,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
              }}
            >
              Done
            </button>
            <button
              onClick={() => navigate(`/groups/${selectedGroup?.id}`)}
              style={{
                width: '100%',
                height: 46,
                borderRadius: 23,
                background: 'transparent',
                border: '1px solid #E2E8F0',
                color: '#2563EB',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              View Group
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
