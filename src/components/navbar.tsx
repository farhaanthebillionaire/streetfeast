import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { MobileNav } from '../components/mobile-nav';
import { ThemeToggle } from '../components/theme/theme-toggle';
import { UserAvatar } from '../components/user-avatar';
import { useAuth } from '../contexts/auth/AuthContext';
import { Logo } from '../components/logo';

export function Navbar() {
  const { currentUser } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = React.useState(false);

  // Handle scroll effect for navbar
  React.useEffect(() => {
    const handleScroll = () => {    
      const offset = window.scrollY;
      if (offset > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Don't show navbar on login/register pages
  if (['/login', '/register'].includes(location.pathname)) {
    return null;
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        isScrolled && 'shadow-sm'
      )}
    >
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Mobile menu button and logo */}
        <div className="flex items-center gap-4 md:gap-6">
          <MobileNav />
          <Link to="/" className="flex items-center space-x-2">
            <Logo className="h-8 w-8" />
            <span className="text-xl font-bold hidden sm:inline-block">
              Street<span className="text-primary">Feast</span>
            </span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className={cn(
              'px-3 py-2 text-sm font-medium rounded-md transition-colors',
              location.pathname === '/'
                ? 'text-foreground bg-accent'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Home
          </Link>
          
          {currentUser && currentUser.role === 'customer' && (
            <>
              <Link
                to="/vendors"
                className={cn(
                  'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  location.pathname.startsWith('/vendors')
                    ? 'text-foreground bg-accent'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Vendors
              </Link>
              <Link
                to="/orders"
                className={cn(
                  'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  location.pathname.startsWith('/orders')
                    ? 'text-foreground bg-accent'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                My Orders
              </Link>
            </>
          )}
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserAvatar />
        </div>
      </div>
    </header>
  );
}
