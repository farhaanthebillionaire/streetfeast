import * as React from "react"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "../../lib/utils"
import { Link } from "react-router-dom"

const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & {
    separator?: React.ReactNode
    showHome?: boolean
    homeHref?: string
  }
>(({ className, separator, showHome = true, homeHref = "/", ...props }, ref) => {
  return (
    <nav
      ref={ref}
      aria-label="breadcrumb"
      className={cn("flex items-center text-sm font-medium text-muted-foreground", className)}
      {...props}
    />
  )
})
Breadcrumb.displayName = "Breadcrumb"

const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.HTMLAttributes<HTMLOListElement>
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      "flex flex-wrap items-center gap-1.5 break-words text-sm sm:gap-2.5",
      className
    )}
    {...props}
  />
))
BreadcrumbList.displayName = "BreadcrumbList"

const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("inline-flex items-center gap-1.5", className)}
    {...props}
  />
))
BreadcrumbItem.displayName = "BreadcrumbItem"

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    asChild?: boolean
  }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? "span" : Link
  
  return (
    <Comp
      ref={ref as any}
      className={cn(
        "transition-colors hover:text-foreground",
        className
      )}
      {...props}
    />
  )
})
BreadcrumbLink.displayName = "BreadcrumbLink"

const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn("font-normal text-foreground", className)}
    {...props}
  />
))
BreadcrumbPage.displayName = "BreadcrumbPage"

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLLIElement>) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn("[&>svg]:size-3.5", className)}
    {...props}
  >
    {children ?? <ChevronRight className="h-4 w-4" />}
  </li>
)
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

const BreadcrumbEllipsis = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
    <span className="sr-only">More</span>
  </span>
)
BreadcrumbEllipsis.displayName = "BreadcrumbElipssis"

interface BreadcrumbProps {
  items: Array<{
    label: string
    href?: string
    icon?: React.ReactNode
    active?: boolean
  }>
  separator?: React.ReactNode
  showHome?: boolean
  homeHref?: string
  className?: string
  itemClassName?: string
  activeItemClassName?: string
  separatorClassName?: string
}

const BreadcrumbWrapper = ({
  items,
  separator = <ChevronRight className="h-4 w-4" />,
  showHome = true,
  homeHref = "/",
  className,
  itemClassName,
  activeItemClassName,
  separatorClassName,
}: BreadcrumbProps) => {
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {showHome && (
          <>
            <BreadcrumbItem className={itemClassName}>
              <BreadcrumbLink href={homeHref}>
                <Home className="h-4 w-4" />
                <span className="sr-only">Home</span>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className={separatorClassName}>
              {separator}
            </BreadcrumbSeparator>
          </>
        )}
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          
          return (
            <React.Fragment key={index}>
              <BreadcrumbItem className={itemClassName}>
                {isLast || !item.href ? (
                  <BreadcrumbPage 
                    className={cn(
                      "flex items-center gap-1.5",
                      activeItemClassName
                    )}
                  >
                    {item.icon && <span>{item.icon}</span>}
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink 
                    href={item.href}
                    className="flex items-center gap-1.5"
                  >
                    {item.icon && <span>{item.icon}</span>}
                    {item.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && (
                <BreadcrumbSeparator className={separatorClassName}>
                  {separator}
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
  BreadcrumbWrapper,
}
