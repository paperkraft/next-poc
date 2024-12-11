import React, { forwardRef, useCallback, useState } from 'react';
import { closestCenter, DndContext, DragEndEvent, DragOverlay, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, horizontalListSortingStrategy, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { FormFieldType } from '@/types';
import { Button } from '@/components/ui/button';
import { GripHorizontalIcon } from 'lucide-react';
import { Handle } from '../field-item/Handle';
import { cn } from '@/lib/utils';
import { SortableItem } from '../field-item/sortableItem';

export type FormFieldOrGroup = FormFieldType | FormFieldType[]

type FormFieldListProps = {
    formFields: FormFieldOrGroup[]
    setFormFields: React.Dispatch<React.SetStateAction<FormFieldOrGroup[]>>
    openEditDialog: (field: FormFieldType) => void
}

export default function SortableList({ formFields, setFormFields }: FormFieldListProps) {

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        const activeId = String(active.id);
        const overId = over ? String(over.id) : "";

        if (over && activeId !== overId) {
            const oldIndex = formFields.findIndex(field => (Array.isArray(field) ? `row-${formFields.indexOf(field)}` === activeId : field.name === activeId));
            const newIndex = formFields.findIndex(field => (Array.isArray(field) ? `row-${formFields.indexOf(field)}` === overId : field.name === overId));

            if (oldIndex !== -1 && newIndex !== -1) {
                setFormFields((prev) => arrayMove(prev, oldIndex, newIndex));
            }
        }
    }

    const handleRemove = (id:string|number) => {
        alert(id)
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={formFields.map((field, index) => Array.isArray(field) ? `row-${index}` : field.name)}
                strategy={verticalListSortingStrategy}

            >
                {formFields.map((field, index) => (
                    <div className="flex items-center gap-1 p-2"
                        key={Array.isArray(field) ? `row-${index}` : field.name}
                        id={Array.isArray(field) ? `row-${index}` : field.name}
                    >
                        <SortableItem
                            key={Array.isArray(field) ? `row-${index}` : field.name}
                            field={field as any}
                            index={index}
                            formFields={formFields}
                            setFormFields={setFormFields}
                            onRemove={handleRemove}
                        />
                        
                    </div>
                ))}
            </SortableContext>
        </DndContext>
    );
}