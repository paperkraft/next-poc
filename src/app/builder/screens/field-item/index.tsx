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
  updateFormField: (path: number[], updates: Partial<FormFieldType>) => void
  openEditDialog: (field: FormFieldType) => void
}

export const FieldItem = memo(({
  index,
  subIndex,
  field,
  formFields,
  setFormFields,
  updateFormField,
  openEditDialog,
}: Props) => {

  const showColumnButton = subIndex === undefined || subIndex === (formFields[index] as FormFieldType[]).length - 1

  const path = subIndex !== undefined ? [index, subIndex] : [index]

  const [columnCount, setColumnCount] = useState(() =>
    Array.isArray(formFields[index]) ? formFields[index].length : 1,
  )

  const addNewColumn = (variant: string, index: number) => {
    const newFieldName = `name_${Math.random().toString().slice(-10)}`

    // Check for duplicates
    const existingFields = Array.isArray(formFields[index])
      ? (formFields[index] as FormFieldType[]).map((field) => field.name)
      : [formFields[index]?.name]

    // Check if the new field name already exists in the existing fields
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
      // const newFields = [...prevFields]
      const newFields = JSON.parse(JSON.stringify(formFields))

      if (Array.isArray(newFields[index])) {
        // If it's already an array, check for duplicates before adding
        const currentFieldNames = (newFields[index] as FormFieldType[]).map(
          (field) => field.name,
        )
        if (!currentFieldNames.includes(newFieldName)) {
          (newFields[index] as FormFieldType[]).push(newField)
        }
      } else if (newFields[index]) {
        // If it's a single field, convert it to an array with the existing field and the new one
        newFields[index] = [newFields[index] as FormFieldType, newField]
      } else {
        // If the index doesn't exist, just add the new field
        newFields[index] = newField
      }
      return newFields
    });

    console.log('added from + dropdown')
  }

  const removeColumn = () => {
    const rowIndex = path[0]
    const subIndex = path.length > 1 ? path[1] : null

    console.log('rowIndex:subIndex', rowIndex + ' : ' + subIndex);

    setFormFields((prevFields) => {
      const newFields = [...prevFields]
      
      if (Array.isArray(newFields[rowIndex])) {
        const row = [...(newFields[rowIndex] as FormFieldType[])];

        if (subIndex !== null && subIndex >= 0 && subIndex < row.length) {
          row.splice(subIndex, 1);

          if (row.length > 0) {
            newFields[rowIndex] = row
            setColumnCount(row.length)
          } else {
            newFields.splice(rowIndex, 1)
            setColumnCount(1)
          }

          // if (row.length === 1) {
          //   // Convert array with one item to an object
          //   newFields[rowIndex] = row[0];
          // } else if (row.length === 0) {
          //   // Remove empty rows
          //   newFields.splice(rowIndex, 1);
          // } else {
          //   // Update the row with the remaining columns
          //   newFields[rowIndex] = row;
          // }
        }
      } else {
        newFields.splice(rowIndex, 1);
        setColumnCount(1);
      }

      // Clean up empty rows after column removal
      return newFields.filter((field) => (Array.isArray(field) ? field.length > 0 : field !== null));
    })
  }

  useEffect(() => {
    const newColumnCount = Array.isArray(formFields[index])
      ? formFields[index].length
      : 1
    setColumnCount(newColumnCount)
  }, [formFields, index]);


  const controls = useDragControls()

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
      whileDrag={{ backgroundColor: '#9ca3af', borderRadius: '12px' }}
      className={cn('w-full', {
        'col-span-12': columnCount === 1,
        'col-span-6': columnCount === 2,
        'col-span-4': columnCount === 3,
      })}

      dragListener={false}
      dragControls={controls}
    >


      <motion.div layout="position" className="flex items-center gap-3 w-full"
        key={`${field.name}-${columnCount}`}
      >
        <div className="flex items-center gap-1 border rounded-xl px-3 py-1.5 w-full">
          <If
            condition={Array.isArray(formFields[index])}
            render={() => <GripVerticalIcon className="cursor-grab w-4 h-4" onPointerDown={(e) => controls.start(e)} />}
          />

          <div className="flex items-center w-full">
            <div className="w-full text-sm">{field.variant}</div>

            <Button variant="ghost" size="icon" onClick={() => openEditDialog(field)}>
              <LucidePencil />
            </Button>

            <Button variant="ghost" size="icon" onClick={removeColumn}>
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
                <Button variant="outline" size="icon" className="min-w-9 w-9 h-9 rounded-full">
                  <PlusIcon />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className='max-h-64 overflow-y-auto'>
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