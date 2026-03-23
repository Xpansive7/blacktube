import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  delayMs?: number;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  side = "top",
  delayMs = 200,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    const id = setTimeout(() => setIsVisible(true), delayMs);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsVisible(false);
  };

  const sidePositions = {
    top: "bottom-full mb-2",
    right: "left-full ml-2",
    bottom: "top-full mt-2",
    left: "right-full mr-2",
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div
          className={cn(
            "absolute z-50 px-2 py-1 text-xs text-white bg-bg-surface-3 border border-border rounded-xs",
            "whitespace-nowrap pointer-events-none animate-fadeIn",
            sidePositions[side]
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export { Tooltip };
