'use client'

import { Button } from '@/components/ui/button'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { useFormContext } from 'react-hook-form'

interface GradientPickerProps {
    name: string;
    label: string;
    description?: string;
    placeholder?: string;
    disabled?: boolean;
    readOnly?: boolean;

}

export function GradientPicker({ name, label, ...rest }: GradientPickerProps) {

    const form = useFormContext();
    const solids = [
        "#AEC6E4",
        "#B2E7E0",
        "#B9FBC0",
        "#B2E0B2",
        
        "#FFB3BA",
        "#FFD1DC",
        "#FFDFBA",
    ]

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="w-full">
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Popover>
                            <PopoverTrigger asChild disabled={rest.disabled} className='w-full'>
                                <Button variant={'outline'} className={cn('justify-start text-left font-normal', !field.value && 'text-muted-foreground')}>
                                    <div className="flex gap-2">
                                        <div style={{ backgroundColor: field.value, background: field.value }} className='size-5 rounded' />
                                        {field.value ? field.value : 'Pick a color'}
                                    </div>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full" align="start">
                                <div className="flex flex-wrap gap-1 mt-0">
                                    {solids.map((s) => (
                                        <div
                                            key={s}
                                            style={{ background: s }}
                                            className="rounded-md h-6 w-6 cursor-pointer active:scale-105"
                                            onClick={() => field.onChange(s)}
                                        />
                                    ))}
                                </div>
                            </PopoverContent>
                        </Popover>
                    </FormControl>
                    {rest?.description && <FormDescription>{rest?.description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}