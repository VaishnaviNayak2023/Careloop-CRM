import React, { useState } from 'react';
import api from '../../lib/api';
import { MessageSquare, Plus, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function CustomerPortalRequests() {
  const [requests, setRequests] = useState<any[]>([]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Requests</h1>
          <p className="text-gray-600 mt-1">View and manage your support requests</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Request
        </button>
      </div>

      {/* Requests List */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {requests.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">No support requests yet</p>
                  <p className="text-sm text-gray-400 mt-1">Create your first request to get started</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
