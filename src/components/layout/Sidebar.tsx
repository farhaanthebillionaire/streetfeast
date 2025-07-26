import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Package, Users, Settings, Heart, History, CreditCard, Truck, Utensils, Home } from 'lucide-react';
import { cn } from '../../lib/utils';

type UserRole = 'customer' | 'vendor' | 'supplier' | 'admin';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

const sidebarNavItems: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
    roles: ['customer', 'vendor', 'supplier', 'admin'],
  },
  {
    name: 'Orders',
    href: '/orders',
    icon: <ShoppingBag className="h-5 w-5" />,
    roles: ['customer', 'vendor', 'admin'],
  },
  {
    name: 'Favorites',
    href: '/favorites',
    icon: <Heart className="h-5 w-5" />,
    roles: ['customer'],
  },
  {
    name: 'Order History',
    href: '/history',
    icon: <History className="h-5 w-5" />,
    roles: ['customer'],
  },
  {
    name: 'Menu',
    href: '/menu',
    icon: <Utensils className="h-5 w-5" />,
    roles: ['vendor', 'admin'],
  },
  {
    name: 'Products',
    href: '/products',
    icon: <Package className="h-5 w-5" />,
    roles: ['supplier', 'admin'],
  },
  {
    name: 'Deliveries',
    href: '/deliveries',
    icon: <Truck className="h-5 w-5" />,
    roles: ['vendor', 'supplier', 'admin'],
  },
  {
    name: 'Customers',
    href: '/customers',
    icon: <Users className="h-5 w-5" />,
    roles: ['vendor', 'admin'],
  },
  {
    name: 'Payments',
    href: '/payments',
    icon: <CreditCard className="h-5 w-5" />,
    roles: ['vendor', 'supplier', 'admin'],
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: <Settings className="h-5 w-5" />,
    roles: ['customer', 'vendor', 'supplier', 'admin'],
  },
];

const Sidebar: React.FC<{ userRole?: UserRole }> = ({ userRole }) => {
  const location = useLocation();
  
  // Filter nav items based on user role
  const filteredNavItems = sidebarNavItems.filter(
    (item) => !userRole || item.roles.includes(userRole)
  );

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
        <div className="flex items-center h-16 px-4 border-b border-gray-200">
          <Link to="/" className="flex items-center space-x-2">
            <Home className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-gray-900">StreetFeast</span>
          </Link>
        </div>
        <div className="flex flex-col flex-grow overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {filteredNavItems.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  )}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">
                {userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : 'User'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
