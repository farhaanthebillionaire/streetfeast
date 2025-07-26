import * as React from 'react';
import { cn } from '../lib/utils';

type LogoProps = React.SVGProps<SVGSVGElement> & {
  variant?: 'default' | 'icon';
};

export function Logo({ className, variant = 'default', ...props }: LogoProps) {
  if (variant === 'icon') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn('text-primary', className)}
        {...props}
      >
        <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0" />
        <path d="M3 12a9 9 0 1 1 18 0 9 9 0 0 1-18 0" />
        <path d="M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18" />
        <path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('text-primary', className)}
      {...props}
    >
      <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0" />
      <path d="M3 12a9 9 0 1 1 18 0 9 9 0 0 1-18 0" />
      <path d="M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18" />
      <path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
    </svg>
  );
}
