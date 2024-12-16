'use client'
import React, { useState } from 'react'
import { Separator } from '@/components/ui/separator'
import If from '@/components/ui/if'
import { useMediaQuery } from '@/hooks/use-media-query'
import { FormFieldType } from '@/types'
import { EditFieldDialog } from './components/edit-dialog'
import { FieldSelector } from './components/sidebar-list'
import { FormPreview } from './components/preview-json-code'
import { defaultFieldConfig } from '@/constants'
import { FileBox } from 'lucide-react'
import TitlePage from '@/components/custom/page-heading'
import SortableList from './components/sortable-list'

export type FormFieldOrGroup = FormFieldType | FormFieldType[]

const FormBuilder = () => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const [formFields, setFormFields] = useState<FormFieldOrGroup[]>([])
  const [selectedField, setSelectedField] = useState<FormFieldType | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const addFormField = (variant: string, index: number = 0) => {
    const newFieldName = `name_${Math.random().toString().slice(-10)}`

    const { label, description, placeholder, defaultValue } = defaultFieldConfig[variant] || {}

    const checked = (variant === "Switch" || variant === "Checkbox") ? false : undefined

    const newField: FormFieldType = {
      variant,

      label: label || newFieldName,
      description: description || '',
      placeholder: placeholder || 'Placeholder',
      defaultValue: checked ?? defaultValue ?? '',

      checked,
      name: newFieldName,
      required: true,


      setValue: () => { },
      onChange: () => { },
      onSelect: () => { },
    }

    setFormFields([...formFields, newField]);
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

  const renderFormFields = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 items-start md:gap-8">
      <div className="w-full col-span-2 flex flex-col md:flex-row gap-3">
        <FieldSelector addFormField={addFormField} />
        <SortableList
          formFields={formFields}
          setFormFields={setFormFields}
          openEditDialog={openEditDialog}
        />
      </div>
      <div className="w-full mt-8 md:mt-0">
        <FormPreview formFields={formFields} />
      </div>
    </div>
  );

  const renderEmptyState = () => (
    <div className="flex flex-col md:flex-row items-center gap-3 md:px-5">
      <FieldSelectorWithSeparator addFormField={addFormField} />
      <div className="mx-auto flex flex-col gap-2 items-center border p-8 rounded">
        <FileBox className="size-10" />
        <p>To add</p>
        <p>Click on component from the list</p>
      </div>
    </div>
  );

  return (
    <>
      <TitlePage title="Form Builder" description="Click on component from the list to add" />

      <If condition={formFields.length > 0} render={renderFormFields} otherwise={renderEmptyState} />

      <EditFieldDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        field={selectedField}
        onSave={handleSaveField}
      />
    </>
  )
}

export default FormBuilder;