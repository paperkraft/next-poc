'use client';
import { cn } from "@/lib/utils";
export default function Divider({text, className}:{text:string, className?:string}) {
    return (
        <div className={cn(`${className} relative`)}>
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