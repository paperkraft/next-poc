import { FloatingLabel, FloatingLabelInput } from "@/components/ui/floating-input";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
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
                <FormItem className={cn("w-full", rest?.className)} id={name}>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={rest?.disabled}>
                        <SelectTrigger className="relative">
                            <Label
                                htmlFor={name}
                                className={cn(
                                    "absolute start-2 z-10 origin-[0] transform px-1.5 text-sm text-muted-foreground transition-all",
                                    "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100",
                                    "peer-focus:-translate-y-4 peer-focus:scale-90 peer-focus:px-1.5 peer-focus:bg-background",
                                    field.value ? "-translate-y-4 scale-90 px-1.5 bg-background top-1.5" : ""
                                )}
                            >
                                {label}
                            </Label>
                            <SelectValue placeholder />
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