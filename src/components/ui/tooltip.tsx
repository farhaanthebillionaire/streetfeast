import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "../../lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

interface TooltipProps {
  /**
   * The content to show inside the tooltip
   */
  content: React.ReactNode
  /**
   * The element that will trigger the tooltip
   */
  children: React.ReactNode
  /**
   * Additional class names to apply to the tooltip content
   */
  className?: string
  /**
   * The open state of the tooltip when controlled
   */
  open?: boolean
  /**
   * The default open state when uncontrolled
   */
  defaultOpen?: boolean
  /**
   * Event handler called when the open state changes
   */
  onOpenChange?: (open: boolean) => void
  /**
   * The preferred side of the trigger to render against when open
   */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /**
   * The distance in pixels from the trigger
   */
  sideOffset?: number
  /**
   * The preferred alignment against the trigger
   */
  align?: 'start' | 'center' | 'end'
  /**
   * An offset in pixels from the "start" or "end" alignment options
   */
  alignOffset?: number
  /**
   * The duration from when the pointer enters the trigger until the tooltip gets opened
   */
  delayDuration?: number
  /**
   * When true, trying to hover the content will not close the tooltip
   */
  disableHoverableContent?: boolean
  /**
   * The open delay in milliseconds
   */
  openDelay?: number
  /**
   * The close delay in milliseconds
   */
  closeDelay?: number
  /**
   * The padding between the arrow and the edges of the tooltip
   */
  arrowPadding?: number
  /**
   * The padding between the trigger and the tooltip
   */
  offset?: number
  /**
   * Additional props for the tooltip portal
   */
  portalProps?: React.ComponentProps<typeof TooltipPrimitive.Portal>
}

/**
 * A simple tooltip component that shows content when hovering over a trigger element.
 */
const TooltipWrapper = ({
  content,
  children,
  className,
  open,
  defaultOpen,
  onOpenChange,
  side = 'top',
  sideOffset = 4,
  align = 'center',
  alignOffset = 0,
  delayDuration = 700,
  disableHoverableContent = false,
  openDelay = 0,
  closeDelay = 0,
  arrowPadding = 5,
  offset = 5,
  portalProps,
  ...props
}: TooltipProps) => {
  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        delayDuration={delayDuration}
        disableHoverableContent={disableHoverableContent}
      >
        <TooltipPrimitive.Trigger asChild>
          {children}
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal {...portalProps}>
          <TooltipPrimitive.Content
            side={side}
            sideOffset={sideOffset}
            align={align}
            alignOffset={alignOffset}
            className={cn(
              "z-50 overflow-hidden rounded-md bg-gray-900 px-3 py-1.5 text-xs text-gray-50 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:bg-gray-50 dark:text-gray-900",
              className
            )}
            {...props}
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-gray-900 dark:fill-gray-50" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  TooltipWrapper,
}
