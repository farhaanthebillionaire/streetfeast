import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"
import { Loader2 } from "lucide-react"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        success:
          "bg-green-600 text-white shadow-sm hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800",
        warning:
          "bg-amber-500 text-amber-900 shadow-sm hover:bg-amber-600 dark:bg-amber-700 dark:text-amber-100 dark:hover:bg-amber-800",
        info:
          "bg-blue-500 text-white shadow-sm hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        xs: "h-7 rounded-md px-2 text-xs",
        sm: "h-8 rounded-md px-3 text-sm",
        default: "h-10 px-4 py-2",
        lg: "h-11 rounded-md px-6 text-base",
        xl: "h-12 rounded-lg px-8 text-lg",
        icon: "h-10 w-10",
        iconSm: "h-8 w-8",
        iconLg: "h-12 w-12",
      },
      rounded: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        full: "rounded-full",
      },
      shadow: {
        none: "shadow-none",
        sm: "shadow-sm",
        default: "shadow",
        md: "shadow-md",
        lg: "shadow-lg",
        xl: "shadow-xl",
      },
    },
    compoundVariants: [
      {
        variant: ["default", "destructive", "success", "warning", "info"],
        className: "text-white",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "md",
      shadow: "none",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  shadow?: 'none' | 'sm' | 'default' | 'md' | 'lg' | 'xl'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant,
    size,
    asChild = false,
    isLoading = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    fullWidth,
    rounded,
    shadow,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        className={cn(
          buttonVariants({ 
            variant, 
            size, 
            rounded,
            shadow,
            className: cn(
              fullWidth && "w-full",
              className
            ) 
          }),
          {
            "cursor-not-allowed opacity-60": isLoading,
          }
        )}
        ref={ref}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {children}
          </>
        ) : (
          <>
            {leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2">{rightIcon}</span>}
          </>
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
