import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../lib/api';
import { Customer, Promise, Interaction } from '../types';
import { Mail, Phone, Building, Calendar, Clock, CheckSquare, Plus, MessageSquare } from 'lucide-react';

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchCustomer(id);
    }
  }, [id]);

  const fetchCustomer = async (customerId: string) => {
    try {
      const response = await api.get(`/customers/${customerId}`);
      setCustomer(response.data);
    } catch (error) {
      console.error('Failed to fetch customer:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-700"></div>
      </div>
    );
  }

  if (!customer) {
    return <div>Customer not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{customer.name}</h1>
          <p className="text-gray-600 mt-1">{customer.company || 'Individual Customer'}</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            New Request
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Note
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Info */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-900">{customer.email}</p>
              </div>
            </div>
            {customer.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-900">{customer.phone}</p>
                </div>
              </div>
            )}
            {customer.company && (
              <div className="flex items-center gap-3">
                <Building className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Company</p>
                  <p className="text-gray-900">{customer.company}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Customer Since</p>
                <p className="text-gray-900">{new Date(customer.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Assignment */}
          {customer.currentAssignment && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Current Assignment</h3>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium text-gray-900">
                  {customer.currentAssignment.admin.user.fullName}
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(customer.currentAssignment.startAt).toLocaleDateString()} - {' '}
                  {new Date(customer.currentAssignment.endAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Open Promises */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-navy-600" />
            Open Promises
          </h2>
          <div className="space-y-3">
            {customer.promises?.filter(p => p.status === 'OPEN' || p.status === 'IN_PROGRESS').map((promise) => (
              <div key={promise.id} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                <p className="font-medium text-gray-900 text-sm">{promise.title}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
                  <Clock className="w-3 h-3" />
                  <span>Due: {new Date(promise.dueAt).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Assigned to: {promise.assignee.user.fullName}</p>
              </div>
            ))}
            {(!customer.promises || customer.promises.filter(p => p.status === 'OPEN' || p.status === 'IN_PROGRESS').length === 0) && (
              <p className="text-sm text-gray-500">No open promises</p>
            )}
          </div>
          <button className="w-full mt-4 btn-secondary text-sm flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />
            Create Promise
          </button>
        </div>

        {/* Support Requests */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-navy-600" />
            Support Requests
          </h2>
          <div className="space-y-3">
            {customer.supportRequests?.slice(0, 3).map((request) => (
              <div key={request.id} className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900 text-sm">{request.subject}</p>
                <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full ${
                  request.status === 'OPEN' ? 'bg-blue-100 text-blue-700' :
                  request.status === 'RESOLVED' ? 'bg-green-100 text-green-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {request.status}
                </span>
              </div>
            ))}
            {(!customer.supportRequests || customer.supportRequests.length === 0) && (
              <p className="text-sm text-gray-500">No support requests</p>
            )}
          </div>
        </div>
      </div>

      {/* Customer Memory Timeline */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Memory</h2>
        <div className="space-y-6">
          {customer.interactions?.map((interaction) => (
            <div key={interaction.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-navy-600"></div>
                <div className="w-0.5 flex-1 bg-gray-200 mt-2"></div>
              </div>
              <div className="flex-1 pb-6">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-gray-900">{interaction.summary}</p>
                  <span className="text-sm text-gray-500">
                    {new Date(interaction.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {interaction.details && (
                  <p className="text-sm text-gray-600">{interaction.details}</p>
                )}
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                  <span className="capitalize">{interaction.type}</span>
                  {interaction.authorName && <span>• {interaction.authorName}</span>}
                  {interaction.isInternal && <span className="bg-gray-100 px-2 py-0.5 rounded">Internal</span>}
                </div>
              </div>
            </div>
          ))}
          {(!customer.interactions || customer.interactions.length === 0) && (
            <p className="text-sm text-gray-500">No interactions recorded yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
