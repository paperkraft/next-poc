import React, { useState, useEffect, useCallback, memo } from 'react'
import * as Locales from 'date-fns/locale'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import If from '@/components/ui/if'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { FormFieldType } from '@/types'
import { Form } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { InputController } from '@/components/custom/form.control/InputController'
import { SelectController } from '@/components/custom/form.control/SelectController'
import { SwitchButton } from '@/components/custom/form.control/SwitchButton'

type EditFieldDialogProps = {
  isOpen: boolean
  onClose: () => void
  field: FormFieldType | null
  onSave: (updatedField: FormFieldType) => void
}

const options = [
  {label:"Text", value:"text"},
  {label:"Email", value:"email"},
  {label:"Number", value:"number"},
]

export const EditFieldDialog = memo(({isOpen, onClose, field, onSave }: EditFieldDialogProps) => {
  
  const form = useForm({
    defaultValues: {
      label: "",
      description: "",
      placeholder: "",
      name: "",

      type: "",
      min: "",
      max: "",
      step: "",

      required: true,
      disabled: false,
      readOnly: false,
    }
  });

  useEffect(() => {
    if(field){
      console.log(JSON.stringify(field, null, 2))
      Object.entries(field).map(([key, val]:any)=>{
        return form.setValue(key, val)
      })
    }
  }, [field]);

  const onSubmit = (data:any) => {

    const final = {
      ...data,
      type: data.type ? data.type : undefined,
      min: data.min ? +data.min : undefined,
      max: data.max ? +data.max : undefined,
      step: data.step ? +data.step : undefined,
    }

    console.log(JSON.stringify(final, null, 2));

    onSave(final);
    form.reset();
    onClose()
  }

 
  if (!field) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit {field.variant} Field</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <InputController name='label' label='Label' type='text'/>
              <InputController name='description' label='Description' type='text'/>
              <InputController name='placeholder' label='Placeholder' type='text'/>
              <InputController name='name' label='Name' type='text'/>
            </div>

            {field?.variant === 'Input' && (
              <SelectController name='type' label='Type' options={options}/>
            )}

            <If condition={form.watch('type') === 'number' || form.watch('type') === 'text'}
              render={()=>(
                <div className='grid grid-cols-2 gap-4'>
                  <InputController name='min' label='Min' type='number'/>
                  <InputController name='max' label='Max' type='number'/>
                </div>
              )}
            />

            <If condition={field?.variant === 'Slider'}
              render={()=>(
                <div className='grid grid-cols-3 gap-4'>
                  <InputController name='min' label='Min' type='number'/>
                  <InputController name='max' label='Max' type='number'/>
                  <InputController name='step' label='Step' type='number'/>
                </div>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <SwitchButton name='required' label='Required'/>
              <SwitchButton name='disabled' label='Disabled'/>
              <SwitchButton name='readOnly' label='Read only'/>
            </div>

            <div className='flex justify-end'>
              <Button type='submit'>Save Changes</Button>
            </div>

          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
})

EditFieldDialog.displayName = "EditFieldDialog";