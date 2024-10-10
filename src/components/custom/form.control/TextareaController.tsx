import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { HTMLAttributes } from "react"
import { FieldValues, Path, PathValue, useFormContext } from "react-hook-form"

interface IInputControllerProps<T extends FieldValues>
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

export const TextareaController = <T extends FieldValues>({ name, label, ...rest}:IInputControllerProps<T>) => {
    const form = useFormContext();
    return (
        <FormField
            control={form.control}
            name={name}
            render={({field})=>(
                <FormItem className="w-full">
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Textarea
                            placeholder={rest?.placeholder}
                            className="resize-none"
                            {...field}
                            readOnly={rest?.readOnly}
                            disabled={rest?.disabled}
                            rows={rest?.rows}
                        />
                    </FormControl>
                    <FormDescription>{rest?.description}</FormDescription>
                    <FormMessage/>
                </FormItem>
            )}
        />
    )
}