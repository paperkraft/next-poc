"use client";

import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { PlusIcon } from "lucide-react";
import { useEvents } from "@/context/calendar-context";
import { toast } from "sonner";
import { InputController } from "../custom/form.control/InputController";
import { TextareaController } from "../custom/form.control/TextareaController";
import { DatetimePicker } from "../custom/form.control/date-time";
import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { SelectController } from "../custom/form.control/SelectController";
import { GradientPicker } from "../custom/form.control/gradient-picker";
import { eventFormSchema } from "./event-schema";
import { categories } from "@/utils/calendar-data";
import { RadioButton } from "../custom/form.control/radio-button";

type EventAddFormValues = z.infer<typeof eventFormSchema>;

interface EventAddFormProps {
  start: Date | undefined;
  end: Date | undefined;
  onClick?: () => void;
  displayButton: boolean;
}

const freq = ['daily', 'weekly', 'monthly'];

const options = categories.flatMap((category) => { return { label: category, value: category } });
const freqOptions = freq.flatMap((item) => { return { label: item, value: item } });

const weekOptions = [
  { label: "Monday", value: "mo" },
  { label: "Tuesday", value: "tu" },
  { label: "Wednesday", value: "we" },
  { label: "Thursday", value: "th" },
  { label: "Friday", value: "fr" },
  { label: "Saturday", value: "sa" },
  { label: "Sunday", value: "su" },
]

export function EventAddForm({ start, end, displayButton, onClick }: EventAddFormProps) {
  const { events, addEvent, eventAddOpen, setEventAddOpen } = useEvents();

  let endDate = new Date(end!);
  const Today = new Date().getDate() === start?.getDate();

  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema)
  });

  useEffect(() => {
    form.reset({
      id: "",
      title: "",
      description: "",
      category: "",
      start: start,
      end: Today ? end : new Date(endDate.setDate(endDate.getDate() + 1)),
      color: "#B9FBC0",
      allDay: false,

      type: "default",
      freq: "",
    });
  }, [form, start, end]);

  function isMidnight(date: Date) {
    return date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0 && date.getMilliseconds() === 0;
  }

  async function onSubmit(data: EventAddFormValues) {

    const { type, freq, start, end, week, allDay, ...rest } = data;

    const isAllDay = isMidnight(start) && isMidnight(end);

    const checkSameTime = start.getTime() === end.getTime();

    if (checkSameTime) {
      form.setError('end', { message: "Time cannot be same" });
      return
    }

    if (end <= start) {
      form.setError('end', { message: "End date must be after start date" });
      return;
    }

    if (type === 'recurring') {
      const rrule = {
        freq: freq as string,
        interval: 1,
        byweekday: freq === 'weekly' ? week : undefined,
        bymonthday: freq === 'monthly' ? start.getDate() : undefined,
        dtstart: start,
        until: end,
      }

      const recurringEvent = {
        ...rest,
        id: String(events.length + 1),
        start: start,
        end: end,
        rrule: { ...rrule },
      };

      addEvent(recurringEvent);
      setEventAddOpen(false);
      toast.success("Recurring Event created");
      form.reset();
    } else {
      const newEvent = {
        ...rest,
        id: String(events.length + 1),
        start,
        end,
        allDay: isAllDay
      } 
      addEvent(newEvent);
      setEventAddOpen(false);
      toast.success("Event created");
      form.reset();
    }
  }

  return (
    <>
      <AlertDialog open={eventAddOpen}>
        {
          displayButton &&
          <AlertDialogTrigger asChild>
            <Button onClick={() => { setEventAddOpen(true); onClick && onClick() }} className="w-full">
              <PlusIcon className="md:h-5 md:w-5 h-3 w-3" />
              <p>Add Event</p>
            </Button>
          </AlertDialogTrigger>
        }

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add Event</AlertDialogTitle>
          </AlertDialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <InputController name="title" label="Title" placeholder="Title" />
              <TextareaController name="description" label="Description" placeholder="Description" />

              <RadioButton name="type" label="Event Type" className="items-center"
                options={[
                  { label: "Default", value: "default" },
                  { label: "Recurring", value: "recurring" },
                ]}
              />

              {
                form.watch('type') === 'recurring' && (
                  <div className="flex gap-4">
                    <SelectController name="freq" label="Frequency" options={freqOptions} />
                    {
                      form.watch('freq') === 'weekly'
                        ? <SelectController name="week" label="Week" options={weekOptions} />
                        : null
                    }
                  </div>
                )
              }

              <div className="grid grid-cols-2 gap-4">
                <SelectController name="category" label="Category" options={options} />
                <GradientPicker name="color" label="Color" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <DatetimePicker name="start" label="Start Date" />
                <DatetimePicker name="end" label={form.watch('type') === 'recurring' ? "Until" : "End Date"} />
              </div>

              <AlertDialogFooter className="pt-2">
                <div className="flex gap-2">
                  <Button type="button" variant={'outline'} onClick={() => { form.reset(); setEventAddOpen(false) }}>Cancel</Button>
                  <Button type="submit">Add Event</Button>
                </div>
              </AlertDialogFooter>
            </form>
          </Form>

        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}