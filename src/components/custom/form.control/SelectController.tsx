import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react"
import { FieldValues, Path, PathValue, useFormContext } from "react-hook-form"

interface Options{
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

export const SelectController = <T extends FieldValues>({ options, name, label, ...rest}:ISelectControllerProps<T>) => {
    const form = useFormContext();
    return (
        <FormField
            control={form.control}
            name={name}
            render={({field})=>(
                <FormItem className={cn("w-full relative", rest?.className)}>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={rest?.disabled}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder={rest?.placeholder ?? "Select" }/>
                                </SelectTrigger>
                            </FormControl>
                                <SelectContent>
                                    {
                                        options?.map((item, i) => (
                                            <SelectItem value={item?.value as any} key={`${i}.${item?.value}`}>{item?.label}</SelectItem>
                                        ))
                                    }
                                </SelectContent>
                        </Select>
                    </FormControl>
                    {rest?.description && <FormDescription>{rest?.description}</FormDescription>}
                    <FormMessage/>
                </FormItem>
            )}
        />
    )
}