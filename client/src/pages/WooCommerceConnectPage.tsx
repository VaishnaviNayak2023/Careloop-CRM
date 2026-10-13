import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { Store, ArrowLeft, CheckCircle, AlertCircle, Lock } from 'lucide-react';

export default function WooCommerceConnectPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    storeUrl: '',
    consumerKey: '',
    consumerSecret: '',
    importCustomers: true,
    importOrders: true,
    importProducts: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [connectionTest, setConnectionTest] = useState<'success' | 'error' | null>(null);

  const handleTestConnection = async () => {
    setError('');
    setLoading(true);
    setConnectionTest(null);

    try {
      const response = await api.post('/integrations/woocommerce/connect', formData);
      setConnectionTest('success');
      setStep(3);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Connection failed. Please check your credentials.');
      setConnectionTest('error');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    setLoading(true);
    try {
      await api.post('/integrations/woocommerce/connect', formData);
      navigate('/integrations');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to connect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/integrations')} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Connect WooCommerce</h1>
          <p className="text-gray-600 mt-1">Step {step} of 3</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Step 1: Store Details */}
      {step === 1 && (
        <div className="card p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Store Details</h2>
            <p className="text-gray-600">Enter your WooCommerce store information</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Store URL
            </label>
            <input
              type="url"
              value={formData.storeUrl}
              onChange={(e) => setFormData({ ...formData, storeUrl: e.target.value })}
              className="input-field"
              placeholder="https://yourstore.com"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Your store's base URL (e.g., https://yourstore.com)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Consumer Key
            </label>
            <input
              type="text"
              value={formData.consumerKey}
              onChange={(e) => setFormData({ ...formData, consumerKey: e.target.value })}
              className="input-field"
              placeholder="ck_xxxxxxxxxxxxxxxx"
              required
            />
            <p className="text-xs text-gray-500 mt-1">From WooCommerce → Settings → Advanced → REST API</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Consumer Secret
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={formData.consumerSecret}
                onChange={(e) => setFormData({ ...formData, consumerSecret: e.target.value })}
                className="input-field pl-10"
                placeholder="cs_xxxxxxxxxxxxxxxx"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Kept secure and never shared</p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Required Permissions
            </h3>
            <p className="text-sm text-gray-600">
              Your API keys need at minimum Read permissions for:
            </p>
            <ul className="text-sm text-gray-600 mt-2 list-disc list-inside">
              <li>Customers: Read</li>
              <li>Orders: Read</li>
            </ul>
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!formData.storeUrl || !formData.consumerKey || !formData.consumerSecret}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 2: Import Settings */}
      {step === 2 && (
        <div className="card p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Import Settings</h2>
            <p className="text-gray-600">Choose what to synchronize from your store</p>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={formData.importCustomers}
                onChange={(e) => setFormData({ ...formData, importCustomers: e.target.checked })}
                className="w-5 h-5 text-navy-600 rounded"
              />
              <div>
                <p className="font-medium text-gray-900">Import Customers</p>
                <p className="text-sm text-gray-600">Synchronize customer accounts</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={formData.importOrders}
                onChange={(e) => setFormData({ ...formData, importOrders: e.target.checked })}
                className="w-5 h-5 text-navy-600 rounded"
              />
              <div>
                <p className="font-medium text-gray-900">Import Orders</p>
                <p className="text-sm text-gray-600">Synchronize order history</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 opacity-50">
              <input
                type="checkbox"
                checked={formData.importProducts}
                onChange={(e) => setFormData({ ...formData, importProducts: e.target.checked })}
                className="w-5 h-5 text-navy-600 rounded"
                disabled
              />
              <div>
                <p className="font-medium text-gray-900">Import Products</p>
                <p className="text-sm text-gray-600">Synchronize product catalog (coming soon)</p>
              </div>
            </label>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="btn-secondary flex-1">
              Back
            </button>
            <button
              onClick={handleTestConnection}
              disabled={loading}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Testing...' : 'Test Connection'}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review & Connect */}
      {step === 3 && (
        <div className="card p-6 space-y-6">
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-medium text-gray-900">Connection Successful!</p>
              <p className="text-sm text-gray-600">Your store credentials are valid</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Review Settings</h2>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Store URL</span>
                <span className="text-gray-900">{formData.storeUrl}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Import Customers</span>
                <span className="text-gray-900">{formData.importCustomers ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Import Orders</span>
                <span className="text-gray-900">{formData.importOrders ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="btn-secondary flex-1">
              Back
            </button>
            <button
              onClick={handleConnect}
              disabled={loading}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Connecting...' : 'Connect Store'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
