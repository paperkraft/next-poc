'use client'
import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { arrayMove, defaultAnimateLayoutChanges, horizontalListSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FormFieldType } from '@/types';
import { FormFieldOrGroup } from '../form-builder';
import { cn } from '@/lib/utils';
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import { GripHorizontalIcon, GripVerticalIcon, LucideTrash2, PlusIcon } from 'lucide-react';
import { restrictToHorizontalAxis, restrictToParentElement } from '@dnd-kit/modifiers'
import { Button } from '@/components/ui/button';
import If from '@/components/ui/if';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { defaultFieldConfig, fieldTypes } from '@/constants';

interface Props {
    index: number;
    subIndex?: number;
    field: FormFieldType;
    formFields: FormFieldOrGroup[];
    setFormFields: React.Dispatch<React.SetStateAction<FormFieldOrGroup[]>>;
}
interface ItemProps {
    index: number;
    subIndex: number | null;
    field: FormFieldType;
    formFields: FormFieldOrGroup[];
    setFormFields: React.Dispatch<React.SetStateAction<FormFieldOrGroup[]>>;
    handleRemoveField: (index: number, subIndex: number | null) => void;
}

export function SortableItem({ index, field, formFields, setFormFields }: Props) {

    const addNewColumn = (variant: string, index: number) => {
        const newFieldName = `name_${Math.random().toString().slice(-10)}`

        // Check for duplicates
        const existingFields = Array.isArray(formFields[index])
            ? (formFields[index] as FormFieldType[]).map((field) => field.name)
            : [formFields[index]?.name]

        // Check if the new field name already exists
        if (existingFields.includes(newFieldName)) return

        const { label, description, placeholder } = defaultFieldConfig[variant] || {}

        const newField: FormFieldType = {
            checked: true,
            description: description || '',
            disabled: false,
            label: label || newFieldName,
            name: newFieldName,
            onChange: () => { },
            onSelect: () => { },
            placeholder: placeholder || 'Placeholder',
            required: true,
            rowIndex: index,
            setValue: () => { },
            type: '',
            value: '',
            variant,
        }

        setFormFields((prevFields) => {
            const newFields = JSON.parse(JSON.stringify(prevFields));

            if (Array.isArray(newFields[index])) {
                const currentFieldNames = (newFields[index] as FormFieldType[]).map(
                    (field) => field.name,
                )
                if (!currentFieldNames.includes(newFieldName)) {
                    (newFields[index] as FormFieldType[]).push(newField)
                }
            } else if (newFields[index]) {
                newFields[index] = [newFields[index] as FormFieldType, newField]
            } else {
                newFields[index] = newField
            }
            return newFields
        });
    }

    const handleRemoveField = useCallback((index: number, fieldIndex: number | null) => {
        setFormFields((prevFields) => {
            const updatedFields = [...prevFields];

            if (Array.isArray(updatedFields[index])) {
                if (fieldIndex === null) {
                    updatedFields[index] = updatedFields[index].slice(1);
                } else {
                    updatedFields[index] = updatedFields[index].filter((_, idx) => idx !== fieldIndex);
                }

                if (updatedFields[index]?.length === 0) {
                    updatedFields.splice(index, 1);
                }
                if (updatedFields[index]?.length === 1) {
                    updatedFields[index] = updatedFields[index][0];
                }
            } else {
                updatedFields.splice(index, 1);
            }
            return updatedFields;
        });
    }, [setFormFields]);

    const { setNodeRef, transform, transition, isDragging } = useSortable({
        id: Array.isArray(field) ? `row-${index}` : field.name,
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
        <div
            ref={setNodeRef}
            style={style}

            className={cn('w-full', {
                'col-span-12': columnCount === 1,
                'col-span-6': columnCount === 2,
                'col-span-4': columnCount === 3,
            })}
        >
            <div className={cn("max-h-10 flex items-center gap-2 w-full", { 'bg-green-50': isDragging })} >
                <Draggable field={field} index={index} subIndex={null} />

                <div className="flex items-center gap-1 border rounded-md px-2 py-1 w-full">
                    {Array.isArray(field) ? (
                        <>
                            <DndContext
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
                                            handleRemoveField={handleRemoveField}
                                        />
                                    ))}
                                </SortableContext>
                            </DndContext>
                        </>
                    ) : (
                        <Item
                            key={field.name}
                            index={index}
                            subIndex={null}
                            field={field}
                            formFields={formFields}
                            setFormFields={setFormFields}
                            handleRemoveField={handleRemoveField}
                        />
                    )}
                </div>

                <If
                    condition={columnCount < 3}
                    render={() => (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon" className="min-w-9 w-9 h-9 rounded-full hover:text-blue-400">
                                    <PlusIcon />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className='max-h-64 overflow-y-auto' align='end'>
                                <DropdownMenuLabel>Select Component</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {fieldTypes.map((fieldType) => (
                                    <DropdownMenuItem
                                        key={fieldType.name}
                                        onClick={() => {
                                            addNewColumn(fieldType.name, index)
                                            setColumnCount((prev) => prev + 1)
                                        }}
                                    >
                                        {fieldType.name}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                />
            </div>
        </div>
    );
}

// Nested Items 
export const NestedItemWrapper = ({ formFields, field, index, subIndex, setFormFields, handleRemoveField }: ItemProps) => {
    const { setNodeRef, transform, transition, isDragging } = useSortable({
        id: field.name
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn("max-h-10 flex items-center gap-2 w-full p-2 border", { 'bg-blue-50': isDragging })}
        >
            <Draggable field={field} index={index} subIndex={subIndex} />

            <Item
                field={field}
                index={index}
                subIndex={subIndex}
                formFields={formFields}
                setFormFields={setFormFields}
                handleRemoveField={handleRemoveField}
            />
        </div>
    );
};

const Item = ({ field, index, subIndex, handleRemoveField }: ItemProps) => {
    return (
        <div className="flex items-center w-full">
            <div className="w-full text-sm">{field.variant}</div>
            <Button variant="ghost" size="icon" 
                className='hover:text-red-500 size-7'
                onClick={() => handleRemoveField(index, subIndex)}
            >
                <LucideTrash2 />
            </Button>
        </div>
    )
}

export function Draggable({ field, index, subIndex }: { field: FormFieldType | FormFieldOrGroup[], index: number, subIndex: number | null }) {
    const { attributes, listeners } = useSortable({
        id: Array.isArray(field) ? `row-${index}` : field.name,
    });

    return (
        <Button {...listeners} {...attributes} variant={'outline'} size="icon" className='size-7'>
            {subIndex !== null
                ? <GripVerticalIcon className="cursor-grab w-4 h-4" />
                : <GripHorizontalIcon className="cursor-grab w-4 h-4" />
            }
        </Button>
    );
}