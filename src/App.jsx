import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, CurrencyProvider, ToastProvider, SearchProvider, NotificationProvider } from './context';
import { ProtectedRoute } from './auth';
import './App.css';

// Lazy load pages for better performance
const LandingPage        = lazy(() => import('./pages/LandingPage'));
const DashboardPage      = lazy(() => import('./pages/DashboardPage'));
const InvestmentsPage    = lazy(() => import('./pages/InvestmentsPage'));
const CommunityPage      = lazy(() => import('./pages/CommunityPage'));
const HelpPage           = lazy(() => import('./pages/HelpPage'));
const ProfilePage        = lazy(() => import('./pages/ProfilePage'));
const NotificationsPage  = lazy(() => import('./pages/NotificationsPage'));
const CryptoDepositPage  = lazy(() => import('./pages/CryptoDepositPage'));
const CryptoWithdrawPage = lazy(() => import('./pages/CryptoWithdrawPage'));
const TransactionsPage   = lazy(() => import('./pages/TransactionsPage'));
const ReferralsPage      = lazy(() => import('./pages/ReferralsPage'));
const MaintenancePage    = lazy(() => import('./pages/MaintenancePage'));

const Loader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#0a1f0a]">
    <div className="w-10 h-10 rounded-full border-2 border-[#a3e635]/20 border-t-[#a3e635] animate-spin" />
  </div>
);

function App() {
  return (
    <SearchProvider>
      <AuthProvider>
        <NotificationProvider>
          <ToastProvider>
            <CurrencyProvider>
              <Router>
                <Suspense fallback={<Loader />}>
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/maintenance" element={<MaintenancePage />} />

                    {/* Protected Routes */}
                    <Route path="/dashboard"    element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                    <Route path="/investments"  element={<ProtectedRoute><InvestmentsPage /></ProtectedRoute>} />
                    <Route path="/transactions" element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} />
                    <Route path="/referrals"    element={<ProtectedRoute><ReferralsPage /></ProtectedRoute>} />
                    <Route path="/deposit"      element={<ProtectedRoute><CryptoDepositPage /></ProtectedRoute>} />
                    <Route path="/withdraw"     element={<ProtectedRoute><CryptoWithdrawPage /></ProtectedRoute>} />
                    <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
                    <Route path="/profile"      element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                    <Route path="/help"         element={<ProtectedRoute><HelpPage /></ProtectedRoute>} />
                    <Route path="/community"    element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />

                    {/* Redirect old crypto sub-routes */}
                    <Route path="/deposit/crypto"  element={<Navigate to="/deposit" replace />} />
                    <Route path="/withdraw/crypto" element={<Navigate to="/withdraw" replace />} />

                    {/* 404 */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
              </Router>
            </CurrencyProvider>
          </ToastProvider>
        </NotificationProvider>
      </AuthProvider>
    </SearchProvider>
  );
}

export default App;
