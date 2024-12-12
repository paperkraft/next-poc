'use client';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GripHorizontalIcon, GripVerticalIcon } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { FormFieldOrGroup } from ".";

export function DragHandle({ field, index, subIndex }: { field: FormFieldOrGroup, index: number, subIndex: number | null }) {
  const { attributes, listeners, isDragging } = useSortable({
    id: Array.isArray(field) ? `row-${field[0]?.name}` : field.name,
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