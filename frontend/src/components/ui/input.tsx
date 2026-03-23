import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          className={cn(
            "w-full px-3 py-2 text-sm text-text-primary bg-bg-surface border border-border rounded-xs",
            "placeholder:text-text-muted outline-none transition-all duration-200",
            "focus:border-border-active focus:shadow-lg focus:shadow-accent/10",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-status-danger focus:border-status-danger",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-sm text-status-danger mt-1">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
