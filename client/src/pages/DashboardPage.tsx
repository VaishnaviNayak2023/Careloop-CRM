import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import { Users, CheckSquare, AlertTriangle, TrendingUp, Clock, Plus } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<any>(null);
  const [attentionItems, setAttentionItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [metricsRes, attentionRes] = await Promise.all([
        api.get('/alerts/metrics'),
        api.get('/alerts/attention')
      ]);
      setMetrics(metricsRes.data);
      setAttentionItems(attentionRes.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const kpiCards = metrics ? [
    { label: 'Total Customers', value: metrics.totalCustomers, change: '+12%', icon: Users, color: 'bg-blue-50 text-blue-600' },
    { label: 'Promises Due Today', value: metrics.promisesDueToday, change: '+2', icon: Clock, color: 'bg-orange-50 text-orange-600' },
    { label: 'Overdue Promises', value: metrics.overduePromises, change: '-1', icon: AlertTriangle, color: 'bg-red-50 text-red-600' },
    { label: 'Fulfilled This Month', value: metrics.fulfilledThisMonth, change: '+8', icon: CheckSquare, color: 'bg-green-50 text-green-600' },
  ] : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-700"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Overview</h1>
        <p className="text-gray-600 mt-1">Welcome back, {user?.fullName}!</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${card.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-sm text-green-600 font-medium">{card.change}</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-600 mt-1">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Customer
        </button>
        <button className="btn-secondary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Promise
        </button>
        <button className="btn-secondary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Record Interaction
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Needs Attention */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Needs Attention
          </h2>
          <div className="space-y-4">
            {attentionItems.length > 0 ? attentionItems.map((item, index) => (
              <div key={index} className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <p className="font-medium text-gray-900">{item.customerName}</p>
                <p className="text-sm text-gray-600 mt-1">{item.evidence}</p>
                <button className="mt-2 text-sm text-navy-600 hover:text-navy-700 font-medium">
                  {item.suggestedAction} →
                </button>
              </div>
            )) : (
              <p className="text-sm text-gray-500">No items needing attention</p>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Quick Stats
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Open Support Requests</span>
              <span className="text-2xl font-bold text-gray-900">{metrics?.openSupportRequests || 0}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Customers Needing Attention</span>
              <span className="text-2xl font-bold text-gray-900">{metrics?.customersNeedingAttention || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
