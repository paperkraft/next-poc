/* eslint-disable @typescript-eslint/no-explicit-any */
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, parse } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { ChangeEvent, useState } from "react";

interface DateFieldProps {
    value: Date | null;
    onChange: (date: Date | null) => void;
    disabled?: boolean;
    readOnly?: boolean;
    fromYear?: number;
    toYear?: number;
}

export const DateField: React.FC<DateFieldProps> = ({ value, onChange, ...rest}) => {
    const [inputValue, setInputValue] = useState<string>(value ? format(value, 'dd-MM-yyyy') : '');

    const datePattern = /^(\d{2})-(\d{2})-(\d{4})$/;
  
    const handleDateChange = (date: Date | undefined) => {
      if (date) {
        const formattedDate = format(date, 'dd-MM-yyyy');
        setInputValue(formattedDate);
        onChange(date);
      } else {
        setInputValue('');
        onChange(null);
      }
    };
  
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value.replace(/[^0-9]/g, '');
      if (value.length > 8) {
        value = value.slice(0, 8);
      }

      // Ensure the year starts with 1,2
      if (value.length > 4) {
        let year = value.slice(4, 8);
        if (year.length > 0 && !['1', '2'].includes(year[0])) {
            year = '2' + year.slice(1); // Default to 2 if it starts with another digit
        }
        value = value.slice(0, 4) + year;
      }

      let formattedValue = '';
      if (value.length > 0) {
        formattedValue = value.slice(0, 2); // Day
        if (value.length > 2) {
          formattedValue += '-' + value.slice(2, 4); // Month
        }
        if (value.length > 4) {
          formattedValue += '-' + value.slice(4, 8); // Year
        }
      }

      const newValue = formattedValue;
      setInputValue(newValue);
  
      if (datePattern.test(newValue)) {
        const parsedDate = parse(newValue, 'dd-MM-yyyy', new Date());
        onChange(parsedDate);
      } else {
        onChange(null);
      }
    };

    return (
        <div>
            <Popover>
                <fieldset className="relative">
                <Input
                    placeholder="DD-MM-YYYY"
                    value={inputValue}
                    onChange={handleInputChange}
                    pattern={datePattern.source}
                    disabled={rest.disabled}
                    readOnly={rest.readOnly}
                />
                <PopoverTrigger asChild disabled={rest.disabled}>
                  <CalendarIcon className={cn("h-7 w-7 absolute right-1 top-1/2 -translate-y-1/2 px-1.5 font-normal cursor-pointer", rest.disabled && 'text-muted-foreground')}/>
                </PopoverTrigger>
                </fieldset>
                <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                    mode="single"
                    captionLayout="dropdown-buttons"
                    defaultMonth={value || undefined}
                    selected={value || undefined}
                    onSelect={handleDateChange as any}
                    fromYear={rest.fromYear ?? 2000}
                    toYear={rest.toYear ?? 2030}
                    // disabled={rest.disabled}
                    disabled={{after: new Date()}}
                />
                </PopoverContent>
            </Popover>
        </div>
    );
  };
