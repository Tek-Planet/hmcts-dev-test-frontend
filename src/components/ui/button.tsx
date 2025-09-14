import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-4 focus:ring-warning shadow-sm border-0 rounded",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-4 focus:ring-warning shadow-sm border-0 rounded",
        outline: "border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground focus:ring-4 focus:ring-warning rounded",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-4 focus:ring-warning shadow-sm border-0 rounded",
        ghost: "hover:bg-accent hover:text-accent-foreground focus:ring-4 focus:ring-warning rounded",
        link: "text-primary underline-offset-4 hover:underline focus:ring-4 focus:ring-warning rounded-sm",
        success: "bg-success text-success-foreground hover:bg-success/90 focus:ring-4 focus:ring-warning shadow-sm border-0 rounded",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90 focus:ring-4 focus:ring-primary shadow-sm border-0 rounded",
      },
      size: {
        default: "h-10 px-4 py-2 text-base",
        sm: "h-8 px-3 text-sm",
        lg: "h-12 px-6 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
