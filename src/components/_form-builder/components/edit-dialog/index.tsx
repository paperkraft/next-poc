'use client'
import React, { useEffect, memo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import If from '@/components/ui/if'
import { FormFieldType } from '@/types'
import { Form } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { InputController } from '@/components/_form-controls/InputController'
import { SelectController } from '@/components/_form-controls/SelectController'
import { SwitchButton } from '@/components/_form-controls/SwitchButton'

type EditFieldDialogProps = {
  isOpen: boolean
  onClose: () => void
  field: FormFieldType | null
  onSave: (updatedField: FormFieldType) => void
}

const options = [
  { label: "Text", value: "text" },
  { label: "Email", value: "email" },
  { label: "Number", value: "number" },
]

export const EditFieldDialog = memo(({ isOpen, onClose, field, onSave }: EditFieldDialogProps) => {

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
    if (field) {
      Object.entries(field).map(([key, val]: any) => {
        return form.setValue(key, val)
      })
    }
  }, [field]);

  const onSubmit = (data: any) => {

    const final = {
      ...data,
      type: data.type ? data.type : undefined,
      min: data.min ? +data.min : undefined,
      max: data.max ? +data.max : undefined,
      step: data.step ? +data.step : undefined,
      disabled: data.disabled ? data.disabled : undefined,
      readOnly: data.readOnly ? data.readOnly : undefined,
    }

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

            <InputController name='label' label='Label' type='text' />
            <InputController name='description' label='Description' type='text' />
            <InputController name='placeholder' label='Placeholder' type='text' />
            <InputController name='name' label='Name' type='text' />

            <If condition={field?.variant === 'Input'}
              render={() => (<SelectController name='type' label='Type' options={options} />)}
            />

            <If condition={form.watch('type') === 'number' || form.watch('type') === 'text'}
              render={() => (
                <div className='grid grid-cols-2 gap-4'>
                  <InputController name='min' label='Min' type='number' />
                  <InputController name='max' label='Max' type='number' />
                </div>
              )}
            />

            <If condition={field?.variant === 'Slider'}
              render={() => (
                <div className='grid grid-cols-3 gap-4'>
                  <InputController name='min' label='Min' type='number' />
                  <InputController name='max' label='Max' type='number' />
                  <InputController name='step' label='Step' type='number' />
                </div>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <SwitchButton name='required' label='Required' />
              <SwitchButton name='disabled' label='Disabled' />
              <SwitchButton name='readOnly' label='Read only' />
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