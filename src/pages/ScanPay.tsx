import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../components/AppHeader';
import { MOCK_GROUPS, formatINR } from '../data/mockData';
import { EmojiBadge } from '../components/EmojiBadge';

export function ScanPay() {
  const navigate = useNavigate();
  const [selectedGroupId, setSelectedGroupId] = useState(MOCK_GROUPS[0].id);

  return (
    <>
      <AppHeader showBack title="Scan & Pay" />
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
          {MOCK_GROUPS.slice(0, 3).map(g => (
            <div
              key={g.id}
              onClick={() => setSelectedGroupId(g.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 8px',
                borderBottom: '1px solid #F9FAFB',
                background: selectedGroupId === g.id ? g.cardBg : 'transparent',
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
                style={{
                  background: selectedGroupId === g.id ? g.themeColor : '#F3F4F6',
                  color: selectedGroupId === g.id ? '#FFFFFF' : '#4B5563',
                  border: 'none', borderRadius: 10, padding: '6px 14px',
                  fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {selectedGroupId === g.id ? 'Selected' : 'Select'}
              </button>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <button style={{
            flex: 1, padding: 14, borderRadius: 16, background: '#F3F4F6', border: 'none',
            fontSize: 14, fontWeight: 600, color: '#374151', cursor: 'pointer',
          }} onClick={() => navigate('/')}>
            Cancel
          </button>
          <button style={{
            flex: 2, padding: 14, borderRadius: 16, background: '#2563EB', border: 'none',
            fontSize: 14, fontWeight: 700, color: '#FFFFFF', cursor: 'pointer',
          }}>
            Enter UPI ID
          </button>
        </div>
      </div>
    </>
  );
}
