import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const skeletonVariants = cva(
  "animate-pulse bg-muted",
  {
    variants: {
      variant: {
        default: "rounded-md",
        circle: "rounded-full",
        text: "h-4 rounded",
        title: "h-6 rounded-md",
        subtitle: "h-4 w-3/4 rounded",
        paragraph: "h-4 w-full rounded",
        button: "h-10 rounded-md",
        avatar: "h-10 w-10 rounded-full",
        card: "h-full w-full rounded-xl",
        image: "h-full w-full rounded-md",
      },
      size: {
        default: "",
        sm: "h-4",
        md: "h-6",
        lg: "h-8",
        xl: "h-12",
        "2xl": "h-16",
        "3xl": "h-20",
        "4xl": "h-24",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  /**
   * Whether to show the skeleton
   * @default true
   */
  show?: boolean
  /**
   * Number of skeleton items to render
   * @default 1
   */
  count?: number
  /**
   * Custom class name for the container
   */
  containerClassName?: string
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({
    className,
    variant,
    size,
    show = true,
    count = 1,
    containerClassName,
    ...props
  }, ref) => {
    if (!show) return null

    const skeletons = Array.from({ length: count }, (_, i) => (
      <div
        key={i}
        ref={i === 0 ? ref : undefined}
        className={cn(skeletonVariants({ variant, size, className }))}
        {...(i === 0 ? props : {})}
      />
    ))

    if (count === 1) {
      return skeletons[0]
    }

    return (
      <div className={cn("space-y-2", containerClassName)}>
        {skeletons}
      </div>
    )
  }
)
Skeleton.displayName = "Skeleton"

export { Skeleton, skeletonVariants }
