import { FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { HTMLAttributes } from "react"
import { FieldValues, Path, PathValue, useFormContext } from "react-hook-form"
import { DateField } from "../DateField";
import { isDate } from "date-fns";
import { FloatingDateField } from "./FloatingDateField";

interface IInputControllerProps<T extends FieldValues>
    extends HTMLAttributes<HTMLInputElement> {
    name: Path<T>;
    label: string;
    description?: string;
    placeholder?: string;
    defaultValue?: PathValue<T, Path<T>> | undefined;
    icon?: React.ReactNode;
    disabled?: boolean;
    readOnly?: boolean;
    fromYear?: number;
    toYear?: number;
}

export const FloatingDateController = <T extends FieldValues>({ name, label, ...rest }: IInputControllerProps<T>) => {
    const form = useFormContext();
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="w-full">
                    <FloatingDateField
                        name={name}
                        label={label}
                        value={field.value ? new Date(field.value) : null}
                        onChange={(date: Date | null) => {
                            try {
                                field.onChange(isDate(date) ? date.toISOString() : '');
                            } catch (error) {
                                console.error(error);
                                throw error;
                            }
                        }}
                        disabled={rest?.disabled}
                        readOnly={rest?.readOnly}
                        fromYear={rest?.fromYear}
                        toYear={rest?.toYear}
                    />
                    {rest?.description && <FormDescription>{rest?.description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}