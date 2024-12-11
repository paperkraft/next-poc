'use client'
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { arrayMove, defaultAnimateLayoutChanges, horizontalListSortingStrategy, SortableContext, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FormFieldType } from '@/types';
import { FormFieldOrGroup } from '../form-builder';
import { cn } from '@/lib/utils';
import { Remove } from './Remove';
import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { GripHorizontalIcon, GripVerticalIcon } from 'lucide-react';


interface Props {
    index: number
    subIndex?: number
    field: FormFieldType
    formFields: FormFieldOrGroup[]
    setFormFields: React.Dispatch<React.SetStateAction<FormFieldOrGroup[]>>
    onRemove: (id: number| string) => void;
}

 

export function SortableItem({ index, field, formFields, setFormFields, onRemove }: Props) {

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: Array.isArray(field) ? `row-${index}` : field.name,
        animateLayoutChanges: defaultAnimateLayoutChanges
    });


    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    const [columnCount, setColumnCount] = useState(() =>
        Array.isArray(formFields[index]) ? formFields[index].length : 1,
    )

    useEffect(() => {
        const newColumnCount = Array.isArray(formFields[index])
            ? formFields[index].length
            : 1
        setColumnCount(newColumnCount)
    }, [formFields, index]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEndNested = (event: DragEndEvent, index: number) => {
        const { active, over } = event;
        const group = formFields[index];

        if (Array.isArray(group)) {
            const oldIndex = group.findIndex((field) => field.name === active.id);
            const newIndex = group.findIndex((field) => field.name === over?.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                setFormFields((prevFields) => {
                    const updatedFields = [...prevFields];
                    const updatedRow = arrayMove(group, oldIndex, newIndex);
                    updatedFields[index] = updatedRow;
                    return updatedFields;
                });
            }
        }
    };

    return (
        <>
            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}

                className={cn('w-full', {
                    'col-span-12': columnCount === 1,
                    'col-span-6': columnCount === 2,
                    'col-span-4': columnCount === 3,
                })}
            >
                <div className="max-h-10 flex items-center gap-2 w-full " >
                    <GripHorizontalIcon className="cursor-grab w-4 h-4" />
                    
                    <div className="flex items-center gap-1 border rounded-md px-2 py-1 w-full">
                        {Array.isArray(field) ? (
                            <>
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={(e) => handleDragEndNested(e, index)}

                                >
                                    <SortableContext
                                        items={field.map((f) => f.name)}
                                        strategy={horizontalListSortingStrategy}
                                    >
                                        {field.map((subField) => (
                                            <SortableItemWrapper
                                                key={subField.name}
                                                field={subField}
                                            />
                                        ))}
                                    </SortableContext>
                                </DndContext>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center w-full">
                                    <div className="w-full text-sm">{field.variant}</div>
                                    <Remove onClick={()=> onRemove(field.name)}/>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}


// Wrapper for the group that is sortable
export const SortableItemWrapper = ({ field }: { field: FormFieldType }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: field.name
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="max-h-10 flex items-center gap-2 w-full p-2 border"
        >
            <GripVerticalIcon className="cursor-grab w-4 h-4" />
            
            <div className="flex items-center w-full">
                <div className="w-full text-sm">{field.variant}</div>
                <Remove onClick={()=>alert(field.name)}/>
            </div>

        </div>
    );
};
