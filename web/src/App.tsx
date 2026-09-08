import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { GuardianLayout } from './components/GuardianLayout';
import { useAuth } from './lib/auth';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import {
  ActivityPage,
  AllowlistPage,
  ProofInboxPage,
} from './pages/MiscPages';
import { SettingsPage } from './pages/SettingsPage';
import { SignupPage } from './pages/SignupPage';
import { TasksPage } from './pages/TasksPage';

function RequireAuth() {
  const { me, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-body-md text-on-surface-variant">
        Loading…
      </div>
    );
  }
  if (!me) return <Navigate to="/auth/login" replace />;
  return <Outlet />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/guardian" replace />} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/signup" element={<SignupPage />} />
      <Route element={<RequireAuth />}>
        <Route path="/guardian" element={<GuardianLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="allowlist" element={<AllowlistPage />} />
          <Route path="activity" element={<ActivityPage />} />
          <Route path="proof" element={<ProofInboxPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/guardian" replace />} />
    </Routes>
  );
}
