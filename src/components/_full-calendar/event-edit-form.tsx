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

type EventEditFormValues = z.infer<typeof eventFormSchema>;

interface EventEditFormProps {
  oldEvent?: CalendarEvent;
  event?: CalendarEvent;
  isDrag: boolean;
  displayButton: boolean;
}

const options = categories.flatMap((category) => { return { label: category, value: category } })

export function EventEditForm({ oldEvent, event, isDrag, displayButton }: EventEditFormProps) {
  const { addEvent, deleteEvent,  eventEditOpen, setEventEditOpen, setEventViewOpen } = useEvents();

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
      category: event?.category,
      allDay: event?.allDay,
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
      allDay: data.allDay,
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
          <Button variant="ghost" size={'icon'} onClick={() => {setEventEditOpen(true);}}>
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
