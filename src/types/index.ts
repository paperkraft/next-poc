import * as Locales from 'date-fns/locale'

export type FormFieldType = {
    label: string
    description?: string
    placeholder?: string
    defaultValue?: string | string[] | number | number[] | boolean | Date 
    
    checked?: boolean
    disabled?: boolean
    readOnly?: boolean
    name: string
    required?: boolean

    variant: string
    type?: string
    value?: string | boolean | Date | number | string[]

    setValue: (value: string | boolean) => void
    onChange: (
        value: string | string[] | boolean | Date | number | number[],
    ) => void
    onSelect: (
        value: string | string[] | boolean | Date | number | number[],
    ) => void
    // rowIndex?: number

    min?: number
    max?: number
    step?: number
    locale?: keyof typeof Locales
    hour12?: boolean
    className?: string
}

export type FieldType = { name: string; isNew: boolean; index?: number }

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

export type FetchResponse = {
    success: boolean;
    message: string;
};