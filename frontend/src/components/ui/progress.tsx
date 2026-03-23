import React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  variant?: "default" | "success" | "warning" | "danger";
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, max = 100, variant = "default", ...props }, ref) => {
    const percentage = Math.min((value / max) * 100, 100);

    return (
      <div
        ref={ref}
        className={cn("w-full h-2 bg-bg-surface-2 rounded-xs overflow-hidden", className)}
        {...props}
      >
        <div
          className={cn(
            "h-full transition-all duration-300 rounded-xs",
            variant === "default" && "bg-accent",
            variant === "success" && "bg-status-success",
            variant === "warning" && "bg-status-warning",
            variant === "danger" && "bg-status-danger"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress };
