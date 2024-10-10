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
    icon?: React.ReactNode;
    maxLength?: number;
    minLength?: number;
    rules?: object;
    caps?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    reset?: boolean;
    type?: "password" | "email" | "number" | "text";
    resetClick?: () => void;
}

export const InputController = <T extends FieldValues>({name, label, reset, ...rest}:IInputControllerProps<T>) => {
    const form = useFormContext();
    return (
        <FormField
            control={form.control}
            name={name}
            render={({field, fieldState:{error}})=>(
                <FormItem className="w-full relative">
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input {...field}
                            // type={rest?.type ?? 'text'}
                            type={rest.type === 'number' ? 'text' : rest?.type ?? 'text'}
                            placeholder={rest?.placeholder}
                            disabled={rest?.disabled}
                            readOnly={rest?.readOnly}
                            onChange={(e) => {
                                const value = rest.type === undefined 
                                    ? e.target.value.replace(/[^a-zA-Z\s]/g, '').trimStart()
                                    // : e.target.value
                                    : rest.type === 'number'
                                    ? e.target.value.replace(/[^0-9]/g, '').trimStart()
                                    : e.target.value
                                field.onChange(value)
                            }}
                            minLength={rest?.minLength}
                            maxLength={rest?.maxLength}
                        />
                    </FormControl>
                    {
                        field.value && reset &&
                        <X onClick={() => form.resetField(name)}
                            style={{marginTop: '2px'}}
                            className={cn("h-7 w-7 absolute right-1 -translate-y-1/2 px-1.5 font-normal cursor-pointer",{
                                "top-1/2": rest?.description,
                                "top-[39%]": error,
                                "top-[50%]": !rest?.description && error,
                                "top-[70%]": !rest?.description && !error,
                            })}
                        />
                    }
                    <FormDescription>{rest?.description}</FormDescription>
                    <FormMessage/>
                </FormItem>
            )}
        />
    )
}