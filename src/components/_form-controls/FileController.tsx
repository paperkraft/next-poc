/* eslint-disable @typescript-eslint/no-unused-vars */
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { HTMLAttributes } from "react"
import { Control, FieldValues, Path, PathValue, useFormContext } from "react-hook-form"

interface IInputControllerProps<T extends FieldValues>
extends HTMLAttributes<HTMLInputElement> {
    control: Control<T>;
    name: Path<T>;
    label: string;
    placeholder?: string;
    description?: string;
    disabled?: boolean;
    readOnly?: boolean;
}

export const FileController = <T extends FieldValues>({name, label, ...rest}:IInputControllerProps<T>) => {
    const form = useFormContext();
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field: { value, onChange, ...fieldProps }})=>(
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input
                            {...fieldProps}
                            disabled={rest?.disabled}
                            readOnly={rest?.readOnly}
                            placeholder={rest?.placeholder}
                            type="file"
                            accept="image/*"
                            onChange={(event) =>
                                onChange(event.target.files && event.target.files[0])
                            }
                        />
                    </FormControl>
                    <FormDescription>{rest?.description}</FormDescription>
                    <FormMessage/>
                </FormItem>
            )}
        />
    )
}