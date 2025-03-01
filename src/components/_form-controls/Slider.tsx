"use client";

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { useFormContext } from "react-hook-form";

interface SwitchProps {
    name: string;
    label: string;
    description?: string;
    disabled?: boolean;
    readOnly?: boolean;
    min?: number;
    max?: number;
    step?: number;
}

export const SliderController = ({ name, label, ...rest }: SwitchProps) => {
    const form = useFormContext();
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Slider
                            min={0}
                            max={100}
                            step={1}
                            defaultValue={[field.value]}
                            onValueChange={(vals) => {
                                field.onChange(vals[0]);
                            }}
                        />
                    </FormControl>
                    {rest?.description && <FormDescription className="py-3">{rest?.description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
