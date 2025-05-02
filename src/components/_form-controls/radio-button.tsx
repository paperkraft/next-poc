'use client';

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from "@/lib/utils";
import { useFormContext } from 'react-hook-form';

interface Options {
    label: string;
    value: string
}

interface RadioGroupProps {
    name: string;
    label: string;
    description?: string;
    className?: string;
    disabled?: boolean;
    options: Array<Options>
}

export const RadioButton = ({ name, label, options, ...rest }: RadioGroupProps) => {
    const form = useFormContext();
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <RadioGroup
                            value={field.value}
                            onValueChange={field.onChange}
                            className={cn("flex gap-4", rest.className)}
                            disabled={rest?.disabled}
                        >
                            {
                                options?.map((item) => (
                                    <FormItem key={item.value} className="flex items-center space-x-1 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value={item.value} />
                                        </FormControl>
                                        <FormLabel className="font-normal cursor-pointer">{item.label}</FormLabel>
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