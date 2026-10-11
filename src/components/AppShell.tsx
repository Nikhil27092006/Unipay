import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { PaymentHubModal } from './PaymentHubModal';

const NO_NAV_ROUTES = ['/login', '/otp', '/onboarding', '/kyc'];

export function AppShell() {
  const location = useLocation();
  const [showPayModal, setShowPayModal] = useState(false);
  const isGroupDetail = /^\/groups\/[^/]+/.test(location.pathname);
  const showNav = !NO_NAV_ROUTES.some(r => location.pathname.startsWith(r)) && !isGroupDetail;

  useEffect(() => {
    const handleOpenPay = () => setShowPayModal(true);
    window.addEventListener('cowallet-open-payment-modal', handleOpenPay);
    return () => window.removeEventListener('cowallet-open-payment-modal', handleOpenPay);
  }, []);

  return (
    <div className="app-frame">
      <div className="page-scroll" style={{ paddingBottom: showNav ? 'calc(80px + env(safe-area-inset-bottom, 0px))' : 0 }}>
        <Outlet />
      </div>
      {showNav && <BottomNav onOpenPay={() => setShowPayModal(true)} />}

      {/* Floating Tinted Glass Payment Hub Modal */}
      <PaymentHubModal
        isOpen={showPayModal}
        onClose={() => setShowPayModal(false)}
      />
    </div>
  );
}

