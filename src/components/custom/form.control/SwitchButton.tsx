"use client";

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";

interface SwitchProps {
  name: string;
  label?: string;
  description?: string;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string
}

export const SwitchButton = ({ name, label, ...rest }: SwitchProps) => {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("w-full",rest.className, {"flex flex-col": label})}>
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
