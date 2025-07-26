import { toast } from 'react-hot-toast';

type ToastVariant = 'success' | 'error' | 'info' | 'warning' | 'default';

interface ToastOptions {
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  className?: string;
  icon?: React.ReactNode;
}

/**
 * Displays a toast notification
 * @param message The message to display
 * @param variant The type of toast to display
 * @param options Additional toast options
 */
export function showToast(
  message: string, 
  variant: ToastVariant = 'default',
  options: ToastOptions = {}
) {
  const {
    duration = 4000,
    position = 'top-center',
    className = '',
    icon,
  } = options;

  const baseClasses = {
    success: 'bg-green-500 text-white',
    error: 'bg-destructive text-destructive-foreground',
    warning: 'bg-amber-500 text-amber-900',
    info: 'bg-blue-500 text-white',
    default: 'bg-primary text-primary-foreground',
  };

  toast(message, {
    duration,
    position,
    icon,
    className: `rounded-lg p-4 shadow-lg ${baseClasses[variant]} ${className}`,
    style: {
      padding: '16px',
      color: 'white',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
  });
}

// Convenience methods for different toast types
export const toastSuccess = (message: string, options?: Omit<ToastOptions, 'variant'>) =>
  showToast(message, 'success', options);

export const toastError = (message: string, options?: Omit<ToastOptions, 'variant'>) =>
  showToast(message, 'error', options);

export const toastWarning = (message: string, options?: Omit<ToastOptions, 'variant'>) =>
  showToast(message, 'warning', options);

export const toastInfo = (message: string, options?: Omit<ToastOptions, 'variant'>) =>
  showToast(message, 'info', options);

// Promise toast that shows loading, success, and error states
export const promiseToast = async <T,>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: any) => string);
  },
  options?: ToastOptions
): Promise<T> => {
  const toastId = toast.loading(messages.loading);
  
  try {
    const data = await promise;
    const successMessage = typeof messages.success === 'function' 
      ? messages.success(data) 
      : messages.success;
    
    toast.success(successMessage, {
      id: toastId,
      duration: options?.duration || 4000,
      className: `rounded-lg p-4 shadow-lg bg-green-500 text-white ${options?.className || ''}`,
    });
    
    return data;
  } catch (error) {
    const errorMessage = typeof messages.error === 'function'
      ? messages.error(error)
      : messages.error;
    
    toast.error(errorMessage, {
      id: toastId,
      duration: options?.duration || 4000,
      className: `rounded-lg p-4 shadow-lg bg-destructive text-destructive-foreground ${options?.className || ''}`,
    });
    
    throw error;
  }
};
