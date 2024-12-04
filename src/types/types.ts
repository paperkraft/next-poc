export type ChildProps = {
    children: React.ReactNode;
}

export type ImgProps = {
    id: number,
    albumId: number,
    title: string,
    url: string,
    thumbnailUrl: string
}

import * as Locales from 'date-fns/locale'

// Define the FormField type
export type FormFieldType = {
  type: string
  variant: string
  name: string
  label: string
  placeholder?: string
  description?: string
  disabled: boolean
  value: string | boolean | Date | number | string[]
  setValue: (value: string | boolean) => void
  checked: boolean
  onChange: (
    value: string | string[] | boolean | Date | number | number[],
  ) => void
  onSelect: (
    value: string | string[] | boolean | Date | number | number[],
  ) => void
  rowIndex: number
  required?: boolean
  min?: number
  max?: number
  step?: number
  locale?: keyof typeof Locales
  hour12?: boolean
  className?: string
}

export type FieldType = { name: string; isNew: boolean; index?: number }