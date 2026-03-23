import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "danger" | "accent";
  size?: "sm" | "md";
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", size = "sm", ...props }, ref) => {
    return (
      <div
        className={cn(
          "inline-flex items-center font-medium rounded-xs border",
          variant === "default" && "bg-bg-surface-2 text-text-secondary border-border",
          variant === "success" && "bg-status-success/20 text-status-success border-status-success/50",
          variant === "warning" && "bg-status-warning/20 text-status-warning border-status-warning/50",
          variant === "danger" && "bg-status-danger/20 text-status-danger border-status-danger/50",
          variant === "accent" && "bg-accent/20 text-accent-glow border-accent/50",
          size === "sm" && "px-2 py-0.5 text-xs",
          size === "md" && "px-3 py-1 text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export { Badge };
