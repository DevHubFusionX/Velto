import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, CurrencyProvider, ToastProvider, SearchProvider } from './context';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import InvestmentsPage from './pages/InvestmentsPage';
import PerformancePage from './pages/PerformancePage';
import CommunityPage from './pages/CommunityPage';
import HelpPage from './pages/HelpPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import DepositPage from './pages/DepositPage';
import WithdrawPage from './pages/WithdrawPage';
import TransactionsPage from './pages/TransactionsPage';
import ReferralsPage from './pages/ReferralsPage';
import MaintenancePage from './pages/MaintenancePage';
import { ProtectedRoute } from './auth';
import './App.css';

function App() {
  return (
    <SearchProvider>
      <AuthProvider>
        <ToastProvider>
          <CurrencyProvider>
            <Router>
              <Routes>
                <Route path="/" element={<LandingPage />} />

                {/* Protected Routes */}
                <Route path="/dashboard/*" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                <Route path="/investments" element={<ProtectedRoute><InvestmentsPage /></ProtectedRoute>} />
                <Route path="/performance" element={<ProtectedRoute><PerformancePage /></ProtectedRoute>} />
                <Route path="/community" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
                <Route path="/help" element={<ProtectedRoute><HelpPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
                <Route path="/deposit" element={<ProtectedRoute><DepositPage /></ProtectedRoute>} />
                <Route path="/withdraw" element={<ProtectedRoute><WithdrawPage /></ProtectedRoute>} />
                <Route path="/transactions" element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} />
                <Route path="/referrals" element={<ProtectedRoute><ReferralsPage /></ProtectedRoute>} />
                <Route path="/maintenance" element={<MaintenancePage />} />
              </Routes>
            </Router>
          </CurrencyProvider>
        </ToastProvider>
      </AuthProvider>
    </SearchProvider>
  );
}

export default App;
