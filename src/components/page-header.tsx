import * as React from 'react';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/button';
import { ChevronLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  backLink?: string;
  backText?: string;
  showHomeButton?: boolean;
  actions?: React.ReactNode;
  className?: string;
  withBorder?: boolean;
}

export function PageHeader({
  title,
  description,
  backLink,
  backText = 'Back',
  showHomeButton = false,
  actions,
  className,
  withBorder = true,
  ...props
}: PageHeaderProps) {
  const navigate = useNavigate();
  const hasBackButton = !!backLink || showHomeButton;

  return (
    <div 
      className={cn(
        'flex flex-col space-y-2 pb-4',
        withBorder && 'border-b border-border',
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {hasBackButton && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => backLink ? navigate(backLink) : navigate('/')}
              aria-label={backLink ? backText : 'Go home'}
            >
              {backLink ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <Home className="h-4 w-4" />
              )}
            </Button>
          )}
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        </div>
        
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
      
      {description && (
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}

interface PageHeaderActionProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function PageHeaderAction({
  icon,
  label,
  onClick,
  variant = 'default',
  size = 'default',
}: PageHeaderActionProps) {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      className="flex items-center gap-2"
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </Button>
  );
}

// Example usage:
// <PageHeader 
//   title="Dashboard" 
//   description="Welcome back! Here's what's happening with your business today."
//   backLink="/dashboard"
//   backText="Back to dashboard"
//   actions={
//     <>
//       <PageHeaderAction
//         icon={<Plus className="h-4 w-4" />}
//         label="New Item"
//         onClick={() => console.log('Add new item')}
//         variant="default"
//       />
//       <PageHeaderAction
//         icon={<Settings className="h-4 w-4" />}
//         label="Settings"
//         onClick={() => navigate('/settings')}
//         variant="outline"
//       />
//     </>
//   }
// />
