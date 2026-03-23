import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "danger" | "accent";
  size?: "sm" | "md" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer border rounded-xs outline-none focus:outline-none",
          variant === "default" && [
            "bg-accent text-white border-accent hover:bg-blue-600 hover:border-blue-600",
            "hover:shadow-lg hover:shadow-accent-glow/20",
          ],
          variant === "ghost" && [
            "bg-transparent text-text-primary border-border hover:bg-bg-surface-2 hover:border-border-active",
          ],
          variant === "danger" && [
            "bg-transparent text-status-danger border-status-danger hover:bg-status-danger/10 hover:border-status-danger",
          ],
          variant === "accent" && [
            "bg-accent text-white border-accent hover:bg-accent-glow hover:border-accent-glow",
            "hover:shadow-lg hover:shadow-accent-glow/30",
          ],
          size === "sm" && "px-3 py-1.5 text-sm",
          size === "md" && "px-4 py-2 text-sm",
          size === "lg" && "px-6 py-3 text-base",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
