import React from 'react'

import { Button } from '@/components/ui/button'
import { fieldTypes } from '@/constants'
import { Badge } from '@/components/ui/badge'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { FieldType } from '@/types'

type FieldSelectorProps = {
  addFormField: (variant: string, index?: number) => void
}

export const FieldSelector: React.FC<FieldSelectorProps> = ({ addFormField }) => {

  return (
    <ScrollArea className="md:h-[70vh] md:min-w-max">
      <div className="flex md:flex-col items-start flex-wrap md:flex-nowrap gap-3 border p-4 rounded-md">
        {fieldTypes.map((variant) => (
          <div className="flex items-center gap-1" key={variant.name}>
            <FieldButton key={variant.name} variant={variant} addFormField={addFormField} />
          </div>
        ))}

      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  )
}

const FieldButton = ({ variant, addFormField }: { variant: FieldType, addFormField: (variant: string, index?: number) => void }) => {
  return (
    <>
      <Button className="rounded-full" variant="outline" size="sm" onClick={() => addFormField(variant.name, variant.index)}>
        {variant.name}
        {variant.isNew && (
          <Badge variant="new" className="md:hidden ml-1 p-1 text-[10px]">New</Badge>
        )}
      </Button>
        {variant.isNew && (
          <Badge variant="new" className="hidden md:block ml-1 p-1 text-[10px]">New</Badge>
        )}
    </>
  );
};