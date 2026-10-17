import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../components/AppHeader';
import { EmojiBadge } from '../components/EmojiBadge';

export function JoinGroup() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<null | { name: string; members: number; balance: string }>(null);

  const handleLookup = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPreview({ name: 'Weekend Group', members: 4, balance: '₹2,350' });
    }, 800);
  };

  const handleJoin = () => {
    setLoading(true);
    setTimeout(() => navigate('/groups/g3'), 1000);
  };

  return (
    <>
      <AppHeader showBack title="Join a Group" />
      <div className="page-content" style={{ paddingTop: 8 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 80, height: 80, borderRadius: 24,
            background: 'linear-gradient(135deg, #7C3AED, #2563EB)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111827', marginBottom: 8 }}>Join a Group</h2>
          <p style={{ fontSize: 14, color: '#6B7280' }}>Enter the invite code shared by the group admin</p>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: 20, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 16 }}>
          <div className="input-group" style={{ marginBottom: 16 }}>
            <label className="input-label">Invite Code</label>
            <input
              className="input-field"
              placeholder="e.g. FLAT-7X2K"
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              style={{ fontFamily: 'monospace', fontSize: 20, fontWeight: 800, textAlign: 'center', letterSpacing: '0.1em' }}
            />
          </div>
          <button className="btn-primary" disabled={!code || loading} onClick={handleLookup}>
            {loading ? 'Looking up...' : 'Find Group'}
          </button>
        </div>

        {preview && (
          <div className="animate-in" style={{ background: '#FFFFFF', borderRadius: 20, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <EmojiBadge name="weekend" bg="#0D9488" color="#FFFFFF" size={48} shape="circle" />
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>{preview.name}</div>
                <div style={{ fontSize: 13, color: '#6B7280' }}>{preview.members} members · {preview.balance} balance</div>
              </div>
            </div>
            <button className="btn-primary" onClick={handleJoin}>
              {loading ? (
                'Joining...'
              ) : (
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <EmojiBadge name="check" size={16} shape="none" color="#FFFFFF" />
                  Join This Group
                </span>
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
