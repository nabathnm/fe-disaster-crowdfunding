import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-emerald-600 text-white shadow-sm shadow-emerald-600/25 hover:bg-emerald-700 hover:shadow-md hover:shadow-emerald-600/35",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-emerald-200 bg-white text-emerald-800 shadow-sm hover:bg-emerald-50 hover:text-emerald-900 hover:border-emerald-300 dark:bg-card dark:border-emerald-900/60 dark:text-emerald-200",
        secondary:
          "bg-emerald-50 text-emerald-800 hover:bg-emerald-100/80 border border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40",
        ghost: "hover:bg-emerald-50 hover:text-emerald-900 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-200",
        link: "text-emerald-600 underline-offset-4 hover:underline dark:text-emerald-400",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-11 rounded-lg px-8 text-base font-semibold",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, children, ...props }, ref) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      className: cn(buttonVariants({ variant, size, className }), children.props.className),
      ref,
      ...props,
    })
  }

  return (
    <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
      {children}
    </button>
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }
