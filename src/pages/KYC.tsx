import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../components/AppHeader';
import { EmojiBadge } from '../components/EmojiBadge';

export function KYC() {
  const navigate = useNavigate();
  const [pan, setPan] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1000);
  };

  if (success) {
    return (
      <>
        <AppHeader showBack title="KYC Verification" />
        <div className="page-content" style={{ paddingTop: 24, textAlign: 'center' }}>
          <div style={{
            width: 80, height: 80, borderRadius: 24,
            background: 'linear-gradient(135deg, #16A34A, #22C55E)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111827', marginBottom: 8 }}>KYC Verified!</h2>
          <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 32, lineHeight: 1.6 }}>
            Your identity has been verified.<br/>You can now use all UniPay features.
          </p>
          <button className="btn-primary" onClick={() => navigate('/')}>
            Go to Dashboard
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <AppHeader showBack title="KYC Verification" />
      <div className="page-content" style={{ paddingTop: 8 }}>
        <div style={{
          background: '#DBEAFE', border: '1px solid #93C5FD',
          borderRadius: 14, padding: 14, marginBottom: 24,
          display: 'flex', gap: 10, alignItems: 'flex-start',
        }}>
          <EmojiBadge name="shield" size={22} shape="none" color="#1D4ED8" />
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1D4ED8' }}>Secure & Encrypted</div>
            <div style={{ fontSize: 12, color: '#3B82F6', marginTop: 2 }}>
              Your data is encrypted and never stored on our servers. Verified by NSDL & UIDAI.
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">PAN Number</label>
            <input
              className="input-field"
              placeholder="ABCDE1234F"
              maxLength={10}
              value={pan}
              onChange={e => setPan(e.target.value.toUpperCase())}
              style={{ fontFamily: 'monospace', fontSize: 17, fontWeight: 700 }}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Aadhaar Number</label>
            <input
              className="input-field"
              type="tel"
              placeholder="1234 5678 9012"
              maxLength={12}
              value={aadhaar}
              onChange={e => setAadhaar(e.target.value.replace(/\D/g, ''))}
              style={{ fontFamily: 'monospace', fontSize: 17, fontWeight: 700 }}
            />
          </div>

          <button
            type="button"
            onClick={() => { setPan('ABCDE1234F'); setAadhaar('543298761234'); }}
            style={{ fontSize: 12, color: '#7C3AED', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', marginBottom: 20 }}
          >
            Use demo data →
          </button>

          <button type="submit" className="btn-primary" disabled={!pan || !aadhaar || loading}>
            {loading ? 'Verifying...' : 'Verify Now'}
          </button>
        </form>
      </div>
    </>
  );
}
