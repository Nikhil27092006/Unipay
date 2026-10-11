import { useState } from 'react';
import { formatINR } from '../data/mockData';

interface AddMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
  onSuccess: (addedAmount: number) => void;
}

export function AddMoneyModal({ isOpen, onClose, currentBalance, onSuccess }: AddMoneyModalProps) {
  const [amount, setAmount] = useState('1000');
  const [selectedMethod, setSelectedMethod] = useState<'hdfc' | 'sbi' | 'upi'>('hdfc');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const quickAmounts = [500, 1000, 2000, 5000];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!num || num <= 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      onSuccess(num);
      setTimeout(() => {
        setIsSuccess(false);
        setAmount('1000');
        onClose();
      }, 1600);
    }, 1000);
  };

  const handleQuickAdd = (val: number) => {
    setAmount(val.toString());
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
    }}>
      {/* Backdrop click */}
      <div
        style={{ position: 'absolute', inset: 0 }}
        onClick={isProcessing ? undefined : onClose}
      />

      {/* Modal Card */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: 420,
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        padding: '24px 20px 32px',
        boxShadow: '0 -10px 40px rgba(15, 23, 42, 0.25)',
        borderTop: '1.5px solid rgba(255, 255, 255, 0.8)',
        animation: 'slideUpModal 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        {/* Grab bar */}
        <div style={{
          width: 44,
          height: 4,
          borderRadius: 2,
          background: '#CBD5E1',
          margin: '0 auto 16px',
        }} />

        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '24px 8px 12px' }}>
            <div style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.35)',
              transform: 'scale(1.05)',
              transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', marginBottom: 6 }}>
              Money Added Successfully!
            </h3>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#059669', marginBottom: 4 }}>
              +{formatINR(parseFloat(amount) || 0)}
            </p>
            <p style={{ fontSize: 13, color: '#64748B' }}>
              Your personal UPI balance has been updated instantly.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <div>
                <h3 style={{ fontSize: 19, fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    background: 'rgba(37, 99, 235, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2563EB',
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </span>
                  Add Money
                </h3>
                <p style={{ fontSize: 12.5, color: '#64748B', marginTop: 2, fontWeight: 500 }}>
                  Current Balance: <strong style={{ color: '#0F172A' }}>{formatINR(currentBalance)}</strong>
                </p>
              </div>

              <button
                onClick={onClose}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  border: 'none',
                  background: '#F1F5F9',
                  color: '#64748B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAdd}>
              {/* Amount Input */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: 18,
                padding: '16px 18px',
                border: '1.5px solid #E2E8F0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                marginBottom: 14,
              }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Enter Amount
                </label>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: 6, gap: 6 }}>
                  <span style={{ fontSize: 28, fontWeight: 800, color: '#0F172A' }}>₹</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="0"
                    min="1"
                    autoFocus
                    style={{
                      width: '100%',
                      border: 'none',
                      outline: 'none',
                      fontSize: 30,
                      fontWeight: 800,
                      color: '#0F172A',
                      fontFamily: 'inherit',
                      background: 'transparent',
                    }}
                  />
                  {amount && (
                    <button
                      type="button"
                      onClick={() => setAmount('')}
                      style={{
                        background: '#E2E8F0',
                        border: 'none',
                        borderRadius: 12,
                        width: 24,
                        height: 24,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#475569',
                        cursor: 'pointer',
                        fontSize: 12,
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Amount Chips */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
                {quickAmounts.map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleQuickAdd(val)}
                    style={{
                      flex: 1,
                      padding: '8px 4px',
                      borderRadius: 12,
                      border: amount === val.toString() ? '1.5px solid #2563EB' : '1px solid #E2E8F0',
                      background: amount === val.toString() ? 'rgba(37, 99, 235, 0.08)' : '#FFFFFF',
                      color: amount === val.toString() ? '#2563EB' : '#334155',
                      fontWeight: 700,
                      fontSize: 12.5,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    +₹{val}
                  </button>
                ))}
              </div>

              {/* Source Account Selector */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#64748B', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Pay From Account
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div
                    onClick={() => setSelectedMethod('hdfc')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      borderRadius: 14,
                      background: selectedMethod === 'hdfc' ? 'rgba(37, 99, 235, 0.06)' : '#FFFFFF',
                      border: selectedMethod === 'hdfc' ? '1.5px solid #2563EB' : '1px solid #E2E8F0',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: '#004B8D',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 800,
                        fontSize: 11,
                      }}>
                        HDFC
                      </div>
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A' }}>HDFC Bank •••• 4092</div>
                        <div style={{ fontSize: 11.5, color: '#64748B' }}>Primary UPI Auto-Pay</div>
                      </div>
                    </div>
                    <div style={{
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      border: selectedMethod === 'hdfc' ? '5px solid #2563EB' : '2px solid #CBD5E1',
                      background: 'white',
                    }} />
                  </div>

                  <div
                    onClick={() => setSelectedMethod('sbi')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      borderRadius: 14,
                      background: selectedMethod === 'sbi' ? 'rgba(37, 99, 235, 0.06)' : '#FFFFFF',
                      border: selectedMethod === 'sbi' ? '1.5px solid #2563EB' : '1px solid #E2E8F0',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: '#22529B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 800,
                        fontSize: 11,
                      }}>
                        SBI
                      </div>
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A' }}>State Bank of India •••• 8821</div>
                        <div style={{ fontSize: 11.5, color: '#64748B' }}>Savings Account</div>
                      </div>
                    </div>
                    <div style={{
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      border: selectedMethod === 'sbi' ? '5px solid #2563EB' : '2px solid #CBD5E1',
                      background: 'white',
                    }} />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!amount || parseFloat(amount) <= 0 || isProcessing}
                style={{
                  width: '100%',
                  padding: '15px 20px',
                  borderRadius: 16,
                  border: 'none',
                  background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                  color: 'white',
                  fontSize: 15,
                  fontWeight: 700,
                  boxShadow: '0 8px 24px rgba(37, 99, 235, 0.3)',
                  cursor: isProcessing ? 'wait' : 'pointer',
                  opacity: (!amount || parseFloat(amount) <= 0) ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'all 0.15s ease',
                }}
              >
                {isProcessing ? (
                  <>
                    <span style={{
                      width: 18,
                      height: 18,
                      border: '2px solid rgba(255,255,255,0.4)',
                      borderTopColor: 'white',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                      display: 'inline-block',
                    }} />
                    Processing Deposit...
                  </>
                ) : (
                  `Deposit ₹${parseFloat(amount) || 0} via UPI`
                )}
              </button>
            </form>
          </>
        )}
      </div>

      <style>{`
        @keyframes slideUpModal {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
