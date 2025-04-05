import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, parse } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { ChangeEvent, forwardRef, useState } from "react";

interface DateFieldProps {
  name: string;
  label?: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  disabled?: boolean;
  readOnly?: boolean;
  floatingLabel?: boolean;
  fromYear?: number;
  toYear?: number;
  disableFuture?: boolean;
}

export const FloatingDateField = forwardRef<HTMLInputElement, DateFieldProps>(
  ({ value, label, onChange, ...rest }, ref) => {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState<string>(value ? format(value, "dd-MM-yyyy") : "");
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
      } finally {
        setOpen(false);
      }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      try {
        let value = e.target.value.replace(/[^0-9]/g, "").slice(0, 8);

        // Extract DD, MM, YYYY
        let day = value.slice(0, 2);
        let month = value.slice(2, 4);
        let year = value.slice(4, 8);

        // Ensure DD starts with 1, 2, or 3 and is within 01-31
        if (day.length === 2) {
          if (!["0", "1", "2", "3"].includes(day[0]) || parseInt(day, 10) < 1 || parseInt(day, 10) > 31) {
            const last = day[1] === "0" ? "1" : day[1]
            day = "0" + last;
          }
        }

        // Ensure MM starts with 0 or 1 and is within 01-12
        if (month.length === 2) {
          if (!["0", "1"].includes(month[0]) || parseInt(month, 10) < 1 || parseInt(month, 10) > 12) {
            const last = month[1] === "0" ? "1" : month[1]
            month = "0" + last;
          }
        }

        // Ensure the year starts with 1 or 2 (valid for 1000–2999)
        if (year.length > 0 && !["1", "2"].includes(year[0])) {
          year = "2" + year.slice(1);
        }

        let formattedValue = [day, month, year].filter(Boolean).join("-");
        setInputValue(formattedValue);

        if (day.length === 2 && month.length === 2 && year.length === 4) {
          const parsedDate = parse(formattedValue, "dd-MM-yyyy", new Date());

          if (rest.disableFuture && parsedDate > new Date()) {
            onChange(null);
            return;
          }

          const isLeapYear = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

          // Max days in each month
          const maxDaysInMonth: { [key: number]: number } = {
            1: 31, 2: isLeapYear(parsedDate.getFullYear()) ? 29 : 28, 3: 31, 4: 30, 5: 31, 6: 30,
            7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31,
          };

          // Auto-fix invalid dates
          if (parsedDate.getDate() > maxDaysInMonth[parsedDate.getMonth() + 1]) {
            day = maxDaysInMonth[parsedDate.getMonth() + 1].toString().padStart(2, "0");
            formattedValue = [day, month, year].join("-");
            setInputValue(formattedValue);
          }
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
      <Popover modal={false} open={open} onOpenChange={setOpen}>
        <div className="relative">
          <Input
            ref={ref}
            id={rest.name}
            name={rest.name}
            className="peer"
            placeholder=" "
            value={inputValue}
            onChange={handleInputChange}
            pattern={datePattern.source}
            disabled={rest.disabled}
            readOnly={rest.readOnly}
            aria-label={rest.name}
          />
          <Label
            className={cn(
              "absolute text-sm text-muted-foreground duration-300 dark:bg-background",
              "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100",
              "peer-focus:top-1.5 peer-focus:-translate-y-4 peer-focus:scale-90 peer-focus:px-1.5",
              "start-2 top-1.5 z-10 origin-[0] -translate-y-4 scale-90 transform bg-background px-1.5"
            )}
            htmlFor={rest.name}
          >
            {label}
          </Label>
          <PopoverTrigger asChild disabled={rest.disabled}>
            <CalendarIcon aria-label="Open Calendar"
              className={cn(
                "size-7 absolute right-1 top-1/2 -translate-y-1/2 p-1.5 cursor-pointer opacity-60 hover:opacity-100",
                rest.disabled && "text-muted-foreground"
              )}
              onClick={() => setOpen(true)}
            />
          </PopoverTrigger>
        </div>

        <PopoverContent className="w-auto p-0" align="end" onOpenAutoFocus={(e) => e.preventDefault()}>
          <Calendar
            mode="single"
            selected={value || undefined}
            defaultMonth={value || undefined}
            onSelect={handleDateChange}
            disabled={rest.disableFuture ? (date) => date > new Date() : undefined}
          />
        </PopoverContent>
      </Popover>
    );
  });
