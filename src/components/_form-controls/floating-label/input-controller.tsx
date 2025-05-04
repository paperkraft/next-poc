'use client';

import { X } from 'lucide-react';
import { HTMLAttributes } from 'react';
import { Control, FieldValues, Path, PathValue, useFormContext } from 'react-hook-form';

import { FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface IInputControllerProps<T extends FieldValues>
    extends HTMLAttributes<HTMLInputElement> {
    control?: Control<T>;
    name: Path<T>;
    label: string;
    description?: string;
    defaultValue?: PathValue<T, Path<T>> | undefined;
    maxLength?: number;
    minLength?: number;
    disabled?: boolean;
    readOnly?: boolean;
    reset?: boolean;
    required?: boolean;
    type?: "password" | "email" | "number" | "text";
    resetClick?: () => void;
}

export const FloatingInputController = <T extends FieldValues>({ name, label, reset, ...rest }: IInputControllerProps<T>) => {
    const form = useFormContext();
    return (
        <FormField
            control={form.control}
            name={name}
            disabled={rest?.disabled}
            rules={{ required: rest?.required ? `${label} is required` : undefined }}
            render={({ field }) => (
                <FormItem className="w-full">
                    <div className="relative">
                        <Input
                            {...field}
                            className="peer"
                            ref={field.ref}
                            placeholder=" "
                            id={name}
                            type={rest.type === 'number' ? 'text' : rest?.type ?? 'text'}
                            disabled={rest?.disabled}
                            readOnly={rest?.readOnly}
                            onChange={(e) => {
                                const value = rest.type === undefined
                                    ? e.target.value.replace(/[^a-zA-Z\s]/g, '').trimStart()
                                    : rest.type === 'number'
                                        ? e.target.value.replace(/[^0-9]/g, '').trimStart()
                                        : e.target.value
                                field.onChange(value)
                            }}
                            minLength={rest?.minLength}
                            maxLength={rest?.maxLength}
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
                        {reset && field.value && <X onClick={() => form.resetField(name)}
                            className={cn("opacity-50 hover:opacity-100 size-7 absolute right-1 top-1/2 -translate-y-1/2 px-1.5 font-normal cursor-pointer")} />}
                    </div>
                    {rest?.description && <FormDescription>{rest?.description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}