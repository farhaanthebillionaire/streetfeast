import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "../../lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    icon?: React.ReactNode
  }
>(({ className, icon, children, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  >
    {icon && <span className="mr-2 h-4 w-4">{icon}</span>}
    {children}
  </TabsPrimitive.Trigger>
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

type TabsVariant = "default" | "pills" | "underline"

interface TabsContainerProps extends React.ComponentProps<typeof Tabs> {
  variant?: TabsVariant
  tabs: {
    value: string
    label: string
    icon?: React.ReactNode
    content: React.ReactNode
    disabled?: boolean
  }[]
  className?: string
  listClassName?: string
  contentClassName?: string
  triggerClassName?: string
}

const TabsContainer = ({
  tabs,
  variant = "default",
  className,
  listClassName,
  contentClassName,
  triggerClassName,
  ...props
}: TabsContainerProps) => {
  const [activeTab, setActiveTab] = React.useState(tabs[0]?.value)

  const variantClasses = {
    default: "",
    pills: "p-1.5 rounded-lg bg-muted",
    underline: "border-b border-border gap-6 p-0 bg-transparent",
  }

  const triggerVariantClasses = {
    default: "",
    pills: "data-[state=active]:bg-background data-[state=active]:shadow-sm",
    underline:
      "rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none",
  }

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className={cn("w-full", className)}
      {...props}
    >
      <TabsList
        className={cn(
          variantClasses[variant],
          variant === "underline" && "h-auto p-0",
          listClassName
        )}
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            disabled={tab.disabled}
            className={cn(
              triggerVariantClasses[variant],
              variant === "underline" && "px-1 py-3",
              triggerClassName
            )}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className={cn("mt-6 w-full", contentClassName)}
        >
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsContainer,
  type TabsVariant,
}
