import { useSortable } from "@dnd-kit/sortable";
import { ItemProps } from "./sortableItem";
import { CSS } from '@dnd-kit/utilities';
import { cn } from "@/lib/utils";
import { DragHandle } from "./DragHandle";
import { Item } from "./Item";
import { useMemo } from "react";

export const NestedItemWrapper = ({ formFields, field, index, subIndex, setFormFields, openEditDialog }: ItemProps) => {
    const { setNodeRef, transform, transition, isDragging } = useSortable({
        id: field.name
    });

    const style = useMemo(() => ({
        transition,
        transform: CSS.Transform.toString(transform),
    }), [transform, transition]);

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn("max-h-9 flex items-center w-full border bg-background rounded-sm", 
                { 'bg-blue-50 border-blue-200': isDragging }
            )}
        >
            <DragHandle field={field} subIndex={subIndex} />
            
            <Item
                field={field}
                index={index}
                subIndex={subIndex}
                formFields={formFields}
                setFormFields={setFormFields}
                openEditDialog={openEditDialog}
            />
        </div>
    );
};