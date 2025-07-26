import * as React from 'react';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/auth/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { LogOut, User, Settings } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { getUserInitials, formatDisplayName, formatUserRole } from '../lib/user-utils';

interface UserAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  showName?: boolean;
}

export function UserAvatar({ className, showName = false }: UserAvatarProps) {
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) {
    return (
      <div className={cn('flex items-center gap-4', className)}>
        <Button variant="outline" onClick={() => navigate('/login')}>
          Sign In
        </Button>
        <Button onClick={() => navigate('/register')}>Sign Up</Button>
      </div>
    );
  }

  const userInitial = getUserInitials(currentUser.displayName || currentUser.email);
  const userName = formatDisplayName({
    displayName: currentUser.displayName,
    email: currentUser.email
  });
  const userRole = formatUserRole(currentUser.role);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-8 w-8 rounded-full"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage 
                src={currentUser.photoURL || ''} 
                alt={userName}
              />
              <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white">
                {userInitial}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{userName}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {userRole}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="cursor-pointer"
            onClick={() => navigate('/profile')}
          >
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="cursor-pointer"
            onClick={() => navigate('/settings')}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {showName && (
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-medium leading-none">{userName}</p>
          <p className="text-xs leading-none text-muted-foreground">
            {userRole}
          </p>
        </div>
      )}
    </div>
  );
}
