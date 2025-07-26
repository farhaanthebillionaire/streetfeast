import * as React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from './theme-provider';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { cn } from '../../lib/utils';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem 
          onClick={() => setTheme('light')}
          className={cn(
            'flex items-center justify-between',
            theme === 'light' && 'font-medium text-primary'
          )}
        >
          <span>Light</span>
          <Sun className="h-4 w-4" />
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('dark')}
          className={cn(
            'flex items-center justify-between',
            theme === 'dark' && 'font-medium text-primary'
          )}
        >
          <span>Dark</span>
          <Moon className="h-4 w-4" />
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('system')}
          className={cn(
            'flex items-center justify-between',
            theme === 'system' && 'font-medium text-primary'
          )}
        >
          <span>System</span>
          <Monitor className="h-4 w-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
