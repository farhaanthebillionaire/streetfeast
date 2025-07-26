import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/auth/AuthContext';
import { cn } from '../../lib/utils';
import { Menu, X, User, LogOut, ChevronDown, Sun, Moon, Monitor } from 'lucide-react';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { useTheme } from '../../components/theme/theme-provider';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { currentUser, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const userRole = currentUser?.role || 'guest';

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  // Navigation links based on user role
  const getNavLinks = () => {
    const baseLinks = [
      { to: '/', label: 'Home', icon: 'home' },
    ];

    if (!currentUser) {
      return [
        ...baseLinks,
        { to: '/login', label: 'Login', icon: 'log-in' },
      ];
    }

    const roleLinks = {
      vendor: [
        { to: '/vendor/dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
        { to: '/vendor/menu', label: 'Menu', icon: 'utensils' },
        { to: '/vendor/orders', label: 'Orders', icon: 'shopping-bag' },
        { to: '/vendor/reviews', label: 'Reviews', icon: 'star' },
      ],
      customer: [
        { to: '/customer/home', label: 'Explore', icon: 'compass' },
        { to: '/customer/orders', label: 'My Orders', icon: 'package' },
        { to: '/customer/rewards', label: 'Rewards', icon: 'award' },
      ],
      supplier: [
        { to: '/supplier/dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
        { to: '/supplier/products', label: 'Products', icon: 'package' },
        { to: '/supplier/invoices', label: 'Invoices', icon: 'file-invoice' },
        { to: '/supplier/clients', label: 'Clients', icon: 'users' },
      ],
      admin: [
        { to: '/admin/dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
        { to: '/admin/users', label: 'Users', icon: 'users' },
        { to: '/admin/vendors', label: 'Vendors', icon: 'store' },
        { to: '/admin/settings', label: 'Settings', icon: 'settings' },
      ],
    };

    return [
      ...baseLinks,
      ...(roleLinks[userRole as keyof typeof roleLinks] || []),
    ];
  };

  const navLinks = getNavLinks();
  const userInitial = currentUser?.email?.charAt(0).toUpperCase() || 'U';

  // Theme toggle handler
  const toggleTheme = (newTheme: string) => {
    setTheme(newTheme);
  };

  // Get Lucide icon component by name
  const getIcon = (name: string) => {
    const iconMap: Record<string, JSX.Element> = {
      'home': <span className="w-5 h-5" />,
      'log-in': <span className="w-5 h-5" />,
      'layout-dashboard': <span className="w-5 h-5" />,
      'utensils': <span className="w-5 h-5" />,
      'shopping-bag': <span className="w-5 h-5" />,
      'star': <span className="w-5 h-5" />,
      'compass': <span className="w-5 h-5" />,
      'package': <span className="w-5 h-5" />,
      'award': <span className="w-5 h-5" />,
      'file-invoice': <span className="w-5 h-5" />,
      'users': <span className="w-5 h-5" />,
      'store': <span className="w-5 h-5" />,
      'settings': <span className="w-5 h-5" />,
    };
    return iconMap[name] || <span className="w-5 h-5" />;
  };

  return (
    <header 
      className={cn(
        'sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-200',
        isScrolled ? 'shadow-sm' : 'border-transparent'
      )}
    >
      <div className="container flex h-16 items-center">
        {/* Mobile menu button */}
        <div className="flex items-center md:hidden mr-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-full"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>

        {/* Logo */}
        <div className="mr-4 flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-display font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              StreetFeast
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Button
                key={link.to}
                asChild
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'h-10 px-3 py-2 text-sm font-medium transition-colors',
                  isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50 hover:text-accent-foreground/80'
                )}
              >
                <Link to={link.to}>
                  <span className="flex items-center gap-2">
                    {getIcon(link.icon)}
                    {link.label}
                  </span>
                </Link>
              </Button>
            );
          })}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-2">
          {/* Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => toggleTheme('light')}>
                <Sun className="mr-2 h-4 w-4" />
                <span>Light</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleTheme('dark')}>
                <Moon className="mr-2 h-4 w-4" />
                <span>Dark</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleTheme('system')}>
                <Monitor className="mr-2 h-4 w-4" />
                <span>System</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary text-white font-medium">
                    {userInitial}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none">{currentUser.email}</p>
                  <p className="text-xs leading-none text-muted-foreground capitalize">
                    {userRole}
                  </p>
                </div>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer">
                    <span className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleSignOut}
                  className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/register">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 border-t p-4">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive 
                      ? 'bg-accent text-accent-foreground' 
                      : 'text-foreground/80 hover:bg-accent/50 hover:text-accent-foreground/80'
                  )}
                >
                  {getIcon(link.icon)}
                  {link.label}
                </Link>
              );
            })}
          </div>
          {currentUser && (
            <div className="border-t p-4">
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary text-white font-medium">
                  {userInitial}
                </div>
                <div>
                  <p className="text-sm font-medium">{currentUser.email}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {userRole}
                  </p>
                </div>
              </div>
              <div className="mt-2 space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => navigate('/profile')}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => navigate('/settings')}
                >
                  <span className="mr-2 h-4 w-4" />
                  Settings
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive hover:text-destructive"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
