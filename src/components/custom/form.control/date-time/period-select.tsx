"use client";

import * as React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Period, display12HourValue, setDateByType } from "./time-picker-utils";

export interface PeriodSelectorProps {
    period: Period;
    setPeriod: (m: Period) => void;
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
    onRightFocus?: () => void;
    onLeftFocus?: () => void;
}

export const TimePeriodSelect = React.forwardRef<HTMLButtonElement, PeriodSelectorProps>(({ period, setPeriod, date, setDate, onLeftFocus, onRightFocus }, ref) => {

    React.useEffect(() => {
        if (date) {
            const hours = date.getHours();
            const newPeriod: Period = hours >= 12 ? "PM" : "AM";
            if (newPeriod !== period) {
                setPeriod(newPeriod);
            }
        }
    }, [date, period, setPeriod]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (e.key === "ArrowRight") onRightFocus?.();
        if (e.key === "ArrowLeft") onLeftFocus?.();
    };

    const handleValueChange = (value: Period) => {
        setPeriod(value);

        if (date) {
            const tempDate = new Date(date);
            const hours = display12HourValue(date.getHours());
            setDate(setDateByType(tempDate, hours.toString(), "12hours", period === "AM" ? "PM" : "AM"));
        }
    };

    return (
        <div className="flex items-center">
            <Select value={period} onValueChange={(value: Period) => handleValueChange(value)}>
                <SelectTrigger ref={ref} className="w-[65px] focus:bg-accent focus:text-accent-foreground" onKeyDown={handleKeyDown}>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent className="w-[65px]">
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
});

TimePeriodSelect.displayName = "TimePeriodSelect";