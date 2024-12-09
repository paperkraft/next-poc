import React, { useState, useCallback } from 'react'
import { Reorder, AnimatePresence } from 'framer-motion'
import { GripHorizontalIcon } from 'lucide-react'
import { FormFieldType } from '@/types'
import { FieldItem } from '../field-item'
import { Button } from '@/components/ui/button'

export type FormFieldOrGroup = FormFieldType | FormFieldType[]

type FormFieldListProps = {
  formFields: FormFieldOrGroup[]
  setFormFields: React.Dispatch<React.SetStateAction<FormFieldOrGroup[]>>
  openEditDialog: (field: FormFieldType) => void
}

export const FormFieldList =  React.memo(({ formFields, setFormFields, openEditDialog }: FormFieldListProps) => {
  const [rowTabs, setRowTabs] = useState<{ [key: number]: FormFieldType[] }>({});

  const handleHorizontalReorder = useCallback((index: number, newOrder: FormFieldType[]) => {
    // Ensure the row is reordered correctly
    // setRowTabs((prev) => ({ ...prev, [index]: newOrder }));
    setRowTabs((prev) => {
      const updatedTabs = { ...prev };
      updatedTabs[index] = newOrder;
      return updatedTabs;
    });

    // Delay state update to ensure proper updates post-reordering
    setTimeout(() => {
      setFormFields((prevFields) => {
        const updatedFields = [...prevFields];
        updatedFields[index] = newOrder;
        return updatedFields
      });
    }, 500);
  }, [setFormFields, setRowTabs]);


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
  
    // Update rowTabs 
    setRowTabs((prev) => {
      const updatedTabs = { ...prev };
  
      if (Array.isArray(updatedTabs[index])) {
        if (fieldIndex === null) {
          updatedTabs[index] = updatedTabs[index].slice(1);
        } else {
          updatedTabs[index] = updatedTabs[index].filter((_, idx) => idx !== fieldIndex);
        }
  
        if (updatedTabs[index]?.length === 0) {
          delete updatedTabs[index];
        } 
      }
      return updatedTabs;
    });
  }, [setFormFields, setRowTabs]);
  
  
  return (
    <div className="">
      <Reorder.Group
        axis="y"
        onReorder={setFormFields}
        values={formFields}
        className="flex flex-col gap-1"
      >
        {formFields.map((item, index) => (
          <Reorder.Item
            key={Array.isArray(item) ? item.map((f) => f.name).join('-') : item.name}
            value={item}
            className="flex items-center gap-1 p-2"
            whileDrag={{ backgroundColor: '#f0f9ff', borderRadius: '8px' }}
          >
            <Button variant="outline" size="icon" className="size-8 hover:text-blue-400 mr-2">
              <GripHorizontalIcon className="cursor-grab w-4 h-4" />
            </Button>

            {Array.isArray(item) ? (
              <Reorder.Group
                as='ul'
                axis="x"
                onReorder={(newOrder) => handleHorizontalReorder(index, newOrder)}
                values={rowTabs[index] || item}
                className="w-full grid grid-cols-12 gap-1"
              >
                <AnimatePresence initial={false}>
                  {(rowTabs[index] || item).map((field, fieldIndex) => (
                  
                    <FieldItem
                      key={field.name}
                      index={index}
                      subIndex={fieldIndex}
                      field={field}
                      formFields={formFields}
                      setFormFields={setFormFields}
                      openEditDialog={openEditDialog}
                      onRemoveField={handleRemoveField} 
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
                openEditDialog={openEditDialog}
                onRemoveField={handleRemoveField} 
              />
            )}
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  )
})

FormFieldList.displayName = "FormFieldList";