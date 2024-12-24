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
import { AlertDialogAction, AlertDialogCancel } from "@radix-ui/react-alert-dialog";

const eventAddFormSchema = z.object({
  title: z
    .string({ required_error: "Please enter a title." })
    .min(1, { message: "Must provide a title for this event." }),
  description: z
    .string({ required_error: "Please enter a description." })
    .min(1, { message: "Must provide a description for this event." }),
  start: z.date({
    required_error: "Please select a start time",
    invalid_type_error: "That's not a date!"
  }),
  end: z.date({
    required_error: "Please select an end time",
    invalid_type_error: "That's not a date!"
  }),
  color: z
    .string({ required_error: "Please select an event color." })
    .min(1, { message: "Must provide a title for this event." }),
  category: z
    .string({ required_error: "Please select an event category." })
    .min(1, { message: "Must provide a category for this event." }).optional(),
});

type EventAddFormValues = z.infer<typeof eventAddFormSchema>;

interface EventAddFormProps {
  start: Date;
  end: Date;
}



const options = [
  { label: "Meeting", value: "Meeting" },
  { label: "Holiday", value: "Holiday" },
  { label: "Birthday", value: "Birthday" },
  { label: "Conference", value: "Conference" },
]

export function EventAddForm({ start, end }: EventAddFormProps) {
  const { events, addEvent } = useEvents();
  const { eventAddOpen, setEventAddOpen } = useEvents();

  const form = useForm<z.infer<typeof eventAddFormSchema>>({
    resolver: zodResolver(eventAddFormSchema)
  });

  useEffect(() => {
    form.reset({
      title: "",
      description: "",
      category: "",
      start: start,
      end: end,
      color: "#B9FBC0"
    });
  }, [form, start, end]);

  async function onSubmit(data: EventAddFormValues) {
    const newEvent = {
      id: String(events.length + 1),
      title: data.title,
      description: data.description,
      start: data.start,
      end: data.end,
      color: data.color,
      category: data.category,
    };
    addEvent(newEvent);
    setEventAddOpen(false);
    toast.success("Event added");
    form.reset();
  }

  return (
    <>
      <AlertDialog open={eventAddOpen}>
        <AlertDialogTrigger asChild>
          <Button onClick={() => setEventAddOpen(true)} className="w-full">
            <PlusIcon className="md:h-5 md:w-5 h-3 w-3" />
            <p>Add Event</p>
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add Event</AlertDialogTitle>
          </AlertDialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <InputController name="title" label="Title" placeholder="Title" />
              <TextareaController name="description" label="Description" placeholder="Description" />

              <div className="grid grid-cols-2 gap-2">
                <DatetimePicker name="start" label="Start Date" />
                <DatetimePicker name="end" label="End Date" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <SelectController name="category" label="Category" options={options} />
                <GradientPicker name="color" label="Color" />
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