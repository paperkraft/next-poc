"use client";

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useFormContext } from "react-hook-form";

interface SwitchProps {
  name: string;
  label?: string;
  description?: string;
  disabled?: boolean;
  readOnly?: boolean;
}

export const SwitchButton = ({ name, label, ...rest }: SwitchProps) => {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
                <Switch
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked)}
                />
            </FormControl>
            {rest?.description && <FormDescription>{rest?.description}</FormDescription>}
            <FormMessage/>
        </FormItem>
      )}
    />
  );
};
