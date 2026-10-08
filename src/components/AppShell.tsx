import { Outlet, useLocation } from 'react-router-dom';
import { BottomNav } from './BottomNav';

const NO_NAV_ROUTES = ['/login', '/otp', '/onboarding', '/kyc'];

export function AppShell() {
  const location = useLocation();
  const isGroupDetail = /^\/groups\/[^/]+/.test(location.pathname);
  const showNav = !NO_NAV_ROUTES.some(r => location.pathname.startsWith(r)) && !isGroupDetail;

  return (
    <div className="app-frame">
      <div className="page-scroll" style={{ paddingBottom: showNav ? 'calc(80px + env(safe-area-inset-bottom, 0px))' : 0 }}>
        <Outlet />
      </div>
      {showNav && <BottomNav />}
    </div>
  );
}
