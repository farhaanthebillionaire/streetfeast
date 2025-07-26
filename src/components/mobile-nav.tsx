import * as React from 'react';
import { X, Menu } from 'lucide-react';
import { Button } from '../components/ui/button';
import { MainNav } from '../components/main-nav';
import { ThemeToggle } from '../components/theme/theme-toggle';
import { UserAvatar } from '../components/user-avatar';
import { cn } from '../lib/utils';

export function MobileNav() {
  const [isOpen, setIsOpen] = React.useState(false);
  
  // Close mobile menu when route changes
  React.useEffect(() => {
    const handleRouteChange = () => {
      setIsOpen(false);
    };
    
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);
  
  // Prevent body scroll when mobile menu is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        className="relative z-50"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>
      
      {/* Mobile menu overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-background/80 backdrop-blur-sm',
          'transition-opacity duration-300 ease-in-out',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
        onClick={() => setIsOpen(false)}
      />
      
      {/* Mobile menu panel */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 max-w-xs',
          'bg-background border-r border-border',
          'transform transition-transform duration-300 ease-in-out',
          'flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <span className="text-lg font-bold">StreetFeast</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close menu</span>
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <MainNav isMobile onNavItemClick={() => setIsOpen(false)} />
        </div>
        
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between">
            <ThemeToggle />
            <UserAvatar />
          </div>
        </div>
      </div>
    </div>
  );
}
