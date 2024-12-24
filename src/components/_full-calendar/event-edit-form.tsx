"use client";

import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
} from "@/components/ui/form";
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
import { CalendarEvent } from "@/utils/calendar-data";
import { Button } from "../ui/button";
import { EditIcon } from "lucide-react";
import { InputController } from "../custom/form.control/InputController";
import { TextareaController } from "../custom/form.control/TextareaController";
import { Separator } from "../ui/separator";
import { DatetimePicker } from "../custom/form.control/date-time";
import { SelectController } from "../custom/form.control/SelectController";
import { toast } from "sonner";
import { GradientPicker } from "../custom/form.control/gradient-picker";

const eventEditFormSchema = z.object({
  id: z.string(),
  title: z
    .string({ required_error: "Please enter a title." })
    .min(1, { message: "Must provide a title for this event." }),
  description: z
    .string({ required_error: "Please enter a description." })
    .min(1, { message: "Must provide a description for this event." }),
  start: z.date({
    required_error: "Please select a start time",
    invalid_type_error: "That's not a date!",
  }),
  end: z.date({
    required_error: "Please select an end time",
    invalid_type_error: "That's not a date!",
  }),
  color: z
    .string({ required_error: "Please select an event color." })
    .min(1, { message: "Must provide a title for this event." }),
  category: z
    .string({ required_error: "Please select an event category." })
    .min(1, { message: "Must provide a category for this event." }).optional()
});

type EventEditFormValues = z.infer<typeof eventEditFormSchema>;

interface EventEditFormProps {
  oldEvent?: CalendarEvent;
  event?: CalendarEvent;
  isDrag: boolean;
  displayButton: boolean;
}

const options = [
  { label: "Meeting", value: "Meeting" },
  { label: "Holiday", value: "Holiday" },
  { label: "Birthday", value: "Birthday" },
  { label: "Conference", value: "Conference" },
]

export function EventEditForm({
  oldEvent,
  event,
  isDrag,
  displayButton,
}: EventEditFormProps) {
  const { addEvent, deleteEvent, events } = useEvents();
  const { eventEditOpen, setEventEditOpen } = useEvents();

  const form = useForm<z.infer<typeof eventEditFormSchema>>({
    resolver: zodResolver(eventEditFormSchema),
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
        category: events.find((e) => e.id === oldEvent.id)?.category,
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
      end: event?.end as Date,
      color: event?.backgroundColor,
      category: events.find((e) => e.id === event?.id)?.category,
    });
  }, [form, event]);

  async function onSubmit(data: EventEditFormValues) {
    const newEvent = {
      id: data.id,
      title: data.title,
      description: data.description,
      start: data.start,
      end: data.end,
      color: data.color,
      category: data.category,
    };
    deleteEvent(data.id);
    addEvent(newEvent);
    setEventEditOpen(false);
    form.reset();
    toast.success("Event edited");
  }

  return (
    <AlertDialog open={eventEditOpen}>
      {displayButton && (
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size={'icon'}
            onClick={() => setEventEditOpen(true)}
          >
            <EditIcon className="size-4" />
          </Button>
        </AlertDialogTrigger>
      )}

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit {event?.title}</AlertDialogTitle>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2.5">
            <InputController name="title" label="Title" placeholder="Title" />
            <TextareaController name="description" label="Description" placeholder="Description" />
            <Separator />

            <div className="grid grid-cols-2 gap-2">
              <DatetimePicker name="start" label="Start Date" />
              <DatetimePicker name="end" label="End Date" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <SelectController name="category" label="Category" options={options} />
              <GradientPicker name="color" label="Color" />
            </div>

            <AlertDialogFooter className="pt-2">
              <AlertDialogCancel onClick={() => handleEditCancellation()}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction type="submit">Save</AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
