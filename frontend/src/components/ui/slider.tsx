'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface SliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  max: number;
  min: number;
  step: number;
  className?: string;
}

export function Slider({
  value,
  onValueChange,
  max,
  min,
  step,
  className,
}: SliderProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    onValueChange([newValue]);
  };

  return (
    <div className={cn('relative flex items-center w-full', className)}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value[0]}
        onChange={handleChange}
        className="slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
        style={{
          background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${
            ((value[0] - min) / (max - min)) * 100
          }%, rgb(229, 231, 235) ${
            ((value[0] - min) / (max - min)) * 100
          }%, rgb(229, 231, 235) 100%)`,
        }}
      />
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: hsl(var(--primary));
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: hsl(var(--primary));
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}
