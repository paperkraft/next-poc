"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { TimePeriodSelect } from "./period-select";
import { Period } from "./time-picker-utils";
import { TimePickerInput } from "./time-picket-input";
import { Clock } from "lucide-react";

interface TimePickerDemoProps {
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
    second?: boolean;
}

export function TimePicker({ date, setDate, second }: TimePickerDemoProps) {
    const [period, setPeriod] = React.useState<Period>("PM");

    const minuteRef = React.useRef<HTMLInputElement>(null);
    const hourRef = React.useRef<HTMLInputElement>(null);
    const secondRef = React.useRef<HTMLInputElement>(null);
    const periodRef = React.useRef<HTMLButtonElement>(null);

    return (
        <div className="flex items-end gap-2">
            <div className="flex h-10 items-center">
                <Clock className="ml-2 h-4 w-4" />
            </div>
            <div className="grid gap-1 text-center">
                <Label htmlFor="hours" className="text-xs">
                    Hours
                </Label>
                <TimePickerInput
                    picker="12hours"
                    period={period}
                    date={date}
                    setDate={setDate}
                    ref={hourRef}
                    onRightFocus={() => minuteRef.current?.focus()}
                />
            </div>
            <div className="grid gap-1 text-center">
                <Label htmlFor="minutes" className="text-xs">
                    Minutes
                </Label>
                <TimePickerInput
                    picker="minutes"
                    id="minutes12"
                    date={date}
                    setDate={setDate}
                    ref={minuteRef}
                    onLeftFocus={() => hourRef.current?.focus()}
                    onRightFocus={() => second ? secondRef.current?.focus() : periodRef.current?.focus()}
                />
            </div>
            {
                second &&
                <div className="grid gap-1 text-center">
                    <Label htmlFor="seconds" className="text-xs">
                        Seconds
                    </Label>
                    <TimePickerInput
                        picker="seconds"
                        id="seconds12"
                        date={date}
                        setDate={setDate}
                        ref={secondRef}
                        onLeftFocus={() => minuteRef.current?.focus()}
                        onRightFocus={() => periodRef.current?.focus()}
                    />
                </div>
            }
            <div className="grid gap-1 text-center">
                <Label htmlFor="period" className="text-xs">
                    Period
                </Label>
                <TimePeriodSelect
                    period={period}
                    setPeriod={setPeriod}
                    date={date}
                    setDate={setDate}
                    ref={periodRef}
                    onLeftFocus={() => second ? secondRef.current?.focus() : minuteRef.current?.focus()}
                />
            </div>
        </div>
    );
}