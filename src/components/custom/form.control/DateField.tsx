import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, parse } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { ChangeEvent, useState } from "react";

interface DateFieldProps {
  name: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  disabled?: boolean;
  readOnly?: boolean;
  fromYear?: number;
  toYear?: number;
}

export const DateField: React.FC<DateFieldProps> = ({ value, onChange, ...rest }) => {
  const [inputValue, setInputValue] = useState<string>(
    value ? format(value, "dd-MM-yyyy") : ""
  );

  const datePattern = /^(\d{2})-(\d{2})-(\d{4})$/;

  const handleDateChange = (date: Date | undefined) => {
    try {
      if (date) {
        const formattedDate = format(date, "dd-MM-yyyy");
        setInputValue(formattedDate);
        onChange(date);
      } else {
        setInputValue("");
        onChange(null);
      }
    } catch (error) {
      console.error("Error handling date change:", error);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    try {
      let value = e.target.value.replace(/[^0-9]/g, "").slice(0, 8);

      // Ensure the year starts with 1 or 2
      if (value.length > 4) {
        let year = value.slice(4, 8);
        if (year.length > 0 && !["1", "2"].includes(year[0])) {
          year = "2" + year.slice(1);
        }
        value = value.slice(0, 4) + year;
      }

      let formattedValue = value.replace(/^(\d{2})(\d{0,2})(\d{0,4})$/, (_, d, m, y) => {
        return [d, m, y].filter(Boolean).join("-");
      });

      setInputValue(formattedValue);

      if (datePattern.test(formattedValue)) {
        const parsedDate = parse(formattedValue, "dd-MM-yyyy", new Date());
        onChange(parsedDate);
      } else {
        onChange(null);
      }
    } catch (error) {
      console.error("Error parsing date input:", error);
      onChange(null);
    }
  };

  return (
    <Popover>
      <label htmlFor={rest.name} className="sr-only">
        {rest.name}
      </label>
      <div className="relative">
        <Input
          id={rest.name}
          placeholder="DD-MM-YYYY"
          value={inputValue}
          onChange={handleInputChange}
          pattern={datePattern.source}
          disabled={rest.disabled}
          readOnly={rest.readOnly}
          aria-label={rest.name}
        />
        <PopoverTrigger asChild disabled={rest.disabled}>
          <CalendarIcon
            aria-label="Open Calendar"
            className={cn(
              "h-7 w-7 absolute right-1 top-1/2 -translate-y-1/2 px-1.5 cursor-pointer",
              rest.disabled && "text-muted-foreground"
            )}
          />
        </PopoverTrigger>
      </div>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          mode="single"
          captionLayout="dropdown"
          defaultMonth={value || undefined}
          selected={value || undefined}
          onSelect={handleDateChange}
          fromYear={rest.fromYear ?? new Date().getFullYear() - 50}
          toYear={rest.toYear ?? new Date().getFullYear() + 5}
          disabled={{ after: new Date() }}
        />
      </PopoverContent>
    </Popover>
  );
};
