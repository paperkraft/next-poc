'use client';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GripHorizontalIcon, GripVerticalIcon } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { FormFieldOrGroup } from ".";
import { getFieldId } from "../sortable-list";

export function DragHandle({ field, subIndex }: { field: FormFieldOrGroup, subIndex: number | null }) {
    const { attributes, listeners, isDragging } = useSortable({
        id: getFieldId(field)
    });

    return (
        <div className={cn({ 'ml-1': subIndex !== null })}>
            <Button {...listeners} {...attributes} variant={'ghost'} size="icon"
                className={cn('cursor-grab size-7 text-muted-foreground', { 'text-green-500 hover:text-green-500': isDragging })}
            >
                {subIndex !== null
                    ? <GripVerticalIcon className="w-4 h-4" />
                    : <GripHorizontalIcon className="w-4 h-4" />
                }
            </Button>
        </div>
    );
}