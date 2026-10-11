import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { EntrySplash } from './components/EntrySplash';
import { Dashboard } from './pages/Dashboard';
import { Groups } from './pages/Groups';
import { GroupDetail } from './pages/GroupDetail';
import { CreateGroup } from './pages/CreateGroup';
import { JoinGroup } from './pages/JoinGroup';
import { Activity } from './pages/Activity';
import { Profile } from './pages/Profile';
import { Notifications } from './pages/Notifications';
import { Login } from './pages/Login';
import { OTP } from './pages/OTP';
import { ScanPay } from './pages/ScanPay';
import { TermsAndConditions } from './pages/TermsAndConditions';
import { PrivacyPolicy } from './pages/PrivacyPolicy';

export default function App() {
  return (
    <>
      <EntrySplash />
      <BrowserRouter>
      <Routes>
        {/* Auth screens (no bottom nav) */}
        <Route path="/login" element={<Login />} />
        <Route path="/otp" element={<OTP />} />

        {/* Legal pages (standalone, no bottom nav) */}
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />

        {/* Main app shell with bottom nav */}
        <Route element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/groups/:id" element={<GroupDetail />} />
          <Route path="/create-group" element={<CreateGroup />} />
          <Route path="/join-group" element={<JoinGroup />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/scan" element={<ScanPay />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  );
}
