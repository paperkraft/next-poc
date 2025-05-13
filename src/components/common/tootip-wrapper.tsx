'use client';

import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TooltipWrapperProps extends React.HTMLAttributes<HTMLElement> {
    tooltip: string;
    children: React.ReactNode;
}

const TooltipWrapper = React.forwardRef<HTMLElement, TooltipWrapperProps>(
    ({ tooltip, children, ...props }, ref) => {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        {React.isValidElement(children)
                            ? React.cloneElement(children as React.ReactElement, { ref, ...props })
                            : children}
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{tooltip}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }
);

TooltipWrapper.displayName = 'TooltipWrapper';

export default TooltipWrapper;
