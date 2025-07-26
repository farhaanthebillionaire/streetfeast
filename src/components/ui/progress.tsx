import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const progressVariants = cva(
  "h-2 w-full overflow-hidden rounded-full bg-secondary",
  {
    variants: {
      variant: {
        default: "bg-slate-200 dark:bg-slate-800",
        primary: "bg-primary/20",
        success: "bg-green-500/20",
        warning: "bg-amber-500/20",
        danger: "bg-red-500/20",
        info: "bg-blue-500/20",
      },
      size: {
        default: "h-2",
        sm: "h-1.5",
        lg: "h-3",
      },
      rounded: {
        default: "rounded-full",
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
    },
  }
)

const progressIndicatorVariants = cva(
  "h-full w-full flex-1 transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-slate-900 dark:bg-slate-50",
        primary: "bg-primary",
        success: "bg-green-600",
        warning: "bg-amber-500",
        danger: "bg-red-600",
        info: "bg-blue-600",
      },
      hasStripes: {
        true: "bg-stripes",
      },
      isAnimated: {
        true: "animate-pulse",
      },
    },
    defaultVariants: {
      variant: "default",
      hasStripes: false,
      isAnimated: false,
    },
  }
)

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants> {
  /**
   * The value of the progress indicator as a number between 0 and 100
   */
  value?: number
  /**
   * The minimum value of the progress indicator
   * @default 0
   */
  min?: number
  /**
   * The maximum value of the progress indicator
   * @default 100
   */
  max?: number
  /**
   * Whether to show a visual indicator of the progress value
   * @default false
   */
  showValueIndicator?: boolean
  /**
   * The position of the value indicator
   * @default 'end'
   */
  indicatorPosition?: 'start' | 'center' | 'end' | 'none'
  /**
   * Whether to show stripes on the progress indicator
   * @default false
   */
  showStripes?: boolean
  /**
   * Whether to animate the progress indicator
   * @default false
   */
  isAnimated?: boolean
  /**
   * Custom class name for the progress indicator
   */
  indicatorClassName?: string
  /**
   * Custom class name for the progress value text
   */
  valueClassName?: string
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(
  (
    {
      className,
      value = 0,
      min = 0,
      max = 100,
      variant = 'default',
      size = 'default',
      rounded = 'default',
      showValueIndicator = false,
      indicatorPosition = 'end',
      showStripes = false,
      isAnimated = false,
      indicatorClassName,
      valueClassName,
      ...props
    },
    ref
  ) => {
    // Calculate the percentage value
    const percentage = Math.min(100, Math.max(0, (value / (max - min)) * 100))
    const showIndicator = showValueIndicator && indicatorPosition !== 'none'

    return (
      <div className="w-full space-y-1">
        <ProgressPrimitive.Root
          ref={ref}
          className={cn(progressVariants({ variant, size, rounded, className }))}
          value={value}
          {...props}
        >
          <ProgressPrimitive.Indicator
            className={cn(
              progressIndicatorVariants({
                variant,
                hasStripes: showStripes,
                isAnimated,
              }),
              indicatorClassName,
              {
                'bg-stripes': showStripes,
              }
            )}
            style={{
              transform: `translateX(-${100 - percentage}%)`,
            }}
          />
        </ProgressPrimitive.Root>
        
        {showIndicator && (
          <div
            className={cn(
              'flex w-full text-xs text-muted-foreground',
              {
                'justify-start': indicatorPosition === 'start',
                'justify-center': indicatorPosition === 'center',
                'justify-end': indicatorPosition === 'end',
              },
              valueClassName
            )}
          >
            {Math.round(percentage)}%
          </div>
        )}
      </div>
    )
  }
)
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
