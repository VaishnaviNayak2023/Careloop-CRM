import React, { useState } from 'react';
import api from '../lib/api';
import { Sparkles, Mail, MessageSquare, Copy, RefreshCw, Send } from 'lucide-react';

export default function AIAssistantPage() {
  const [customerId, setCustomerId] = useState('');
  const [promiseId, setPromiseId] = useState('');
  const [supportRequestId, setSupportRequestId] = useState('');
  const [tone, setTone] = useState<'professional' | 'friendly' | 'apologetic' | 'concise'>('professional');
  const [draft, setDraft] = useState('');
  const [context, setContext] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const generateDraft = async () => {
    if (!customerId) {
      alert('Please enter a customer ID');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/ai/reply-draft', {
        customerId,
        promiseId: promiseId || undefined,
        supportRequestId: supportRequestId || undefined,
        tone
      });
      setDraft(response.data.draft);
      setContext(response.data.context);
    } catch (error: any) {
      console.error('Failed to generate draft:', error);
      alert(error.response?.data?.error || 'Failed to generate draft');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(draft);
    alert('Draft copied to clipboard');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">AI Reply Assistant</h1>
        <p className="text-gray-600 mt-1">Generate context-aware customer responses</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="card p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Configure Draft</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer ID
            </label>
            <input
              type="text"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="input-field"
              placeholder="Enter customer ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Promise ID (optional)
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={promiseId}
                onChange={(e) => setPromiseId(e.target.value)}
                className="input-field pl-10"
                placeholder="Enter promise ID"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Support Request ID (optional)
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={supportRequestId}
                onChange={(e) => setSupportRequestId(e.target.value)}
                className="input-field pl-10"
                placeholder="Enter support request ID"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tone
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as any)}
              className="input-field"
            >
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="apologetic">Apologetic</option>
              <option value="concise">Concise</option>
            </select>
          </div>

          <button
            onClick={generateDraft}
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Draft
              </>
            )}
          </button>
        </div>

        {/* Output Section */}
        <div className="card p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Generated Draft</h2>

          {context && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600">
                <strong>Customer:</strong> {context.customerName}
              </p>
              {context.relevantPromise && (
                <p className="text-sm text-gray-600 mt-1">
                  <strong>Promise:</strong> {context.relevantPromise}
                </p>
              )}
              {context.relevantRequest && (
                <p className="text-sm text-gray-600 mt-1">
                  <strong>Request:</strong> {context.relevantRequest}
                </p>
              )}
              <p className="text-sm text-gray-600 mt-1">
                <strong>Tone:</strong> {context.tone}
              </p>
              {!context.isAIGenerated && (
                <p className="text-xs text-gray-500 mt-2 italic">
                  * This draft was generated using a template-based system, not an AI model.
                </p>
              )}
            </div>
          )}

          {draft ? (
            <>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
                <button
                  onClick={generateDraft}
                  className="btn-secondary flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Regenerate
                </button>
                <button className="btn-primary flex items-center gap-2 flex-1">
                  <Send className="w-4 h-4" />
                  Send (not implemented)
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Configure the options and click "Generate Draft" to create a response</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
