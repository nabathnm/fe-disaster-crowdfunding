import * as React from "react"
import { cn } from "@/lib/utils"

const Progress = React.forwardRef(({ className, value = 0, indicatorClassName, ...props }, ref) => {
  const clampedValue = Math.min(Math.max(value || 0, 0), 100)
  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clampedValue}
      className={cn("relative h-2.5 w-full overflow-hidden rounded-full bg-emerald-100/80 dark:bg-emerald-950/50", className)}
      {...props}
    >
      <div
        className={cn("h-full w-full flex-1 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-500 transition-all duration-500 rounded-full", indicatorClassName)}
        style={{ transform: `translateX(-${100 - clampedValue}%)` }}
      />
    </div>
  )
})
Progress.displayName = "Progress"

export { Progress }
