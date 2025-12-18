import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, CurrencyProvider } from './context';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import InvestmentsPage from './pages/InvestmentsPage';
import PerformancePage from './pages/PerformancePage';
import OpportunitiesPage from './pages/OpportunitiesPage';
import CommunityPage from './pages/CommunityPage';
import HelpPage from './pages/HelpPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <Router>
          <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard/*" element={<DashboardPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/investments" element={<InvestmentsPage />} />
        <Route path="/performance" element={<PerformancePage />} />
        <Route path="/opportunities" element={<OpportunitiesPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
          </Routes>
        </Router>
      </CurrencyProvider>
    </AuthProvider>
  );
}

export default App;
