import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HTMLAttributes } from "react"
import { Control, FieldValues, Path, PathValue, useFormContext } from "react-hook-form"

interface Options{
    label: string;
    value: string | number | boolean 
}

interface IInputControllerProps<T extends FieldValues>
extends HTMLAttributes<HTMLInputElement> {
    control?: Control<T>;
    name: Path<T>;
    label: string;
    options: Array<Options>
    description?: string;
    placeholder?: string;
    defaultValue?: PathValue<T, Path<T>> | undefined;
    disabled?: boolean;
    readOnly?: boolean;
}

export const SelectController = <T extends FieldValues>({ options, name, label, ...rest}:IInputControllerProps<T>) => {
    const form = useFormContext();
    return (
        <FormField
            control={form.control}
            name={name}
            render={({field})=>(
                <FormItem className="w-full relative">
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value} 
                            disabled={rest?.disabled}
                        >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder={rest?.placeholder ?? "Select" }/>
                                </SelectTrigger>
                            </FormControl>
                                <SelectContent>
                                    {
                                        options && options.map((item, i)=>(
                                            <SelectItem value={item?.value as string} key={i}>{item?.label}</SelectItem>
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