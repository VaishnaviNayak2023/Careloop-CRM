import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import { Users, ShoppingCart, DollarSign, MessageSquare, TrendingUp, Clock, Plus, ArrowUp, ArrowDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Bar, BarChart } from 'recharts';

export default function DashboardPage() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<any>({
    totalCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    openSupportRequests: 0,
    pendingPromises: 0,
    overduePromises: 0,
    fulfilledThisMonth: 0,
    customersNeedingAttention: 0
  });
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'monthly' | 'yearly'>('monthly');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    fetchDashboardData();
    updateDate();
  }, [timeRange]);

  const updateDate = () => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    setCurrentDate(new Date().toLocaleDateString('en-US', options));
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [metricsRes] = await Promise.all([
        api.get('/alerts/metrics')
      ]);
      setMetrics(metricsRes.data);
      
      // Generate sample revenue data for the chart
      const monthlyData = [
        { month: 'Jan', earnings: 12000, sales: 15000 },
        { month: 'Feb', earnings: 19000, sales: 22000 },
        { month: 'Mar', earnings: 15000, sales: 18000 },
        { month: 'Apr', earnings: 22000, sales: 25000 },
        { month: 'May', earnings: 18000, sales: 21000 },
        { month: 'Jun', earnings: 24000, sales: 28000 },
        { month: 'Jul', earnings: 22430, sales: 26000 },
        { month: 'Aug', earnings: 20000, sales: 23000 },
        { month: 'Sep', earnings: 27000, sales: 31000 },
        { month: 'Oct', earnings: 23000, sales: 27000 },
        { month: 'Nov', earnings: 25000, sales: 29000 },
        { month: 'Dec', earnings: 28000, sales: 32000 },
      ];
      
      const yearlyData = [
        { year: '2022', earnings: 150000, sales: 180000 },
        { year: '2023', earnings: 220000, sales: 250000 },
        { year: '2024', earnings: 290000, sales: 330000 },
      ];
      
      setRevenueData(timeRange === 'monthly' ? monthlyData : yearlyData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const kpiCards = [
    { 
      label: 'Total Orders', 
      value: metrics.totalOrders || 2540, 
      change: '+4.9%', 
      changeType: 'positive',
      icon: ShoppingCart, 
      color: 'bg-blue-50 text-blue-600' 
    },
    { 
      label: 'Total Customers', 
      value: metrics.totalCustomers || 1340, 
      change: '+2.7%', 
      changeType: 'positive',
      icon: Users, 
      color: 'bg-green-50 text-green-600' 
    },
    { 
      label: 'Total Revenue', 
      value: `$${(metrics.totalRevenue || 5567).toLocaleString()}`, 
      change: '+4.9%', 
      changeType: 'positive',
      icon: DollarSign, 
      color: 'bg-purple-50 text-purple-600' 
    },
    { 
      label: 'Open Requests', 
      value: metrics.openSupportRequests || 45, 
      change: '-2.3%', 
      changeType: 'negative',
      icon: MessageSquare, 
      color: 'bg-orange-50 text-orange-600' 
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Overview</h1>
        <p className="text-gray-600 mt-1">Welcome back, {user?.fullName}!</p>
        <p className="text-sm text-gray-500 mt-2">{currentDate}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          const isPositive = card.changeType === 'positive';
          return (
            <div key={card.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${card.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className={`text-sm font-medium flex items-center gap-1 ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  {card.change}
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-600 mt-1">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Revenue Insights</h2>
            <p className="text-sm text-gray-500 mt-1">
              Current revenue: ${metrics.totalRevenue?.toLocaleString() || '5,567.00'} ({metrics.totalRevenue ? '+4.9%' : '0%'})
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setTimeRange('monthly')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                timeRange === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setTimeRange('yearly')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                timeRange === 'yearly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Yearly
            </button>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis 
              dataKey={timeRange === 'monthly' ? 'month' : 'year'} 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
            />
            <Legend />
            <Bar 
              dataKey="earnings" 
              name="Earnings" 
              fill="#3b82f6" 
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="sales" 
              name="Sales" 
              fill="#93c5fd" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Customer
        </button>
        <button className="bg-white hover:bg-gray-50 text-gray-700 font-medium px-4 py-2 rounded-lg border border-gray-300 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Promise
        </button>
        <button className="bg-white hover:bg-gray-50 text-gray-700 font-medium px-4 py-2 rounded-lg border border-gray-300 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Record Interaction
        </button>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending & Overdue Promises */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            Promise Status
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Pending Promises</span>
              <span className="text-2xl font-bold text-gray-900">{metrics.pendingPromises || 12}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <span className="text-gray-600">Overdue Promises</span>
              <span className="text-2xl font-bold text-red-600">{metrics.overduePromises || 3}</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Activity Summary
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Fulfilled This Month</span>
              <span className="text-2xl font-bold text-gray-900">{metrics.fulfilledThisMonth || 28}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Customers Needing Attention</span>
              <span className="text-2xl font-bold text-gray-900">{metrics.customersNeedingAttention || 5}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
