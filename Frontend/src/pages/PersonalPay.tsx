import { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MOCK_CONTACTS, CURRENT_USER, MOCK_PERSONAL_PAYMENTS,
  formatINR, type Contact, type PersonalPayment
} from '../data/mockData';

// ── Rocket Launch Keyframes ──────────────────────────────────────────────────
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
  100% { transform: scaleX(0.05) scaleY(0.6); opacity: 0; border-radius: 50%; }
}
@keyframes btnGlow {
  0%,100% { box-shadow: 0 4px 14px rgba(37,99,235,0.35); }
  50%  { box-shadow: 0 0 40px rgba(37,99,235,0.9), 0 0 80px rgba(96,165,250,0.5); }
}
`;

export function PersonalPay() {
  const navigate = useNavigate();

  // Search & Contact Selection State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState<Contact | { name: string; upiId: string; phone?: string; avatar?: string } | null>(null);

  // Payment Form States
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  // Google Pay Flow Steps: 'contacts' | 'amount' | 'pin' | 'processing' | 'success'
  const [step, setStep] = useState<'contacts' | 'amount' | 'pin' | 'processing' | 'success'>('contacts');
  const [pin, setPin] = useState(['', '', '', '']);
  const [pinError, setPinError] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [particles, setParticles] = useState<{ id: number; tx: string; ty: string; color: string }[]>([]);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [txDetails, setTxDetails] = useState<{
    id: string;
    amount: number;
    recipientName: string;
    upiId: string;
    note: string;
    time: string;
    refNo: string;
  } | null>(null);

  // Filtered contacts
  const filteredContacts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return MOCK_CONTACTS;
    return MOCK_CONTACTS.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.upiId.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const recentContacts = useMemo(() => {
    return MOCK_CONTACTS.filter(c => c.isRecent);
  }, []);

  // Open Payment Screen for a contact
  const handleSelectContact = (contact: Contact | { name: string; upiId: string; phone?: string; avatar?: string }) => {
    setSelectedRecipient(contact);
    setAmount('');
    setNote('');
    setIsAddingNote(false);
    setStep('amount');
  };

  // If user typed a custom UPI ID or number not in contacts
  const handlePayCustomInput = () => {
    if (!searchQuery.trim()) return;
    const isUpi = searchQuery.includes('@');
    const customContact = {
      name: isUpi ? searchQuery.split('@')[0].toUpperCase() : `User ${searchQuery.slice(-4)}`,
      upiId: isUpi ? searchQuery.trim() : `${searchQuery.replace(/\D/g, '')}@upi`,
      phone: !isUpi ? searchQuery.trim() : undefined,
    };
    handleSelectContact(customContact);
  };

  // Proceed to PIN Step — with rocket launch animation
  const handleProceedToPin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (!numericAmount || numericAmount <= 0) return;
    if (isLaunching) return;

    // Burst particles
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

  // Keypad Click for PIN
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

  // Confirm PIN and Process Payment
  const handleConfirmPayment = () => {
    const enteredPin = pin.join('');
    if (enteredPin.length < 4) {
      setPinError(true);
      return;
    }

    setStep('processing');
    const payAmt = parseFloat(amount);
    const now = new Date();
    const timeStr = `Today, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const refId = `UPI/${Math.floor(100000000000 + Math.random() * 900000000000)}`;

    setTimeout(() => {
      // Deduct balance internally
      CURRENT_USER.personalBalance = Math.max(0, CURRENT_USER.personalBalance - payAmt);

      // Add to mock history
      const newTx: PersonalPayment = {
        id: `upi_${Date.now()}`,
        merchant: selectedRecipient?.name || 'Contact',
        note: note.trim() || 'UPI Transfer',
        amount: payAmt,
        dir: 'paid',
        date: timeStr,
        status: 'success',
        upiRef: refId.replace('UPI/', ''),
        account: 'HDFC Bank •••• 4921',
        paymentMode: 'UPI ID',
        category: 'Personal Transfer',
      };
      MOCK_PERSONAL_PAYMENTS.unshift(newTx);

      setTxDetails({
        id: newTx.id,
        amount: payAmt,
        recipientName: selectedRecipient?.name || 'Recipient',
        upiId: selectedRecipient?.upiId || '',
        note: note.trim(),
        time: timeStr,
        refNo: refId,
      });

      setStep('success');
    }, 1200);
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
      {/* ── Top Header (Minimalist & Clean - No balance pill) ── */}
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
                setStep('contacts');
                setSelectedRecipient(null);
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
              transition: 'background 0.15s ease',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: '#0F172A', letterSpacing: '-0.2px' }}>
              {step === 'amount' ? 'Pay' : 'Personal Payment'}
            </h1>
          </div>
        </div>

        {/* Secure UPI Badge on right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#64748B', fontSize: 11.5, fontWeight: 600 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.2">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span>UPI</span>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════
          VIEW 1: CONTACTS & SEARCH LIST
          ══════════════════════════════════════════════════════════ */}
      {step === 'contacts' && (
        <main style={{ padding: '16px 18px 40px', flex: 1, display: 'flex', flexDirection: 'column', gap: 22 }}>
          {/* Google Pay Style Rounded Search Bar */}
          <div
            style={{
              background: '#F1F5F9',
              borderRadius: 24,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              border: '1px solid transparent',
              transition: 'border-color 0.15s ease, background 0.15s ease',
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
              placeholder="Pay by name, phone or UPI ID"
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
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Pay custom entry button if query entered */}
          {searchQuery.trim().length > 2 && (
            <div
              onClick={handlePayCustomInput}
              style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: 18,
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(15, 23, 42, 0.04)',
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  background: '#2563EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: 16,
                }}
              >
                ₹
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>
                  Pay "{searchQuery}"
                </div>
                <div style={{ fontSize: 12, color: '#64748B' }}>
                  Send via UPI directly
                </div>
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#2563EB' }}>Proceed →</span>
            </div>
          )}

          {/* Recent Contacts Carousel */}
          {!searchQuery && recentContacts.length > 0 && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 14 }}>
                Recent
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: 16,
                  overflowX: 'auto',
                  scrollbarWidth: 'none',
                  paddingBottom: 4,
                }}
              >
                {recentContacts.map(contact => (
                  <button
                    key={contact.id}
                    onClick={() => handleSelectContact(contact)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      flexShrink: 0,
                      width: 64,
                    }}
                  >
                    <div
                      style={{
                        position: 'relative',
                        width: 54,
                        height: 54,
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: '1.5px solid #E2E8F0',
                      }}
                    >
                      <img src={contact.avatar} alt={contact.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#0F172A',
                        marginTop: 7,
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        width: '100%',
                      }}
                    >
                      {contact.name.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Contacts List */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 10 }}>
              All Contacts
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {filteredContacts.map((contact, idx) => (
                <div
                  key={contact.id}
                  onClick={() => handleSelectContact(contact)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '12px 4px',
                    borderBottom: idx < filteredContacts.length - 1 ? '1px solid #F8FAFC' : 'none',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease',
                  }}
                >
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      flexShrink: 0,
                      border: '1px solid #F1F5F9',
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 600, color: '#0F172A' }}>
                      {contact.name}
                    </div>
                    <div style={{ fontSize: 12, color: '#64748B', marginTop: 1 }}>
                      {contact.phone}
                    </div>
                  </div>
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
          VIEW 2: GOOGLE PAY AUTHENTIC AMOUNT & NOTE SCREEN
          (Seamless unified full-screen layout without card boxes)
          ══════════════════════════════════════════════════════════ */}
      {step === 'amount' && selectedRecipient && (
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
              position: 'relative',
            }}
          >
            {/* Avatar with blue ring */}
            <div
              style={{
                position: 'relative',
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '3px solid #2563EB',
                  boxShadow: '0 0 0 5px rgba(37,99,235,0.12), 0 8px 24px rgba(37,99,235,0.18)',
                }}
              >
                {selectedRecipient.avatar ? (
                  <img src={selectedRecipient.avatar} alt={selectedRecipient.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#2563EB,#60A5FA)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 700 }}>
                    {selectedRecipient.name[0]}
                  </div>
                )}
              </div>
              {/* Verified badge */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: '#2563EB',
                  border: '2.5px solid #EFF6FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>

            <div style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.3px' }}>
              {selectedRecipient.name}
            </div>
            <div style={{ fontSize: 12.5, color: '#2563EB', marginTop: 4, fontWeight: 600 }}>
              {selectedRecipient.upiId}
            </div>
            <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>Banking name verified</div>

            {/* Amount input row */}
            <div style={{ marginTop: 36, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                  autoFocus
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
                      autoFocus
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

          {/* ── Bottom fixed payment bar ── */}
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
            {/* Bank row */}
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
                    fontSize: 9,
                    letterSpacing: 0.5,
                  }}
                >
                  HDFC
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>
                  HDFC Bank •••• 4921
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ fontSize: 11, color: '#2563EB', fontWeight: 600 }}>UPI</span>
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
                    // @ts-ignore
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
                disabled={!parseFloat(amount) || parseFloat(amount) <= 0 || isLaunching}
                style={{
                  width: '100%',
                  height: 52,
                  borderRadius: 26,
                  background: (!parseFloat(amount) || parseFloat(amount) <= 0)
                    ? '#CBD5E1'
                    : 'linear-gradient(90deg, #1D4ED8 0%, #2563EB 60%, #3B82F6 100%)',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: 15.5,
                  fontWeight: 700,
                  cursor: (!parseFloat(amount) || parseFloat(amount) <= 0) ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  position: 'relative',
                  overflow: 'hidden',
                  animation: isLaunching
                    ? 'btnRumble 0.3s ease, btnShrink 0.35s 0.3s ease forwards, btnGlow 0.3s ease'
                    : 'none',
                  boxShadow: (!parseFloat(amount) || parseFloat(amount) <= 0)
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
          VIEW 3: GOOGLE PAY AUTHENTIC 4-DIGIT UPI PIN SCREEN
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
          {/* Top Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 14 }}>
              <div>
                <div style={{ fontSize: 12.5, color: '#94A3B8' }}>Paying to</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF' }}>{selectedRecipient?.name}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12.5, color: '#94A3B8' }}>Amount</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#60A5FA' }}>{formatINR(parseFloat(amount))}</div>
              </div>
            </div>

            {/* Note Display if provided */}
            {note && (
              <div style={{ marginTop: 12, fontSize: 12.5, color: '#94A3B8', textAlign: 'center' }}>
                Note: "{note}"
              </div>
            )}

            {/* PIN Dots Area */}
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
                UPI PIN is encrypted & never shared with anyone
              </p>
            </div>
          </div>

          {/* Virtual Keypad (Authentic GPay Grid) */}
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
                    transition: 'background 0.1s ease',
                  }}
                  onMouseDown={e => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)')}
                  onMouseUp={e => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)')}
                >
                  {num}
                </button>
              ))}

              {/* Backspace */}
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

              {/* Zero */}
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
                onMouseDown={e => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)')}
                onMouseUp={e => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)')}
              >
                0
              </button>

              {/* Submit Checkmark Button */}
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
            Processing Payment
          </h2>
          <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>
            Contacting bank UPI server
          </p>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          VIEW 5: GOOGLE PAY SUCCESS SCREEN
          ══════════════════════════════════════════════════════════ */}
      {step === 'success' && txDetails && (
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
            {/* Animated Green Checkmark Bubble */}
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
              {formatINR(txDetails.amount)}
            </div>

            <div style={{ fontSize: 16, fontWeight: 600, color: '#475569' }}>
              to {txDetails.recipientName}
            </div>

            {txDetails.note && (
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
                "{txDetails.note}"
              </div>
            )}

            {/* Receipt Summary */}
            <div
              style={{
                marginTop: 36,
                width: '100%',
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: 18,
                padding: '16px 18px',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 12, color: '#64748B' }}>UPI Ref ID</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#0F172A', fontFamily: 'monospace' }}>{txDetails.refNo}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 12, color: '#64748B' }}>To UPI ID</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>{txDetails.upiId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: '#64748B' }}>From Account</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>HDFC Bank •••• 4921</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
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
              onClick={() => navigate('/activity?tab=personal')}
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
              View in Activity
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
