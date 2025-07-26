import React from 'react';

type LoadingSpinnerProps = {
  fullPage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  fullPage = false,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-2',
    lg: 'h-16 w-16 border-4',
  };

  const spinner = (
    <div className={`flex items-center justify-center ${fullPage ? 'min-h-screen' : ''} ${className}`}>
      <div
        className={`animate-spin rounded-full ${sizeClasses[size]} border-t-2 border-b-2 border-primary`}
      />
    </div>
  );

  return spinner;
};

export default LoadingSpinner;
