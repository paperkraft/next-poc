import { memo, useEffect, useState } from 'react'
import { motion, Reorder, useDragControls } from 'framer-motion'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import If from '@/components/ui/if'
import { FormFieldType } from '@/types'
import { GripVerticalIcon, LucideColumns, LucidePencil, LucideTrash2, PlusIcon } from 'lucide-react'
import { defaultFieldConfig, fieldTypes } from '@/constants'

export type FormFieldOrGroup = FormFieldType | FormFieldType[]

interface Props {
  index: number
  subIndex?: number
  field: FormFieldType
  formFields: FormFieldOrGroup[]
  setFormFields: React.Dispatch<React.SetStateAction<FormFieldOrGroup[]>>
  openEditDialog: (field: FormFieldType) => void
  onRemoveField: (index:number, subIndex:number | null) => void
}

export const FieldItem = memo(({
  index,
  subIndex,
  field,
  formFields,
  setFormFields,
  openEditDialog,
  onRemoveField,
}: Props) => {

  const controls = useDragControls();
  const showColumnButton = 
    subIndex === undefined || 
    subIndex === (formFields[index] as FormFieldType[]).length - 1

  const [columnCount, setColumnCount] = useState(() =>
    Array.isArray(formFields[index]) ? formFields[index].length : 1,
  )

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

  useEffect(() => {
    const newColumnCount = Array.isArray(formFields[index])
      ? formFields[index].length
      : 1
    setColumnCount(newColumnCount)
  }, [formFields, index]);

  return (
    <Reorder.Item
      as='div'
      value={field}
      id={field.name}
      key={`${field.name}-${columnCount}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.15 },
      }}
      exit={{ opacity: 0, y: 20, transition: { duration: 0.5 } }}
      whileDrag={{ backgroundColor: '#dcfce7', borderRadius: '8px' }}
      className={cn('w-full', {
        'col-span-12': columnCount === 1,
        'col-span-6': columnCount === 2,
        'col-span-4': columnCount === 3,
      })}

      dragListener={false}
      dragControls={controls}
    >


      <motion.div layout="position" className="max-h-10 flex items-center gap-2 w-full" key={`${field.name}-${columnCount}`}>
        <div className="flex items-center gap-1 border rounded-md px-2 py-1 w-full">
          <If 
            condition={Array.isArray(formFields[index])}
            render={() => (
              <Button variant="outline" size="icon" onPointerDown={(e) => controls.start(e)}
                className="size-7 hover:text-blue-400">
                <GripVerticalIcon className="cursor-grab w-4 h-4"  />
              </Button>
            )}
          />

          <div className="flex items-center w-full">
            <div className="w-full text-sm">{field.variant}</div>

            <Button variant="ghost" size="icon" className='hover:text-green-500' onClick={() => openEditDialog(field)}>
              <LucidePencil />
            </Button>

            <Button variant="ghost" size="icon" className='hover:text-red-500' onClick={()=> onRemoveField(index, subIndex ?? null)}>
              <LucideTrash2 />
            </Button>
          </div>
        </div>

        {/* Add button */}

        <If
          condition={showColumnButton && columnCount < 3}
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
      </motion.div>
    </Reorder.Item>
  )
});

FieldItem.displayName = 'FieldItem'