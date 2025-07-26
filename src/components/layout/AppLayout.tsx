import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/auth/AuthContext';
import { cn } from '../../lib/utils';
import { Navbar } from '../../components/navbar';
import { Toast } from '../../lib/toast';

const AppLayout = () => {
  const { loading } = useAuth();
  const location = useLocation();
  
  // Don't show layout for auth pages
  if (['/login', '/register'].includes(location.pathname)) {
    return <Outlet />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading your experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex-1 pt-4 pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-in fade-in duration-300">
            <Outlet />
          </div>
        </div>
      </main>
      <footer className="border-t bg-card/50 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                StreetFeast
              </span>
              <span className="text-xs text-muted-foreground">
                v{import.meta.env.VITE_APP_VERSION || '1.0.0'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-right">
              &copy; {new Date().getFullYear()} StreetFeast. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      <Toast />
    </div>
  );
};

export default AppLayout;
