import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { HTMLAttributes } from "react"
import { FieldValues, Path, PathValue, useFormContext } from "react-hook-form"
import { DateField } from "./DateField";
import { isDate } from "date-fns";

interface IInputControllerProps<T extends FieldValues>
extends HTMLAttributes<HTMLInputElement> {
    // control: Control<T>;
    name: Path<T>;
    label: string;
    description?:string;
    placeholder?: string;
    defaultValue?: PathValue<T, Path<T>> | undefined;
    icon?: React.ReactNode;
    disabled?: boolean;
    readOnly?: boolean;
    fromYear?: number;
    toYear?: number;
}

export const DateController = <T extends FieldValues>({ name, label, ...rest}:IInputControllerProps<T>) => {
    const form = useFormContext();
    return (
        <FormField
            control={form.control}
            name={name}
            render={({field, fieldState:{error}})=>(
                <FormItem className="w-full">
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <DateField
                            value={field.value ? new Date(field.value) : null}
                            onChange={(date: Date | null) => {
                                try {
                                    field.onChange(isDate(date) ? date.toISOString() : '');
                                } catch (error) {
                                    console.error(error);
                                }
                            }}
                            disabled={rest.disabled}
                            readOnly={rest.readOnly}
                            fromYear={rest.fromYear}
                            toYear={rest.toYear}
                        />
                    </FormControl>
                    <FormDescription>{rest?.description}</FormDescription>
                    <FormMessage>{error?.message}</FormMessage>
                </FormItem>
            )}
        />
    )
}