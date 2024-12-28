'use client';

import { Button } from '@/components/ui/button';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useFormContext } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { format } from 'date-fns/format';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

                                <div className="hidden items-center space-x-2 p-4">
                                    {/* Hour Input */}
                                    <Input
                                        type="number"
                                        min="1"
                                        max="12"
                                        maxLength={2}
                                        value={field.value ? field.value.getHours() % 12 || 12 : "09"}
                                        onChange={(e) => {
                                            const newHour = e.target.value;
                                            if (field.value) {
                                                const newDate = new Date(field.value);
                                                let hourValue = parseInt(newHour);

                                                if (field.value.getHours() >= 12 && hourValue !== 12) {
                                                    hourValue += 12;
                                                } else if (field.value.getHours() < 12 && hourValue === 12) {
                                                    hourValue = 0;
                                                }

                                                newDate.setHours(hourValue);
                                                field.onChange(newDate);
                                            }

                                        }}
                                        className="w-16"
                                    />
                                    <span>:</span>
                                    {/* Minute Input */}
                                    <Input
                                        type="number"
                                        min="0"
                                        max="59"
                                        maxLength={2}
                                        value={field.value ? field.value.getMinutes().toString().padStart(2, "0") : "00"}
                                        onChange={(e) => {
                                            const newMinute = e.target.value;
                                            if (field.value) {
                                                const newDate = new Date(field.value);
                                                newDate.setMinutes(parseInt(newMinute));
                                                field.onChange(newDate);
                                            }
                                        }}
                                        className="w-16"
                                    />
                                    {/* AM/PM Toggle */}
                                    <Select defaultValue={"AM"}
                                        onValueChange={(val) => {
                                            if (field.value) {
                                                const newDate = new Date(field.value);
                                                let hourValue = newDate.getHours();
                                                if ( val === "AM" && hourValue >= 12) {
                                                    newDate.setHours(hourValue - 12);
                                                }
                                                if ( val === "PM" && hourValue < 12) {
                                                    newDate.setHours(hourValue + 12);
                                                }
                                                field.onChange(newDate);
                                            }
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="AM">AM</SelectItem>
                                            <SelectItem value="PM">PM</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

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
