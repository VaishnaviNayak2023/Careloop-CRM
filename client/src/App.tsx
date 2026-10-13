import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import CustomersPage from './pages/CustomersPage';
import PromiseKeeperPage from './pages/PromiseKeeperPage';
import CustomerDetailPage from './pages/CustomerDetailPage';
import AIAssistantPage from './pages/AIAssistantPage';
import IntegrationsPage from './pages/IntegrationsPage';
import WooCommerceConnectPage from './pages/WooCommerceConnectPage';
import OrdersPage from './pages/OrdersPage';
import CustomerPortalHome from './pages/portal/CustomerPortalHome';
import CustomerPortalRequests from './pages/portal/CustomerPortalRequests';
import CustomerPortalProfile from './pages/portal/CustomerPortalProfile';
import MainLayout from './components/layout/MainLayout';

function LandingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md px-6">
        <h1 className="text-4xl font-bold text-navy-900 mb-4">CareLoop CRM</h1>
        <p className="text-gray-600 mb-6">Every customer remembered. Every promise followed through.</p>
        <div className="space-y-3">
          <Link to="/login" className="block w-full bg-navy-700 text-white py-3 px-6 rounded-lg hover:bg-navy-800 transition-colors font-medium">
            Login
          </Link>
          <Link to="/signup" className="block w-full bg-white text-navy-700 py-3 px-6 rounded-lg border border-navy-700 hover:bg-navy-50 transition-colors font-medium">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={
            <MainLayout>
              <DashboardPage />
            </MainLayout>
          } />
          <Route path="/customers" element={
            <MainLayout>
              <CustomersPage />
            </MainLayout>
          } />
          <Route path="/customers/:id" element={
            <MainLayout>
              <CustomerDetailPage />
            </MainLayout>
          } />
          <Route path="/promises" element={
            <MainLayout>
              <PromiseKeeperPage />
            </MainLayout>
          } />
          <Route path="/ai" element={
            <MainLayout>
              <AIAssistantPage />
            </MainLayout>
          } />
          <Route path="/integrations" element={
            <MainLayout>
              <IntegrationsPage />
            </MainLayout>
          } />
          <Route path="/integrations/woocommerce/connect" element={
            <MainLayout>
              <WooCommerceConnectPage />
            </MainLayout>
          } />
          <Route path="/orders" element={
            <MainLayout>
              <OrdersPage />
            </MainLayout>
          } />
          <Route path="/portal/home" element={
            <MainLayout>
              <CustomerPortalHome />
            </MainLayout>
          } />
          <Route path="/portal/requests" element={
            <MainLayout>
              <CustomerPortalRequests />
            </MainLayout>
          } />
          <Route path="/portal/profile" element={
            <MainLayout>
              <CustomerPortalProfile />
            </MainLayout>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
