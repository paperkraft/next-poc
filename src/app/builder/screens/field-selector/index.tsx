import React from 'react'

import { Button } from '@/components/ui/button'
import If from '@/components/ui/if'
import { fieldTypes } from '@/constants'
import { Badge } from '@/components/ui/badge'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

type FieldSelectorProps = {
  addFormField: (variant: string, index?: number) => void
}

export const FieldSelector: React.FC<FieldSelectorProps> = ({ addFormField }) => {
  return (
    <ScrollArea className="h-[70vh]">
      <div className="flex md:flex-col items-start flex-wrap md:flex-nowrap gap-3 border p-4 rounded-md">
        {fieldTypes.map((variant) => (
          <div className="flex items-center gap-1" key={variant.name}>
            <Button
              key={variant.name}
              variant="outline"
              onClick={() => addFormField(variant.name, variant.index)}
              className="rounded-full"
              size="sm"
            >
              {variant.name}
              <If
                condition={variant.isNew}
                render={() => (
                  <Badge variant={'new'} className='md:hidden ml-1 p-1 text-[10px]'>
                    New
                  </Badge>
                )}
              />
            </Button>

            <If
              condition={variant.isNew}
              render={() => (
                <Badge variant={'new'} className='hidden md:block ml-1 p-1 text-[10px]'>
                  New
                </Badge>
              )}
            />
          </div>
        ))}

      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  )
}