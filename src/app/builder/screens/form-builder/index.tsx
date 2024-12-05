'use client'

import React, { useCallback, useState } from 'react'

import { Separator } from '@/components/ui/separator'
import If from '@/components/ui/if'
import { useMediaQuery } from '@/hooks/use-media-query'
import { FormFieldType } from '@/types'
import { EditFieldDialog } from '../edit-field-dialog'
import { FieldSelector } from '../field-selector'
import { FormFieldList } from '../form-field-list'
import { FormPreview } from '../form-preview'
import { defaultFieldConfig } from '@/constants'
import { FileBox } from 'lucide-react'

export type FormFieldOrGroup = FormFieldType | FormFieldType[]

export default function FormBuilder() {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const [formFields, setFormFields] = useState<FormFieldOrGroup[]>([])
  const [selectedField, setSelectedField] = useState<FormFieldType | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const addFormField = (variant: string, index: number) => {
    const newFieldName = `name_${Math.random().toString().slice(-10)}`

    const { label, description, placeholder } = defaultFieldConfig[variant] || {
      label: '',
      description: '',
      placeholder: '',
    }

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

    setFormFields([...formFields, newField])
  }

  const findFieldPath = (fields: FormFieldOrGroup[], name: string): number[] | null => {
    const search = (currentFields: FormFieldOrGroup[], currentPath: number[]): number[] | null => {
      for (let i = 0; i < currentFields.length; i++) {
        const field = currentFields[i]
        if (Array.isArray(field)) {
          const result = search(field, [...currentPath, i])
          if (result) return result
        } else if (field.name === name) {
          return [...currentPath, i]
        }
      }
      return null
    }
    return search(fields, [])
  }

  const updateFormField = (path: number[], updates: Partial<FormFieldType>) => {
    const updatedFields = JSON.parse(JSON.stringify(formFields))
    let current: any = updatedFields
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]]
    }
    current[path[path.length - 1]] = {
      ...current[path[path.length - 1]],
      ...updates,
    }
    setFormFields(updatedFields)
  }

  const openEditDialog = (field: FormFieldType) => {
    setSelectedField(field)
    setIsDialogOpen(true)
  }

  const handleSaveField = (updatedField: FormFieldType) => {
    if (selectedField) {
      const path = findFieldPath(formFields, selectedField.name)
      if (path) {
        updateFormField(path, updatedField)
      }
    }
    setIsDialogOpen(false)
  }

  const FieldSelectorWithSeparator = ({ addFormField }: { addFormField: (variant: string, index?: number) => void }) => (
    <div className="flex flex-col md:flex-row gap-3">
      <FieldSelector addFormField={addFormField} />
      <Separator orientation={isDesktop ? 'vertical' : 'horizontal'} />
    </div>
  )

  const RenderFormFieldList = useCallback(() => (
    <FormFieldList formFields={formFields}
    setFormFields={setFormFields}
    updateFormField={updateFormField}
    openEditDialog={openEditDialog} />
  ),[formFields])

  return (
    <section className="md:max-h-screen space-y-4 my-4">

      <div>
        <h1 className='text-lg font-semibold'>Form Builder</h1>
        <p className='text-sm'>Click on element from the list to add</p>
      </div>

      <If
        condition={formFields.length > 0}
        render={() => (
          <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-8 h-full">
            <div className="w-full col-span-2 h-full auto-cols-max md:space-x-3 md:max-h-[75vh] flex flex-col md:flex-row ">
              <FieldSelectorWithSeparator
                addFormField={(variant: string, index: number = 0) =>
                  addFormField(variant, index)
                }
              />

              <div className="flex-1">
                Components:
                  <RenderFormFieldList/> 
              </div>
            </div>

            <div className="w-full h-full space-y-3 ">
              <FormPreview formFields={formFields} />
            </div>
          </div>
        )}

        otherwise={() => (
          <div className="flex flex-col md:flex-row items-center gap-3 md:px-5">
            <FieldSelectorWithSeparator
              addFormField={(variant: string, index: number = 0) =>
                addFormField(variant, index)
              }
            />
            <div className="mx-auto flex flex-col gap-2 items-center">
              <FileBox />
              <p>Build form</p>
            </div>
          </div>
        )}
      />

      <EditFieldDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        field={selectedField}
        onSave={handleSaveField}
      />
    </section>
  )
}