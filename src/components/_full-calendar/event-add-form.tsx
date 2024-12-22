"use client";

import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { PlusIcon } from "lucide-react";
import { RgbaStringColorPicker } from "react-colorful";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useEvents } from "@/context/calendar-context";
import { DateTimePicker } from "./date-picker";
import { toast } from "sonner";
import { InputController } from "../custom/form.control/InputController";
import { TextareaController } from "../custom/form.control/TextareaController";

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
    .min(1, { message: "Must provide a title for this event." })
});

type EventAddFormValues = z.infer<typeof eventAddFormSchema>;

interface EventAddFormProps {
  start: Date;
  end: Date;
}

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
      start: start,
      end: end,
      color: "#76c7ef"
    });
  }, [form, start, end]);

  async function onSubmit(data: EventAddFormValues) {
    const newEvent = {
      id: String(events.length + 1),
      title: data.title,
      description: data.description,
      start: data.start,
      end: data.end,
      color: data.color
    };
    addEvent(newEvent);
    setEventAddOpen(false);
    toast.success("Event added");
  }

  return (
    <>
      <Sheet open={eventAddOpen}>
        <SheetTrigger asChild>
          <Button onClick={() => setEventAddOpen(true)} className="w-full">
            <PlusIcon className="md:h-5 md:w-5 h-3 w-3" />
            <p>Add Event</p>
          </Button>
        </SheetTrigger>

        <SheetContent className="[&>button]:hidden">
          <SheetHeader>
            <SheetTitle>Add Event</SheetTitle>
            <SheetDescription>Below event will get add</SheetDescription>
          </SheetHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

              <InputController name="title" label="Title" placeholder="Title" />
              <TextareaController name="description" label="Description" placeholder="Description" />


              <FormField
                control={form.control}
                name="start"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel htmlFor="datetime">Start</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        value={field.value}
                        onChange={field.onChange}
                        hourCycle={12}
                        granularity="minute"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel htmlFor="datetime">End</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        value={field.value}
                        onChange={field.onChange}
                        hourCycle={12}
                        granularity="minute"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />


              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <RgbaStringColorPicker
                        className="flex"
                        color={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2 mt-10">
                <Button onClick={(e) => { e.preventDefault(); setEventAddOpen(false) }}>Cancel</Button>
                <Button type="submit">Add Event</Button>
              </div>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </>
  );
}
