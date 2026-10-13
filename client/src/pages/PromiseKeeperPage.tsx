import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { Promise } from '../types';
import { CheckSquare, Clock, AlertTriangle, Calendar, Plus } from 'lucide-react';

export default function PromiseKeeperPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [promises, setPromises] = useState<Promise[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPromises();
  }, [activeTab]);

  const fetchPromises = async () => {
    setLoading(true);
    try {
      let endpoint = '/promises';
      if (activeTab === 'due-today') endpoint = '/promises/due-today';
      else if (activeTab === 'overdue') endpoint = '/promises/overdue';

      const response = await api.get(endpoint);
      setPromises(response.data);
    } catch (error) {
      console.error('Failed to fetch promises:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'all', label: 'All Promises' },
    { id: 'due-today', label: 'Due Today' },
    { id: 'overdue', label: 'Overdue' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'fulfilled', label: 'Fulfilled' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-blue-100 text-blue-700';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-700';
      case 'FULFILLED':
        return 'bg-green-100 text-green-700';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-orange-100 text-orange-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const isOverdue = (dueDate: string, status: string) => {
    if (status === 'FULFILLED' || status === 'CANCELLED') return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Promise Keeper</h1>
          <p className="text-gray-600 mt-1">Track commitments and follow through on promises</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Promise
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-4 py-3 text-sm font-medium border-b-2 transition-colors
              ${activeTab === tab.id
                ? 'border-navy-700 text-navy-700'
                : 'border-transparent text-gray-600 hover:text-gray-900'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-700"></div>
        </div>
      ) : (
        /* Promises list */
        <div className="space-y-4">
          {promises.map((promise) => {
            const overdue = isOverdue(promise.dueAt, promise.status);
            return (
              <div key={promise.id} className={`card p-6 ${overdue ? 'border-l-4 border-l-red-500' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{promise.customer?.name || 'Unknown'}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(promise.status)}`}>
                        {promise.status}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(promise.priority)}`}>
                        {promise.priority}
                      </span>
                      {overdue && (
                        <span className="flex items-center gap-1 text-xs text-red-600 font-medium">
                          <AlertTriangle className="w-4 h-4" />
                          Overdue
                        </span>
                      )}
                    </div>
                    <p className="text-gray-900 font-medium mb-1">{promise.title}</p>
                    <p className="text-sm text-gray-600 mb-3">{promise.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Due: {new Date(promise.dueAt).toLocaleDateString()}
                      </span>
                      <span>Assigned to: {promise.assignee?.user?.fullName || 'Unassigned'}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {promise.status === 'OPEN' && (
                      <button className="btn-secondary text-sm">Mark in Progress</button>
                    )}
                    {(promise.status === 'OPEN' || promise.status === 'IN_PROGRESS') && (
                      <button className="btn-primary text-sm">Mark Fulfilled</button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {promises.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No promises found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
