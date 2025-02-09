import { FloatingLabelInput } from "@/components/ui/floating-input";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { HTMLAttributes } from "react"
import { Control, FieldValues, Path, PathValue, useFormContext } from "react-hook-form"

interface IInputControllerProps<T extends FieldValues>
    extends HTMLAttributes<HTMLInputElement> {
    control?: Control<T>;
    name: Path<T>;
    label: string;
    description?: string;
    placeholder?: string;
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
            rules={{ required: rest?.required ? `${label} is required` : undefined }}
            render={({ field }) => (
                <FormItem className="w-full">
                    <div className="relative">
                        <FloatingLabelInput
                            {...field}
                            id={label}
                            label={label}
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