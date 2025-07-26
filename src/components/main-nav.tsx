import * as React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Home, Utensils, ShoppingCart, Star, Shield, Package, FileText, Users, Settings } from 'lucide-react';

type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
  roles?: string[];
  disabled?: boolean;
};

const mainNavItems: NavItem[] = [
  {
    title: 'Home',
    href: '/',
    icon: <Home className="h-4 w-4" />,
    roles: ['customer'],
  },
  {
    title: 'Vendors',
    href: '/vendors',
    icon: <Utensils className="h-4 w-4" />,
    roles: ['customer'],
  },
  {
    title: 'Orders',
    href: '/orders',
    icon: <ShoppingCart className="h-4 w-4" />,
    roles: ['customer'],
  },
  {
    title: 'Rewards',
    href: '/rewards',
    icon: <Star className="h-4 w-4" />,
    roles: ['customer'],
  },
  {
    title: 'Dashboard',
    href: '/vendor/dashboard',
    icon: <Home className="h-4 w-4" />,
    roles: ['vendor'],
  },
  {
    title: 'Menu',
    href: '/vendor/menu',
    icon: <Utensils className="h-4 w-4" />,
    roles: ['vendor'],
  },
  {
    title: 'Orders',
    href: '/vendor/orders',
    icon: <ShoppingCart className="h-4 w-4" />,
    roles: ['vendor'],
  },
  {
    title: 'Hygiene',
    href: '/vendor/hygiene',
    icon: <Shield className="h-4 w-4" />,
    roles: ['vendor'],
  },
  {
    title: 'Dashboard',
    href: '/supplier/dashboard',
    icon: <Home className="h-4 w-4" />,
    roles: ['supplier'],
  },
  {
    title: 'Products',
    href: '/supplier/products',
    icon: <Package className="h-4 w-4" />,
    roles: ['supplier'],
  },
  {
    title: 'Invoices',
    href: '/supplier/invoices',
    icon: <FileText className="h-4 w-4" />,
    roles: ['supplier'],
  },
  {
    title: 'Clients',
    href: '/supplier/clients',
    icon: <Users className="h-4 w-4" />,
    roles: ['supplier'],
  },
];

const settingsNavItems: NavItem[] = [
  {
    title: 'Settings',
    href: '/settings',
    icon: <Settings className="h-4 w-4" />,
  },
];

interface MainNavProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  isMobile?: boolean;
  onNavItemClick?: () => void;
}

export function MainNav({ className, isMobile = false, onNavItemClick, ...props }: MainNavProps) {
  const { currentUser } = useAuth();
  const location = useLocation();
  const userRole = currentUser?.role || 'customer';
  
  // Filter nav items based on user role
  const filteredNavItems = React.useMemo(() => {
    return mainNavItems.filter(
      (item) => !item.roles || item.roles.includes(userRole) || item.roles.length === 0
    );
  }, [userRole]);

  // Check if a nav item is active
  const isActive = (href: string, exact: boolean = false) => {
    if (exact) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href) && href !== '/';
  };

  // Handle nav item click (for mobile)
  const handleNavItemClick = () => {
    if (onNavItemClick) {
      onNavItemClick();
    }
  };

  const renderNavItem = (item: NavItem) => {
    const isItemActive = isActive(item.href, item.href === '/');
    
    return (
      <li key={item.href} className="w-full">
        <NavLink
          to={item.href}
          className={cn(
            'flex items-center w-full p-2 rounded-md text-sm font-medium transition-colors',
            'hover:bg-accent hover:text-accent-foreground',
            isItemActive 
              ? 'bg-accent text-accent-foreground' 
              : 'text-muted-foreground',
            item.disabled && 'opacity-50 pointer-events-none'
          )}
          onClick={handleNavItemClick}
          aria-disabled={item.disabled}
        >
          <span className="mr-3">{item.icon}</span>
          <span>{item.title}</span>
          {item.disabled && (
            <span className="ml-auto text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
              Soon
            </span>
          )}
        </NavLink>
      </li>
    );
  };

  return (
    <nav
      className={cn(
        'flex flex-col space-y-1',
        isMobile ? 'px-2' : 'w-full',
        className
      )}
      {...props}
    >
      <ul className="space-y-1">
        {filteredNavItems.map(renderNavItem)}
      </ul>
      
      {!isMobile && currentUser && (
        <>
          <div className="h-px bg-border my-2" />
          <ul className="space-y-1">
            {settingsNavItems.map(renderNavItem)}
          </ul>
        </>
      )}
    </nav>
  );
}
