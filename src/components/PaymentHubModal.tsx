import { useNavigate } from 'react-router-dom';

interface PaymentHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess?: (payment: any) => void;
}

export function PaymentHubModal({ isOpen, onClose }: PaymentHubModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSelectPersonal = () => {
    onClose();
    navigate('/pay/personal');
  };

  const handleSelectGroup = () => {
    onClose();
    navigate('/pay/group');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.42)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 9000,
          animation: 'fadeIn 0.18s ease',
        }}
      />

      {/* Humanized Sheet with Blue & Light Blue Palette */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Payment Mode Selection"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9001,
          maxWidth: 440,
          margin: '0 auto',
          background: '#FFFFFF',
          borderRadius: '26px 26px 0 0',
          borderTop: '1px solid #E2E8F0',
          boxShadow: '0 -16px 40px rgba(15, 23, 42, 0.14)',
          padding: '12px 20px calc(24px + env(safe-area-inset-bottom, 16px))',
          animation: 'hubSheetSpring 0.34s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Subtle Drag Indicator */}
        <div
          style={{
            width: 38,
            height: 4,
            borderRadius: 3,
            background: '#E2E8F0',
            margin: '0 auto 20px',
          }}
        />

        {/* ── Option 1: Personal Payment (Rich Royal Blue) ── */}
        <button
          onClick={handleSelectPersonal}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 15,
            padding: '16px 18px',
            borderRadius: 18,
            background: '#FFFFFF',
            border: '1.5px solid #DBEAFE',
            cursor: 'pointer',
            marginBottom: 12,
            textAlign: 'left',
            boxShadow: '0 2px 10px rgba(37, 99, 235, 0.05)',
            animation: 'hubOptionBloom 0.28s cubic-bezier(0.16, 1, 0.3, 1) 0.04s backwards',
            transition: 'all 0.16s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#93C5FD';
            e.currentTarget.style.background = '#F8FAFC';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 6px 18px rgba(37, 99, 235, 0.12)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#DBEAFE';
            e.currentTarget.style.background = '#FFFFFF';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 10px rgba(37, 99, 235, 0.05)';
          }}
          onMouseDown={e => {
            e.currentTarget.style.transform = 'scale(0.985)';
          }}
          onMouseUp={e => {
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
        >
          {/* Deep Blue Icon Container */}
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 14,
              background: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.28)',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>

          {/* Title & Micro-subtitle */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.2px' }}>
              Personal Payment
            </div>
            <div style={{ fontSize: 12.5, color: '#64748B', marginTop: 2, fontWeight: 500 }}>
              Pay via UPI, mobile or contacts
            </div>
          </div>

          {/* Clean Arrow Badge */}
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#EFF6FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        </button>

        {/* ── Option 2: Group Vault (Light Blue / Sky Blue) ── */}
        <button
          onClick={handleSelectGroup}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 15,
            padding: '16px 18px',
            borderRadius: 18,
            background: '#FFFFFF',
            border: '1.5px solid #E0F2FE',
            cursor: 'pointer',
            textAlign: 'left',
            boxShadow: '0 2px 10px rgba(2, 132, 199, 0.05)',
            animation: 'hubOptionBloom 0.28s cubic-bezier(0.16, 1, 0.3, 1) 0.1s backwards',
            transition: 'all 0.16s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#BAE6FD';
            e.currentTarget.style.background = '#F8FAFC';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 6px 18px rgba(2, 132, 199, 0.12)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#E0F2FE';
            e.currentTarget.style.background = '#FFFFFF';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 10px rgba(2, 132, 199, 0.05)';
          }}
          onMouseDown={e => {
            e.currentTarget.style.transform = 'scale(0.985)';
          }}
          onMouseUp={e => {
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
        >
          {/* Light Blue Icon Container */}
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.28)',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>

          {/* Title & Micro-subtitle */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.2px' }}>
              Group Vault
            </div>
            <div style={{ fontSize: 12.5, color: '#64748B', marginTop: 2, fontWeight: 500 }}>
              Pay from shared co-wallet balance
            </div>
          </div>

          {/* Clean Arrow Badge */}
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#F0F9FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        </button>
      </div>
    </>
  );
}
