import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, defaultValue, value, onValueChange, children, ...props }, ref) => {
    const [selectedTab, setSelectedTab] = useState(value || defaultValue || "");

    const handleTabChange = (newValue: string) => {
      setSelectedTab(newValue);
      onValueChange?.(newValue);
    };

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {React.Children.map(children, (child) =>
          React.isValidElement(child)
            ? React.cloneElement(child as React.ReactElement<any>, {
                selectedTab,
                onTabChange: handleTabChange,
              })
            : child
        )}
      </div>
    );
  }
);
Tabs.displayName = "Tabs";

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  selectedTab?: string;
  onTabChange?: (value: string) => void;
}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, selectedTab, onTabChange, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center space-x-1 border-b border-border bg-bg-surface",
          className
        )}
        {...props}
      >
        {React.Children.map(children, (child) =>
          React.isValidElement(child)
            ? React.cloneElement(child as React.ReactElement<any>, {
                selectedTab,
                onTabChange,
              })
            : child
        )}
      </div>
    );
  }
);
TabsList.displayName = "TabsList";

interface TabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  selectedTab?: string;
  onTabChange?: (value: string) => void;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, selectedTab, onTabChange, ...props }, ref) => {
    const isSelected = selectedTab === value;

    return (
      <button
        ref={ref}
        className={cn(
          "px-4 py-2 text-sm font-medium transition-all duration-200 border-b-2",
          isSelected
            ? "text-accent border-b-accent"
            : "text-text-secondary border-b-transparent hover:text-text-primary hover:border-b-border",
          className
        )}
        onClick={() => onTabChange?.(value)}
        {...props}
      />
    );
  }
);
TabsTrigger.displayName = "TabsTrigger";

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  selectedTab?: string;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, selectedTab, children, ...props }, ref) => {
    if (selectedTab !== value) return null;

    return (
      <div
        ref={ref}
        className={cn("mt-4 animate-fadeIn", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
