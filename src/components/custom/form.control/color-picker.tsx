'use client';

import { RgbaStringColorPicker } from 'react-colorful';
import { Button } from '@/components/ui/button';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useFormContext } from 'react-hook-form';

interface ColorPickerProps {
    name: string;
    label: string;
    description?: string;
    placeholder?: string;
    disabled?: boolean;
    readOnly?: boolean;
}

export const ColorPicker =  ({ name, label, ...rest}:ColorPickerProps) => {
    const form = useFormContext();
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="w-full flex flex-col">
                <FormLabel>{label}</FormLabel>
                <FormControl>
                    <Popover>
                        <PopoverTrigger asChild disabled={rest.disabled}>
                            <Button size='icon'variant='outline'>
                                <div style={{ backgroundColor: field.value }} className='size-8 rounded p-1'/>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full" align="start">
                            <RgbaStringColorPicker color={field.value} onChange={field.onChange}/>
                        </PopoverContent>
                    </Popover>
                </FormControl>
                {rest?.description && <FormDescription>{rest?.description}</FormDescription>}
                <FormMessage />
                </FormItem>
            )}
        />
    );
}