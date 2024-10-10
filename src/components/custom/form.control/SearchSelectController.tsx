/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import { HTMLAttributes } from "react"
import { FieldValues, Path, PathValue, useFormContext } from "react-hook-form"

interface Options{
    label: string;
    value: string | number | boolean 
}

interface IInputControllerProps<T extends FieldValues>
extends HTMLAttributes<HTMLInputElement> {
    name: Path<T>;
    label: string;
    options: Array<Options>
    description?: string;
    placeholder?: string;
    defaultValue?: PathValue<T, Path<T>> | undefined;
    disabled?: boolean;
    readOnly?: boolean;
}

export const SearchSelectController = <T extends FieldValues>({options, name, label, ...rest}:IInputControllerProps<T>) => {
    const form = useFormContext()
    return (
        
        <FormField
            control={form.control}
            name={name}
            render={({field})=>(
                <FormItem className="w-full">
                    <FormLabel>{label}</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                        "justify-between w-full",
                                        !field.value && "text-muted-foreground"
                                    )}    
                                >
                                    {field.value
                                        ? options.find(
                                            (item) => item.value === field.value
                                        )?.label
                                        : "Select"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        
                        <PopoverContent className="p-0" align="start">
                            <Command>
                                <CommandInput placeholder="Search..." />
                                <CommandList>
                                    <CommandEmpty>Not found.</CommandEmpty>
                                    <CommandGroup>
                                    {options && options.map((item) => (
                                        <CommandItem
                                            value={item.label}
                                            key={item.value as string}
                                            onSelect={() => {
                                                form.setValue(name, item.value as any)
                                            }}
                                        >
                                            <CheckIcon
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                item.value === field.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                            />
                                            {item.label}
                                        </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <FormDescription>{rest?.description}</FormDescription>
                    <FormMessage/>
                </FormItem>
            )}
        />
    )
}