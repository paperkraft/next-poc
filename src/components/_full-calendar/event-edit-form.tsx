"use client";

import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useEvents } from "@/context/calendar-context";
import { CalendarEvent, categories } from "@/utils/calendar-data";
import { Button } from "../ui/button";
import { EditIcon } from "lucide-react";
import { InputController } from "../custom/form.control/InputController";
import { TextareaController } from "../custom/form.control/TextareaController";
import { DatetimePicker } from "../custom/form.control/date-time";
import { SelectController } from "../custom/form.control/SelectController";
import { toast } from "sonner";
import { GradientPicker } from "../custom/form.control/gradient-picker";
import { eventFormSchema } from "./event-schema";
import { RadioButton } from "../custom/form.control/radio-button";

type EventEditFormValues = z.infer<typeof eventFormSchema>;

interface EventEditFormProps {
  oldEvent?: CalendarEvent;
  event?: CalendarEvent;
  isDrag: boolean;
  displayButton: boolean;
}

const freq = ['daily', 'weekly', 'monthly'];
const options = categories.flatMap((category) => { return { label: category, value: category } })
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

export function EventEditForm({ oldEvent, event, isDrag, displayButton }: EventEditFormProps) {
  const { addEvent, deleteEvent, eventEditOpen, setEventEditOpen, setEventViewOpen } = useEvents();

  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
  });

  const handleEditCancellation = () => {
    if (isDrag && oldEvent) {
      const resetEvent = {
        id: oldEvent.id,
        title: oldEvent.title,
        description: oldEvent.description,
        start: oldEvent.start,
        end: oldEvent.end,
        color: oldEvent.backgroundColor!,
        category: oldEvent.category,
        allDay: oldEvent.allDay,
        rrule: oldEvent.rrule
      };

      deleteEvent(oldEvent.id);
      addEvent(resetEvent);
    }
    setEventEditOpen(false);
    form.reset();
  };

  useEffect(() => {
    form.reset({
      id: event?.id,
      title: event?.title,
      description: event?.description,
      start: event?.start as Date,
      end: event?.rrule ? event?.rrule.until : event?.end as Date,
      color: event?.backgroundColor,
      category: event?.category,
      allDay: event?.allDay,
      type: event?.rrule ? 'recurring' : 'default',
      freq: event?.rrule ? event.rrule.freq : undefined,
      week: event?.rrule ? event.rrule.byweekday as string : undefined,
    });
  }, [form, event]);

  async function onSubmit(data: EventEditFormValues) {

    const { type, freq, start, end, week, allDay, ...rest } = data;
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
        start: start,
        end: end,
        rrule: { ...rrule },
      };

      deleteEvent(data.id);
      addEvent(recurringEvent);
      setEventEditOpen(false);
      toast.success("Recurring Event updated");
      form.reset();
    } else {
      const newEvent = {
        id: data.id,
        title: data.title,
        description: data.description,
        start: data.start,
        end: data.end,
        color: data.color,
        category: data.category,
        allDay: data.allDay,
      };
      deleteEvent(data.id);
      addEvent(newEvent);
      setEventEditOpen(false);
      form.reset();
      toast.success("Event updated");
    }

  }

  return (
    <AlertDialog open={eventEditOpen}>
      {displayButton && (
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size={'icon'} onClick={() => { setEventEditOpen(true); }}>
            <EditIcon className="size-4" />
          </Button>
        </AlertDialogTrigger>
      )}

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit {event?.title}</AlertDialogTitle>
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
              <DatetimePicker name="end" label="End Date" />
            </div>

            <AlertDialogFooter className="pt-2">
              <AlertDialogCancel onClick={() => handleEditCancellation()}>Cancel</AlertDialogCancel>
              <AlertDialogAction type="submit">Save</AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
