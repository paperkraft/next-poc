'use client';

import { HTMLAttributes } from 'react';
import { FieldValues, Path, PathValue, useFormContext } from 'react-hook-form';

import { FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface ITextareaControllerProps<T extends FieldValues>
    extends HTMLAttributes<HTMLInputElement> {
    name: Path<T>;
    label: string;
    description?: string;
    placeholder?: string;
    defaultValue?: PathValue<T, Path<T>> | undefined;
    rows?: number;
    disabled?: boolean;
    readOnly?: boolean;
}

export const FloatingTextareaController = <T extends FieldValues>({ name, label, ...rest }: ITextareaControllerProps<T>) => {
    const form = useFormContext();
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="w-full">
                    <div className="relative">
                        <Textarea
                            {...field}
                            id={name}
                            ref={field.ref}
                            placeholder=" "
                            className="resize-none peer"
                            readOnly={rest?.readOnly}
                            disabled={rest?.disabled}
                            rows={rest?.rows}
                        />
                        <Label
                            className={cn(
                                "absolute text-sm text-muted-foreground duration-300 dark:bg-background",
                                "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100",
                                "peer-focus:top-1.5 peer-focus:-translate-y-4 peer-focus:scale-90 peer-focus:px-1.5",
                                "start-2 top-1.5 z-10 origin-[0] -translate-y-4 scale-90 transform bg-background px-1.5"
                            )}
                            htmlFor={name}
                        >
                            {label}
                        </Label>
                    </div>
                    {rest?.description && <FormDescription>{rest?.description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}