'use client'
import React, { useEffect, useState } from 'react';
import { arrayMove, horizontalListSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FormFieldType } from '@/types';
import { cn } from '@/lib/utils';
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import { PlusIcon } from 'lucide-react';
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
import { DragHandle } from './DragHandle';
import { Item } from './Item';
import { NestedItemWrapper } from './NestedItemWrapper';

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

    const { setNodeRef, transform, transition, isDragging } = useSortable({
        id: Array.isArray(field) ? `row-${field[0]?.name}` : field.name
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
                'col-span-12': columnCount === 1,
                'col-span-6': columnCount === 2,
                'col-span-4': columnCount === 3,
                'bg-green-50 ring-green-200': isDragging
            })}
        >
            <div className={cn("max-h-12 flex items-center w-full p-2 gap-1")} >
                <DragHandle field={field} index={index} subIndex={null} />

                <div className={cn("max-h-10 flex items-center gap-2 p-2 w-full")}>
                    {Array.isArray(field) ? (
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
                                        openEditDialog={openEditDialog}
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>
                    ) : (
                        <Item
                            key={field.name}
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
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size={'icon'} className="h-7 w-8 rounded-full hover:text-blue-400">
                                    <PlusIcon className='h-4 w-4' />
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

const RenderDropdownList = ({ formFields, setFormFields, setColumnCount, index }: { index: number; formFields: FormFieldOrGroup[]; setFormFields: React.Dispatch<React.SetStateAction<FormFieldOrGroup[]>>; setColumnCount: React.Dispatch<React.SetStateAction<number>> }) => {

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


    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size={'icon'} className="h-7 w-8 rounded-full hover:text-blue-400">
                    <PlusIcon className='h-4 w-4' />
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
    )
}