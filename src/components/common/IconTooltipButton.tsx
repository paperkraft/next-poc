'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type IconTooltipButtonProps = {
    icon: ReactNode;
    tooltip: string;
    onClick?: () => void;
    asChild?: boolean;
    href?: string;
    disabled?: boolean;
    variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive';
    size?: "default" | "sm" | "lg" | "icon" | null;
    className?: string;
};

export function IconTooltipButton({
    icon,
    tooltip,
    onClick,
    asChild = false,
    href,
    disabled = false,
    variant = 'outline',
    size = 'sm',
    className = '',
}: IconTooltipButtonProps) {
    const content = (
        <Button
            onClick={onClick}
            variant={variant}
            size={size}
            disabled={disabled}
            className={`size-7 ${className}`}
            asChild={asChild}
        >
            {asChild && href ? <Link href={href} prefetch={false}>{icon}</Link> : icon}
        </Button>
    );

    return (
        <Tooltip>
            <TooltipTrigger asChild>{content}</TooltipTrigger>
            <TooltipContent>
                <p>{tooltip}</p>
            </TooltipContent>
        </Tooltip>
    );
}
