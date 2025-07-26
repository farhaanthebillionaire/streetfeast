import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/auth/AuthContext';
import { Button } from '../../components/ui/button';
import { LogOut } from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';

const DashboardLayout: React.FC = () => {
  const { signOut, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar userRole={currentUser?.role} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              {currentUser?.role ? `${currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)} Dashboard` : 'Dashboard'}
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {currentUser?.displayName || currentUser?.email}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                className="text-gray-600 hover:text-red-600"
                aria-label="Sign out"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
