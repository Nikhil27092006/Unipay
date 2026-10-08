import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../components/AppHeader';
import { MOCK_NOTIFICATIONS, type Notification } from '../data/mockData';
import { EmojiBadge } from '../components/EmojiBadge';

const iconMap: Record<Notification['type'], { icon: string; bg: string; color: string }> = {
  approval: { icon: 'lightning', bg: '#FEF3C7', color: '#D97706' },
  payment: { icon: 'check', bg: '#DCFCE7', color: '#16A34A' },
  contribution: { icon: 'plus', bg: '#DBEAFE', color: '#2563EB' },
  info: { icon: 'info', bg: '#F3F4F6', color: '#6B7280' },
};

export function Notifications() {
  const navigate = useNavigate();
  const unread = MOCK_NOTIFICATIONS.filter(n => !n.read);

  return (
    <>
      <AppHeader showBack title="Notifications" />
      <div className="page-content" style={{ paddingTop: 8 }}>
        {unread.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              New · {unread.length}
            </div>
            <div style={{ background: '#FFFFFF', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              {unread.map((n, i) => <NotifRow key={n.id} n={n} isLast={i === unread.length - 1} />)}
            </div>
          </div>
        )}

        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
            Earlier
          </div>
          <div style={{ background: '#FFFFFF', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            {MOCK_NOTIFICATIONS.filter(n => n.read).map((n, i, arr) => (
              <NotifRow key={n.id} n={n} isLast={i === arr.length - 1} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function NotifRow({ n, isLast }: { n: Notification; isLast: boolean }) {
  const cfg = iconMap[n.type];

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 12,
      padding: '14px 16px',
      borderBottom: isLast ? 'none' : '1px solid #F9FAFB',
      background: !n.read ? '#FAFBFF' : 'transparent',
    }}>
      <EmojiBadge
        name={cfg.icon}
        bg={cfg.bg}
        color={cfg.color}
        size={40}
        shape="squircle"
      />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: !n.read ? 700 : 600, color: '#111827' }}>{n.title}</div>
        <div style={{ fontSize: 12.5, color: '#6B7280', marginTop: 3, lineHeight: 1.4 }}>{n.body}</div>
        <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>{n.timeAgo}</div>
      </div>
      {!n.read && (
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563EB', flexShrink: 0, marginTop: 4 }} />
      )}
    </div>
  );
}
