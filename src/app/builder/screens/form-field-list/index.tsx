import React, { useState, useCallback, useEffect } from 'react'
import { Reorder, AnimatePresence } from 'framer-motion'
import { LucideRows } from 'lucide-react'
import { FormFieldType } from '@/types'
import { FieldItem } from '../field-item'

export type FormFieldOrGroup = FormFieldType | FormFieldType[]

type FormFieldListProps = {
  formFields: FormFieldOrGroup[]
  setFormFields: React.Dispatch<React.SetStateAction<FormFieldOrGroup[]>>
  updateFormField: (path: number[], updates: Partial<FormFieldType>) => void
  openEditDialog: (field: FormFieldType) => void
}

export const FormFieldList = React.memo(({
  formFields,
  setFormFields,
  updateFormField,
  openEditDialog,
}:FormFieldListProps) => {
  const [rowTabs, setRowTabs] = useState<{ [key: number]: FormFieldType[] }>({})

  const handleHorizontalReorder = useCallback(
    (index: number, newOrder: FormFieldType[]) => {
      // Ensure the row is reordered correctly
      setRowTabs((prev) => ({ ...prev, [index]: newOrder }));
  
      // Delay state update by 1 second to ensure proper updates post-reordering
      setTimeout(() => {
        setFormFields((prevFields) => {
          const updatedFields = [...prevFields];
          updatedFields[index] = newOrder;  // Replace with the new order
          return updatedFields;
        });
      }, 1000);
    },
    []
  );

  return (
    <div className="mt-3 lg:mt-0">

      <Reorder.Group
        axis="y"
        onReorder={setFormFields}
        values={formFields}
        className="flex flex-col gap-1 xxxx"
      >
        {formFields.map((item, index) => (
          <Reorder.Item
            key={Array.isArray(item) ? item.map((f) => f.name).join('-') : item.name}
            value={item}
            className="flex items-center gap-1"
            whileDrag={{ backgroundColor: '#e5e7eb', borderRadius: '12px' }}
          >
            <LucideRows className="cursor-grab w-4 h-4" />

            {Array.isArray(item) ? (
              <Reorder.Group as='ul' axis="x" onReorder={(newOrder) => handleHorizontalReorder(index, newOrder)} values={rowTabs[index] || item} 
              className="w-full grid grid-cols-12 gap-1">

                <AnimatePresence initial={false}>
                  {(rowTabs[index] || item).map((field, fieldIndex) => (
                      <FieldItem
                        key={field.name}
                        index={index}
                        subIndex={fieldIndex}
                        field={field}
                        formFields={formFields}
                        setFormFields={setFormFields}
                        updateFormField={updateFormField}
                        openEditDialog={openEditDialog}
                      />
                  ))}
                </AnimatePresence>
              </Reorder.Group>
            ) : (
              <FieldItem
                field={item}
                index={index}
                formFields={formFields}
                setFormFields={setFormFields}
                updateFormField={updateFormField}
                openEditDialog={openEditDialog}
              />
            )}
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  )
});

FormFieldList.displayName = 'FormFieldList'