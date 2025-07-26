import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"
import { AlertCircle, CheckCircle2, Info, XCircle, AlertTriangle } from "lucide-react"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        primary: "border-blue-500/50 bg-blue-50 text-blue-900 dark:bg-blue-950/50 dark:text-blue-200 [&>svg]:text-blue-500",
        success: "border-green-500/50 bg-green-50 text-green-900 dark:bg-green-950/50 dark:text-green-200 [&>svg]:text-green-500",
        warning: "border-amber-500/50 bg-amber-50 text-amber-900 dark:bg-amber-950/50 dark:text-amber-200 [&>svg]:text-amber-500",
        danger: "border-red-500/50 bg-red-50 text-red-900 dark:bg-red-950/50 dark:text-red-200 [&>svg]:text-red-500",
        info: "border-blue-500/50 bg-blue-50 text-blue-900 dark:bg-blue-950/50 dark:text-blue-200 [&>svg]:text-blue-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

const AlertIcon = {
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: XCircle,
  info: Info,
  primary: Info,
  default: AlertCircle,
}

interface AlertWithIconProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof AlertIcon
  title?: string
  description?: string
  icon?: React.ReactNode
  className?: string
}

const AlertWithIcon = ({
  variant = "default",
  title,
  description,
  icon: CustomIcon,
  className,
  ...props
}: AlertWithIconProps) => {
  const Icon = CustomIcon || AlertIcon[variant] || AlertCircle
  
  return (
    <Alert variant={variant} className={className} {...props}>
      <Icon className="h-5 w-5" />
      <div>
        {title && <AlertTitle>{title}</AlertTitle>}
        {description && <AlertDescription>{description}</AlertDescription>}
      </div>
    </Alert>
  )
}

export { Alert, AlertTitle, AlertDescription, AlertWithIcon }
