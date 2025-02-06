import { FloatingLabel, FloatingLabelInput } from "@/components/ui/floating-input";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react"
import { FieldValues, Path, PathValue, useFormContext } from "react-hook-form"

interface Options {
    label: string;
    value: string | number | boolean;
}

interface ISelectControllerProps<T extends FieldValues>
    extends HTMLAttributes<HTMLInputElement> {
    name: Path<T>;
    label: string;
    options: Array<Options>
    description?: string;
    placeholder?: string;
    className?: string;
    defaultValue?: PathValue<T, Path<T>> | undefined;
    disabled?: boolean;
    readOnly?: boolean;
}

export const FloatingSelectController = <T extends FieldValues>({ options, name, label, ...rest }: ISelectControllerProps<T>) => {
    const form = useFormContext();
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className={cn("w-full", rest?.className)}>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={rest?.disabled}>
                        <SelectTrigger>
                            <SelectValue placeholder={rest.placeholder ?? label} />
                            {field.value && <FloatingLabel>{label}</FloatingLabel>}
                        </SelectTrigger>
                        <SelectContent>
                            {
                                options?.map((item, i) => (
                                    <SelectItem value={item?.value as any} key={`${i}.${item?.value}`}>{item?.label}</SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                    {rest?.description && <FormDescription>{rest?.description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}