'use client'
import React, { useEffect, useState } from 'react';
import { arrayMove, horizontalListSortingStrategy, SortableContext, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FormFieldType } from '@/types';
import { cn } from '@/lib/utils';
import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToHorizontalAxis, restrictToParentElement } from '@dnd-kit/modifiers'
import If from '@/components/ui/if';
import { DragHandle } from './DragHandle';
import { Item } from './Item';
import { NestedItemWrapper } from './NestedItemWrapper';
import { RenderDropdownList } from './RenderDropdownList';
import { getFieldId } from '../sortable-list';

export type FormFieldOrGroup = FormFieldType | FormFieldType[]

export interface ItemProps {
    index: number;
    subIndex: number | null;
    field: FormFieldType;
    formFields: FormFieldOrGroup[];
    setFormFields: React.Dispatch<React.SetStateAction<FormFieldOrGroup[]>>;
    openEditDialog: (field: FormFieldType) => void;
}

export function SortableItem({ index, field, formFields, setFormFields, openEditDialog }: ItemProps) {

    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor,{
            activationConstraint: {
                delay: 250,
                tolerance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const { setNodeRef, transform, transition, isDragging } = useSortable({
        id: getFieldId(field)
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
        <div ref={setNodeRef} style={style}
            className={cn('w-full shadow-md rounded-md ring-1 ring-gray-200 bg-background', {
                'bg-green-50 ring-green-200': isDragging
            })}
        >
            <div className={cn("max-h-12 flex items-center w-full p-2 pl-1.5")} >

                <div className={cn("max-h-10 flex items-center gap-2 p-2 pl-0 w-full")}>
                    {Array.isArray(field) ? (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={(e) => handleDragEndNested(e, index)}
                            modifiers={[restrictToHorizontalAxis, restrictToParentElement]}
                        >
                            <SortableContext items={field.map((f) => f.name)} strategy={horizontalListSortingStrategy}>
                                {field.map((subField, subIndex) => (
                                    <NestedItemWrapper
                                        key={subField.name}
                                        field={subField}
                                        index={index}
                                        subIndex={subIndex}
                                        formFields={formFields}
                                        setFormFields={setFormFields}
                                        openEditDialog={openEditDialog}
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>
                    ) : (
                        <Item
                            index={index}
                            subIndex={null}
                            field={field}
                            formFields={formFields}
                            setFormFields={setFormFields}
                            openEditDialog={openEditDialog}
                        />
                    )}
                </div>

                <If
                    condition={columnCount < 3}
                    render={() => (
                        <RenderDropdownList
                            index={index}
                            formFields={formFields}
                            setFormFields={setFormFields}
                            setColumnCount={setColumnCount}
                        />
                    )}
                />

                <DragHandle field={field} subIndex={null} />
                
            </div>
        </div>
    );
}