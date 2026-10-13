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
  Link as LinkIcon,
  Search,
  Bell,
  ChevronDown
} from 'lucide-react';

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
  roles?: ('MANAGER' | 'STAFF_ADMIN' | 'CUSTOMER')[];
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const mainMenuItems: NavItem[] = [
  { label: 'Overview', icon: LayoutDashboard, path: '/dashboard', roles: ['MANAGER', 'STAFF_ADMIN'] },
  { label: 'Customers', icon: Users, path: '/customers', roles: ['MANAGER', 'STAFF_ADMIN'] },
  { label: 'Orders', icon: ShoppingCart, path: '/orders', roles: ['MANAGER', 'STAFF_ADMIN'] },
  { label: 'Promise Keeper', icon: CheckSquare, path: '/promises', roles: ['MANAGER', 'STAFF_ADMIN'] },
  { label: 'Support Requests', icon: MessageSquare, path: '/support', roles: ['MANAGER', 'STAFF_ADMIN'], badge: 20 },
  { label: 'AI Assistant', icon: Sparkles, path: '/ai', roles: ['MANAGER', 'STAFF_ADMIN'] },
  { label: 'Reports', icon: BarChart3, path: '/reports', roles: ['MANAGER', 'STAFF_ADMIN'] },
];

const toolsItems: NavItem[] = [
  { label: 'WooCommerce', icon: LinkIcon, path: '/integrations/woocommerce', roles: ['MANAGER'] },
  { label: 'Activity Log', icon: History, path: '/activity', roles: ['MANAGER', 'STAFF_ADMIN'] },
  { label: 'Settings', icon: Settings, path: '/settings', roles: ['MANAGER', 'STAFF_ADMIN', 'CUSTOMER'] },
];

const customerMenuItems: NavItem[] = [
  { label: 'My Home', icon: LayoutDashboard, path: '/portal/home', roles: ['CUSTOMER'] },
  { label: 'My Requests', icon: MessageSquare, path: '/portal/requests', roles: ['CUSTOMER'] },
  { label: 'My Profile', icon: Settings, path: '/portal/profile', roles: ['CUSTOMER'] },
];

const adminSections: NavSection[] = [
  { title: 'Main Menu', items: mainMenuItems },
  { title: 'Tools', items: toolsItems },
];

const customerSections: NavSection[] = [
  { title: 'Menu', items: customerMenuItems },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = React.useState(false);

  if (!user) return null;

  const isCustomer = user.role === 'CUSTOMER';
  const sections = isCustomer ? customerSections : adminSections;

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
          transition-all duration-300
          ${collapsed ? '-translate-x-full' : 'translate-x-0'}
          ${collapsed ? 'w-0' : 'w-64'}
          flex flex-col flex-shrink-0
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-blue-600">CareLoop</h1>
          <p className="text-xs text-gray-500 mt-1">Every customer remembered</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          {sections.map((section) => {
            const filteredItems = section.items.filter(item =>
              !item.roles || item.roles.includes(user.role)
            );

            if (filteredItems.length === 0) return null;

            return (
              <div key={section.title} className="mb-6">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-4">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {filteredItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <RouterLink
                        key={item.path}
                        to={item.path}
                        className={`
                          flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative
                          ${isActive
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                          }
                        `}
                      >
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full" />
                        )}
                        <Icon className="w-5 h-5" />
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                          <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </RouterLink>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* User info */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-medium">
                {user.fullName.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.fullName}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role.replace('_', ' ')}</p>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
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
