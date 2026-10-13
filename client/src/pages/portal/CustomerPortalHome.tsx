import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, MessageSquare, CheckSquare, History, Clock, AlertTriangle } from 'lucide-react';

export default function CustomerPortalHome() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Home</h1>
        <p className="text-gray-600 mt-1">Welcome back, {user?.fullName}!</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600">Open Requests</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckSquare className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600">Resolved</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-orange-50 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600">Updates</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <History className="w-5 h-5 text-navy-600" />
          Recent Activity
        </h2>
        <div className="text-center py-8">
          <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">No recent activity</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="btn-primary flex items-center justify-center gap-2">
            <MessageSquare className="w-4 h-4" />
            New Support Request
          </button>
          <button className="btn-secondary flex items-center justify-center gap-2">
            <User className="w-4 h-4" />
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
}
