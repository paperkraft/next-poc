'use client';

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from "@/lib/utils";
import { useFormContext } from 'react-hook-form';

interface Options{
    label: string;
    value: string
}

interface ColorPickerProps {
    name: string;
    label: string;
    description?: string;
    className?: string;
    disabled?: boolean;
    options:Array<Options>
}

export const RadioButton = ({ name, label, options, ...rest }: ColorPickerProps) => {
    const form = useFormContext();
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="">
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <RadioGroup
                            // defaultValue={field.value}
                            value={field.value}
                            onValueChange={field.onChange}
                            className={cn("flex", rest.className)}
                            disabled={rest?.disabled}
                        >
                            {
                                options?.map((item)=>(
                                <FormItem key={item.value} className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                        <RadioGroupItem value={item.value} />
                                    </FormControl>
                                    <FormLabel className="font-normal">{item.label}</FormLabel>
                                </FormItem>
                                ))
                            }
                            
                        </RadioGroup>
                    </FormControl>
                    {rest?.description && <FormDescription>{rest?.description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}