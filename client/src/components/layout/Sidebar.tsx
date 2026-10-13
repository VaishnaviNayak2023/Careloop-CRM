import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  MessageSquare,
  Calendar,
  Sparkles,
  History,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ShoppingCart,
  Link as LinkIcon
} from 'lucide-react';

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
  roles?: ('MANAGER' | 'STAFF_ADMIN' | 'CUSTOMER')[];
}

const navItems: NavItem[] = [
  { label: 'Overview', icon: LayoutDashboard, path: '/dashboard', roles: ['MANAGER', 'STAFF_ADMIN'] },
  { label: 'Customers', icon: Users, path: '/customers', roles: ['MANAGER', 'STAFF_ADMIN'] },
  { label: 'Promise Keeper', icon: CheckSquare, path: '/promises', roles: ['MANAGER', 'STAFF_ADMIN'] },
  { label: 'Orders', icon: ShoppingCart, path: '/orders', roles: ['MANAGER', 'STAFF_ADMIN'] },
  { label: 'Support Requests', icon: MessageSquare, path: '/support', roles: ['MANAGER', 'STAFF_ADMIN'] },
  { label: 'Assignments', icon: Calendar, path: '/assignments', roles: ['MANAGER', 'STAFF_ADMIN'] },
  { label: 'AI Assistant', icon: Sparkles, path: '/ai', roles: ['MANAGER', 'STAFF_ADMIN'] },
  { label: 'Integrations', icon: Link, path: '/integrations', roles: ['MANAGER'] },
  { label: 'Activity', icon: History, path: '/activity', roles: ['MANAGER', 'STAFF_ADMIN'] },
  { label: 'Reports', icon: BarChart3, path: '/reports', roles: ['MANAGER', 'STAFF_ADMIN'] },
  { label: 'Settings', icon: Settings, path: '/settings', roles: ['MANAGER', 'STAFF_ADMIN', 'CUSTOMER'] },
];

const customerNavItems: NavItem[] = [
  { label: 'My Home', icon: LayoutDashboard, path: '/portal/home', roles: ['CUSTOMER'] },
  { label: 'My Requests', icon: MessageSquare, path: '/portal/requests', roles: ['CUSTOMER'] },
  { label: 'My Updates', icon: CheckSquare, path: '/portal/updates', roles: ['CUSTOMER'] },
  { label: 'My History', icon: History, path: '/portal/history', roles: ['CUSTOMER'] },
  { label: 'My Profile', icon: Settings, path: '/portal/profile', roles: ['CUSTOMER'] },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = React.useState(false);

  if (!user) return null;

  const isCustomer = user.role === 'CUSTOMER';
  const items = isCustomer ? customerNavItems : navItems;

  const filteredItems = items.filter(item =>
    !item.roles || item.roles.includes(user.role)
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        {collapsed ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen z-40
          bg-white border-r border-gray-200
          transition-transform duration-300
          ${collapsed ? '-translate-x-full' : 'translate-x-0'}
          ${collapsed ? 'w-0' : 'w-64'}
          flex flex-col
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-navy-900">CareLoop</h1>
          <p className="text-xs text-gray-500 mt-1">Every customer remembered</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <RouterLink
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive
                    ? 'bg-navy-50 text-navy-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </RouterLink>
            );
          })}
        </nav>

        {/* User info */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-navy-100 flex items-center justify-center">
              <span className="text-navy-700 font-medium">
                {user.fullName.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.fullName}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role.replace('_', ' ')}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
