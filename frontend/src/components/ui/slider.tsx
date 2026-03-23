import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SliderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  onChange?: (value: number) => void;
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      className,
      min = 0,
      max = 100,
      step = 1,
      value: externalValue,
      onChange,
      ...props
    },
    ref
  ) => {
    const [value, setValue] = useState(externalValue || min);
    const [isDragging, setIsDragging] = useState(false);
    const sliderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (externalValue !== undefined) {
        setValue(externalValue);
      }
    }, [externalValue]);

    const handleMouseDown = () => {
      setIsDragging(true);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDragging || !sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(x / rect.width, 1));
      const newValue = Math.round(
        (percentage * (max - min) + min) / step
      ) * step;

      setValue(newValue);
      onChange?.(newValue);
    };

    useEffect(() => {
      if (isDragging) {
        document.addEventListener("mouseup", handleMouseUp);
        return () => document.removeEventListener("mouseup", handleMouseUp);
      }
    }, [isDragging]);

    const percentage = ((value - min) / (max - min)) * 100;

    return (
      <div
        ref={ref}
        className={cn("w-full", className)}
        onMouseMove={handleMouseMove}
        {...props}
      >
        <div
          ref={sliderRef}
          className="relative w-full h-2 bg-bg-surface-2 rounded-xs cursor-pointer group"
        >
          <div
            className="absolute h-full bg-accent rounded-xs transition-all"
            style={{ width: `${percentage}%` }}
          />
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-accent rounded-full border border-accent-glow",
              "transition-all shadow-lg hover:shadow-xl hover:w-5 hover:h-5 hover:-translate-y-2",
              isDragging && "w-5 h-5 -translate-y-2 shadow-xl shadow-accent-glow/50"
            )}
            style={{ left: `${percentage}%`, transform: "translate(-50%, -50%)" }}
            onMouseDown={handleMouseDown}
          />
        </div>
      </div>
    );
  }
);
Slider.displayName = "Slider";

export { Slider };
