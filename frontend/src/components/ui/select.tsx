import React from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <div className="w-full">
        <select
          className={cn(
            "w-full px-3 py-2 text-sm text-text-primary bg-bg-surface border border-border rounded-xs",
            "outline-none transition-all duration-200 appearance-none bg-no-repeat",
            "focus:border-border-active focus:shadow-lg focus:shadow-accent/10",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-status-danger focus:border-status-danger",
            "cursor-pointer",
            className
          )}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238B92A8' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
            backgroundPosition: "right 8px center",
            backgroundRepeat: "no-repeat",
            paddingRight: "28px",
          }}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        {error && <p className="text-sm text-status-danger mt-1">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
