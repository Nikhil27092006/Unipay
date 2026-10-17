import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../components/AppHeader';
import { MOCK_GROUPS, formatINR, CURRENT_USER } from '../data/mockData';
import { EmojiBadge } from '../components/EmojiBadge';

export function ScanPay() {
  const navigate = useNavigate();
  // By default, no group or payment option is selected
  const [selectedSource, setSelectedSource] = useState<string | 'personal' | null>(null);

  const handleToggleGroup = (groupId: string) => {
    setSelectedSource(prev => (prev === groupId ? null : groupId));
  };

  const handleTogglePersonal = () => {
    setSelectedSource(prev => (prev === 'personal' ? null : 'personal'));
  };

  const handleProceed = () => {
    if (selectedSource === 'personal') {
      navigate('/pay/personal');
    } else if (selectedSource) {
      navigate('/pay/group');
    } else {
      navigate('/pay/personal');
    }
  };

  return (
    <>
      <AppHeader showBack title="Scan QR" />
      <div className="page-content" style={{ paddingTop: 8 }}>
        {/* QR Scanner mockup */}
        <div style={{
          background: '#0F172A', borderRadius: 24, padding: 0, marginBottom: 20,
          overflow: 'hidden', aspectRatio: '1 / 1', position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(15,23,42,0.18)',
        }}>
          {/* Viewfinder Target */}
          <div style={{
            width: 200, height: 200, border: '2px solid rgba(255,255,255,0.2)',
            borderRadius: 20, position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {/* Animated Laser line */}
            <div style={{
              width: '90%', height: 3,
              background: 'linear-gradient(90deg, transparent, #3B82F6, #60A5FA, transparent)',
              borderRadius: 2,
              boxShadow: '0 0 16px #3B82F6, 0 0 8px #60A5FA',
              animation: 'scanLaser 2.2s infinite ease-in-out',
            }} />
          </div>

          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 500, position: 'absolute', bottom: 20 }}>
            Align QR code within the frame
          </p>
        </div>

        {/* Pay from group */}
        <div style={{ background: '#FFFFFF', borderRadius: 18, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 12 }}>Pay from Group</div>
          {MOCK_GROUPS.slice(0, 3).map((g, idx) => {
            const isSelected = selectedSource === g.id;
            return (
              <div
                key={g.id}
                onClick={() => handleToggleGroup(g.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '10px 8px',
                  borderBottom: idx < 2 ? '1px solid #F9FAFB' : 'none',
                  background: isSelected ? (g.cardBg || '#DBEAFE') : 'transparent',
                  borderRadius: 12,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <EmojiBadge
                  name={g.icon}
                  bg={g.iconBg}
                  color={g.iconColor}
                  size={38}
                  shape="circle"
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{g.name}</div>
                  <div style={{ fontSize: 12, color: '#6B7280' }}>{formatINR(g.balance)} available</div>
                </div>
                <button
                  type="button"
                  style={{
                    background: isSelected ? g.themeColor : '#F3F4F6',
                    color: isSelected ? '#FFFFFF' : '#4B5563',
                    border: 'none', borderRadius: 10, padding: '6px 14px',
                    fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {isSelected ? 'Selected' : 'Select'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Personal Payment Option - Just below group selection */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: 18,
          padding: 16,
          marginTop: 12,
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 12 }}>Personal Payment</div>
          <div
            onClick={handleTogglePersonal}
            style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 8px',
              background: selectedSource === 'personal' ? '#DBEAFE' : 'transparent',
              borderRadius: 12,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <EmojiBadge
              name="user"
              bg="#2563EB"
              color="#FFFFFF"
              size={38}
              shape="circle"
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Personal Account</div>
              <div style={{ fontSize: 12, color: '#6B7280' }}>
                {CURRENT_USER.upiId} • {formatINR(CURRENT_USER.personalBalance)} available
              </div>
            </div>
            <button
              type="button"
              style={{
                background: selectedSource === 'personal' ? '#2563EB' : '#F3F4F6',
                color: selectedSource === 'personal' ? '#FFFFFF' : '#4B5563',
                border: 'none', borderRadius: 10, padding: '6px 14px',
                fontSize: 12, fontWeight: 700, cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {selectedSource === 'personal' ? 'Selected' : 'Select'}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <button style={{
            flex: 1, padding: 14, borderRadius: 16, background: '#F3F4F6', border: 'none',
            fontSize: 14, fontWeight: 600, color: '#374151', cursor: 'pointer',
          }} onClick={() => navigate('/')}>
            Cancel
          </button>
          <button
            onClick={handleProceed}
            style={{
              flex: 2, padding: 14, borderRadius: 16, background: '#2563EB', border: 'none',
              fontSize: 14, fontWeight: 700, color: '#FFFFFF', cursor: 'pointer',
            }}
          >
            {selectedSource ? 'Proceed to Pay' : 'Enter UPI ID'}
          </button>
        </div>
      </div>
    </>
  );
}
