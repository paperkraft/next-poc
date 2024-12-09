'use client';
import { cn } from "@/lib/utils";
import React from 'react';

const Divider = React.forwardRef<HTMLDivElement, { text?: string; className?: string }>(
  ({ text, className }, ref) => {
    return (
      <div ref={ref} className={cn(`${className} relative`)}>
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {text}
          </span>
        </div>
      </div>
    );
  }
);

Divider.displayName = 'Divider';

export default Divider;
