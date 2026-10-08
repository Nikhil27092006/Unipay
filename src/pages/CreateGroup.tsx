import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../components/AppHeader';
import { EmojiBadge } from '../components/EmojiBadge';

const CATEGORIES = [
  { id: 'flatmates', label: 'Flatmates', icon: 'house', color: '#2563EB' },
  { id: 'trip', label: 'Trip / Vacation', icon: 'trip', color: '#0EA5E9' },
  { id: 'groceries', label: 'Groceries', icon: 'groceries', color: '#16A34A' },
  { id: 'dining', label: 'Dining', icon: 'dining', color: '#F59E0B' },
  { id: 'events', label: 'Events / Party', icon: 'party', color: '#9333EA' },
  { id: 'bills', label: 'Bills', icon: 'bills', color: '#4B5563' },
];

export function CreateGroup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [cap, setCap] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/groups');
    }, 1200);
  };

  return (
    <>
      <AppHeader showBack title="Create Group" />
      <div className="page-content" style={{ paddingTop: 8 }}>
        {/* Step indicators */}
        <div className="step-indicator" style={{ marginBottom: 24 }}>
          {[1, 2, 3].map(s => (
            <div key={s} className={`step-dot ${s < step ? 'done' : s === step ? 'active' : ''}`} />
          ))}
        </div>

        {step === 1 && (
          <div className="animate-in">
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>Name your group</h2>
            <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 24 }}>Give your shared wallet a clear name</p>
            <div className="input-group">
              <label className="input-label">Group Name</label>
              <input
                className="input-field"
                placeholder="e.g. Flatmates, Goa Trip..."
                value={name}
                onChange={e => setName(e.target.value)}
                autoFocus
              />
            </div>
            <button className="btn-primary" disabled={!name.trim()} onClick={() => setStep(2)}>
              Continue →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in">
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>Choose a category</h2>
            <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 20 }}>This helps organize your wallet</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
              {CATEGORIES.map(c => (
                <button key={c.id} onClick={() => setCategory(c.id)} style={{
                  background: category === c.id ? c.color : '#FFFFFF',
                  border: `2px solid ${category === c.id ? c.color : '#E5E7EB'}`,
                  borderRadius: 16, padding: '14px 12px',
                  display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                  transition: 'all 0.15s',
                }}>
                  <EmojiBadge
                    name={c.icon}
                    bg={category === c.id ? 'rgba(255,255,255,0.25)' : c.color}
                    color="#FFFFFF"
                    size={36}
                    shape="circle"
                  />
                  <span style={{ fontSize: 13, fontWeight: 600, color: category === c.id ? '#FFFFFF' : '#374151' }}>
                    {c.label}
                  </span>
                </button>
              ))}
            </div>
            <button className="btn-primary" disabled={!category} onClick={() => setStep(3)}>
              Continue →
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in">
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>Set spending cap</h2>
            <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 24 }}>Maximum total balance for this group wallet</p>
            <div className="input-group">
              <label className="input-label">Spending Cap (₹)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 18, fontWeight: 700, color: '#374151' }}>₹</span>
                <input
                  className="input-field"
                  type="number"
                  placeholder="10,000"
                  value={cap}
                  onChange={e => setCap(e.target.value)}
                  style={{ paddingLeft: 36, fontSize: 22, fontWeight: 700 }}
                />
              </div>
            </div>

            <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 12, padding: 14, marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#15803D', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <EmojiBadge name="check" size={16} shape="circle" />
                Group Summary
              </div>
              <div style={{ fontSize: 13, color: '#374151' }}>
                <div><strong>{name}</strong> · {CATEGORIES.find(c => c.id === category)?.label}</div>
                {cap && <div style={{ marginTop: 4 }}>Cap: ₹{parseInt(cap).toLocaleString('en-IN')}</div>}
              </div>
            </div>

            <button className="btn-primary" disabled={!cap || loading} onClick={handleCreate}>
              {loading ? (
                'Creating Group...'
              ) : (
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <EmojiBadge name="party" size={18} shape="none" color="#FFFFFF" />
                  Create Group
                </span>
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

