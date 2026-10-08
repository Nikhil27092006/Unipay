import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UniPayLogo } from '../components/AppHeader';

export function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/otp');
    }, 800);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #EFF6FF 0%, #F5F3FF 100%)',
      display: 'flex',
      flexDirection: 'column',
      padding: '40px 24px',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 40 }}>
        <UniPayLogo />
      </div>

      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{
          width: 80, height: 80, borderRadius: 24,
          background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
          boxShadow: '0 8px 24px rgba(37,99,235,0.3)',
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
              stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#111827', marginBottom: 8 }}>
          Welcome to UniPay
        </h1>
        <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.6 }}>
          Groups. Payments. Together.<br/>
          Your shared wallet, simplified.
        </p>
      </div>

      {/* Form card */}
      <div style={{ background: '#FFFFFF', borderRadius: 24, padding: 24, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label" htmlFor="phone-input">Mobile Number</label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                fontSize: 15, fontWeight: 600, color: '#374151',
              }}>+91</span>
              <input
                id="phone-input"
                type="tel"
                className="input-field"
                placeholder="98765 43210"
                maxLength={10}
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                style={{ paddingLeft: 48, fontFamily: 'monospace', fontSize: 17, fontWeight: 600 }}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={phone.length < 10 || loading}>
            {loading ? 'Sending OTP...' : 'Continue'}
          </button>
        </form>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 20 }}>
          {['256-Bit Secure', 'UPI 2.0', 'RBI Compliant'].map(label => (
            <span key={label} style={{
              fontSize: 10, color: '#9CA3AF', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} />
              {label}
            </span>
          ))}
        </div>
      </div>

      <p style={{ textAlign: 'center', fontSize: 11, color: '#9CA3AF', marginTop: 20, lineHeight: 1.5 }}>
        By continuing, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
}
