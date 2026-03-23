import React from "react";
import { cn } from "@/lib/utils";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          className={cn(
            "w-full px-3 py-2 text-sm text-text-primary bg-bg-surface border border-border rounded-xs",
            "placeholder:text-text-muted outline-none transition-all duration-200 resize-vertical",
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
Textarea.displayName = "Textarea";

export { Textarea };
