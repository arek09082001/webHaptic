import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

// Utility function to merge class names
function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(" ");
}

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-primary text-white shadow-lg shadow-magenta/20 hover:shadow-magenta/30 hover:scale-105",
        destructive:
          "bg-red-600 text-white shadow-lg shadow-red-600/20 hover:bg-red-700 hover:shadow-red-600/30",
        outline:
          "border border-border-light bg-transparent hover:bg-surface-hover hover:border-magenta text-text-primary",
        secondary:
          "bg-surface-hover border border-border hover:bg-surface hover:border-magenta text-text-primary",
        ghost:
          "hover:bg-surface-hover hover:text-text-primary text-text-muted",
        link:
          "text-magenta underline-offset-4 hover:underline hover:text-magenta-light",
        gradient:
          "bg-gradient-primary text-white shadow-lg shadow-magenta/20 hover:shadow-magenta/40 hover:scale-105",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-md px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    const variantClasses = variant === "default" ? "bg-gradient-primary text-white shadow-lg shadow-magenta/20 hover:shadow-magenta/30 hover:scale-105" :
      variant === "destructive" ? "bg-red-600 text-white shadow-lg shadow-red-600/20 hover:bg-red-700 hover:shadow-red-600/30" :
      variant === "outline" ? "border border-border-light bg-transparent hover:bg-surface-hover hover:border-magenta text-text-primary" :
      variant === "secondary" ? "bg-surface-hover border border-border hover:bg-surface hover:border-magenta text-text-primary" :
      variant === "ghost" ? "hover:bg-surface-hover hover:text-text-primary text-text-muted" :
      variant === "link" ? "text-magenta underline-offset-4 hover:underline hover:text-magenta-light" :
      variant === "gradient" ? "bg-gradient-primary text-white shadow-lg shadow-magenta/20 hover:shadow-magenta/40 hover:scale-105" :
      "bg-gradient-primary text-white shadow-lg shadow-magenta/20 hover:shadow-magenta/30 hover:scale-105";
    
    const sizeClasses = size === "sm" ? "h-9 rounded-md px-3 text-xs" :
      size === "lg" ? "h-11 rounded-md px-8" :
      size === "xl" ? "h-12 rounded-md px-10 text-base" :
      size === "icon" ? "h-10 w-10" :
      "h-10 px-4 py-2";
    
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta disabled:pointer-events-none disabled:opacity-50",
          variantClasses,
          sizeClasses,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
