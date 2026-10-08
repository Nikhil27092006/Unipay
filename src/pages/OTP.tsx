import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UniPayLogo } from '../components/AppHeader';

export function OTP() {
  const navigate = useNavigate();
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (idx: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...digits];
    next[idx] = val.slice(-1);
    setDigits(next);
    if (val && idx < 5) refs.current[idx + 1]?.focus();

    // Auto submit on fill
    const filled = next.join('');
    if (filled.length === 6) {
      setLoading(true);
      setTimeout(() => navigate('/'), 1000);
    }
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      refs.current[idx - 1]?.focus();
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #EFF6FF 0%, #F5F3FF 100%)',
      display: 'flex', flexDirection: 'column', padding: '40px 24px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 48 }}>
        <UniPayLogo />
      </div>

      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginBottom: 8 }}>Enter OTP</h1>
        <p style={{ fontSize: 14, color: '#6B7280' }}>
          We sent a 6-digit code to<br/>
          <strong style={{ color: '#111827' }}>+91 98765 43210</strong>
        </p>
      </div>

      <div style={{ background: '#FFFFFF', borderRadius: 24, padding: 24, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <div className="otp-inputs" style={{ marginBottom: 24 }}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={el => (refs.current[i] = el)}
              type="tel"
              maxLength={1}
              value={d}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              className="otp-digit"
              autoFocus={i === 0}
            />
          ))}
        </div>

        <button
          className="btn-primary"
          disabled={digits.join('').length < 6 || loading}
          onClick={() => {
            setLoading(true);
            setTimeout(() => navigate('/'), 1000);
          }}
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <span style={{ fontSize: 13, color: '#6B7280' }}>Didn't receive? </span>
          <button style={{ fontSize: 13, color: '#2563EB', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
            Resend in 30s
          </button>
        </div>
      </div>
    </div>
  );
}
