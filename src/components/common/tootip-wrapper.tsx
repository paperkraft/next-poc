import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type TooltipWrapperProps = {
    children: React.ReactNode;
    tooltip: string;
}
export const TooltipWrapper = ({ children, tooltip }: TooltipWrapperProps) => {
    return (
        <Tooltip>
            <TooltipTrigger>
                {children}
            </TooltipTrigger>
            <TooltipContent>
                <p>{tooltip}</p>
            </TooltipContent>
        </Tooltip>
    );
}