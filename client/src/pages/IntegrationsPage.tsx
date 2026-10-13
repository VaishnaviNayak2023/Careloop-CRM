import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { Link, Store, Clock, CheckCircle, AlertTriangle, RefreshCw, Plus } from 'lucide-react';

export default function IntegrationsPage() {
  const [integration, setIntegration] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIntegrationStatus();
  }, []);

  const fetchIntegrationStatus = async () => {
    try {
      // For demo, we'll show a disconnected state
      // In production, this would fetch from /api/integrations/woocommerce/:id/status
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch integration status:', error);
      setLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      // For demo
      alert('Sync triggered (demo mode)');
    } catch (error) {
      console.error('Sync failed:', error);
    }
  };

  const handleEnableDemoMode = async () => {
    try {
      await api.post('/integrations/woocommerce/demo-mode');
      alert('Demo mode enabled! Orders have been generated.');
      fetchIntegrationStatus();
    } catch (error: any) {
      console.error('Failed to enable demo mode:', error);
      alert(error.response?.data?.error || 'Failed to enable demo mode');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-700"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Integrations</h1>
          <p className="text-gray-600 mt-1">Connect your external services</p>
        </div>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* WooCommerce */}
        <div className="card p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Store className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">WooCommerce</h3>
                <p className="text-sm text-gray-500">E-commerce platform</p>
              </div>
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              integration?.status === 'CONNECTED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
            }`}>
              {integration?.status || 'Not Connected'}
            </span>
          </div>

          {integration ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Store URL</span>
                <span className="text-gray-900">{integration.storeUrl}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Last Sync</span>
                <span className="text-gray-900">
                  {integration.lastSyncAt ? new Date(integration.lastSyncAt).toLocaleDateString() : 'Never'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Customers</span>
                <span className="text-gray-900">{integration.importedCustomers || 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Orders</span>
                <span className="text-gray-900">{integration.importedOrders || 0}</span>
              </div>
              <div className="pt-4 border-t border-gray-200 flex gap-2">
                <button onClick={handleSync} className="btn-secondary flex items-center gap-2 flex-1">
                  <RefreshCw className="w-4 h-4" />
                  Sync Now
                </button>
                <button className="btn-secondary flex items-center gap-2">
                  Settings
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Connect your WooCommerce store to synchronize customers and orders.
              </p>
              <div className="flex gap-2">
                <Link to="/integrations/woocommerce/connect" className="btn-primary flex items-center justify-center gap-2 flex-1">
                  <Plus className="w-4 h-4" />
                  Connect Store
                </Link>
                <button onClick={handleEnableDemoMode} className="btn-secondary flex items-center justify-center gap-2 flex-1">
                  <span className="font-medium">Demo Mode</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Placeholder for future integrations */}
        <div className="card p-6 opacity-50">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gray-100 rounded-lg">
                <Store className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Shopify</h3>
                <p className="text-sm text-gray-500">Coming soon</p>
              </div>
            </div>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
              Coming Soon
            </span>
          </div>
          <p className="text-sm text-gray-600">
            Shopify integration will be available in a future update.
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-navy-600" />
          Recent Sync Activity
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
            <div>
              <p className="text-sm text-gray-900">No recent sync activity</p>
              <p className="text-xs text-gray-500">Connect a store to see sync history</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
