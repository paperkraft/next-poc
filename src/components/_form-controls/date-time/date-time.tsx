'use client';

import { Button } from '@/components/ui/button';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useFormContext } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { format } from 'date-fns/format';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { TimePicker } from './time-picker';

interface DateTimePickerProps {
    name: string;
    label: string;
    description?: string;
    placeholder?: string;
    disabled?: boolean;
    readOnly?: boolean;
}

export function DatetimePicker({ name, label, ...rest }: DateTimePickerProps) {
    const form = useFormContext();
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>{label}</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full font-normal",
                                        !field.value && "text-muted-foreground"
                                    )}
                                >
                                    {field.value ? (
                                        `${format(field.value, "dd/MM/yyyy hh:mm aa")}` 
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <div className="flex flex-col">
                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                                <div className="p-3 border-t border-border">
                                    <TimePicker setDate={field.onChange} date={field.value} />
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                    {rest?.description && <FormDescription>{rest?.description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
