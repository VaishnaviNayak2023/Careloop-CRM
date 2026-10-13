import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import CustomersPage from './pages/CustomersPage';
import PromiseKeeperPage from './pages/PromiseKeeperPage';
import CustomerDetailPage from './pages/CustomerDetailPage';
import AIAssistantPage from './pages/AIAssistantPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected routes */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
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

          {/* Catch all - redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
