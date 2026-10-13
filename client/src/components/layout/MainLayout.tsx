import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';
import { Navigate } from 'react-router-dom';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect customers to portal
  if (user.role === 'CUSTOMER') {
    const currentPath = window.location.pathname;
    if (!currentPath.startsWith('/portal')) {
      return <Navigate to="/portal/home" replace />;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="lg:ml-64">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
