'use client'

import { memo } from 'react';
import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormFieldType } from '@/types';
import { FormFieldOrGroup } from '.';
import { defaultFieldConfig, fieldTypes } from '@/constants';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'


interface Props {
    index: number; 
    formFields: FormFieldOrGroup[]; 
    setFormFields: React.Dispatch<React.SetStateAction<FormFieldOrGroup[]>>; 
    setColumnCount: React.Dispatch<React.SetStateAction<number>> 
}

export const RenderDropdownList = memo(({ formFields, setFormFields, setColumnCount, index }: Props) => {

    const addNewColumn = (variant: string, index: number) => {
        const newFieldName = `name_${Math.random().toString().slice(-10)}`

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
                <div>
                    <Button variant="ghost" size={'icon'} className="size-7 rounded-full hover:text-blue-500">
                        <PlusIcon className='h-4 w-4' />
                    </Button>
                </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent className='max-h-64 overflow-y-auto' align='start'>
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
});

RenderDropdownList.displayName = "RenderDropdownList";