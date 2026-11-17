import * as React from "react"
import { cn } from "@/lib/utils"

export function TooltipProvider({ children }) {
  return <>{children}</>
}

export function Tooltip({ children }) {
  const [visible, setVisible] = React.useState(false)
  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {React.Children.map(children, (child) => {
        if (child.type === TooltipContent) {
          return React.cloneElement(child, { visible })
        }
        return child
      })}
    </div>
  )
}

export function TooltipTrigger({ children, asChild, ...props }) {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, props)
  }
  return <div {...props}>{children}</div>
}

export function TooltipContent({ className, children, visible, ...props }) {
  if (!visible) return null
  return (
    <div
      className={cn(
        "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground shadow-md animate-in fade-in-0 zoom-in-95 pointer-events-none whitespace-nowrap",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
