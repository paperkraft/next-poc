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

type EventAddFormValues = z.infer<typeof eventFormSchema>;

interface EventAddFormProps {
  start: Date;
  end: Date;
  onClick?: () => void;
}

const options = categories.flatMap((category) => { return { label: category, value: category } });

export function EventAddForm({ start, end, onClick }: EventAddFormProps) {
  const { events, addEvent, eventAddOpen, setEventAddOpen } = useEvents();

  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema)
  });

  useEffect(() => {
    form.reset({
      id:"",
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
          <Button onClick={() => {setEventAddOpen(true); onClick && onClick()}} className="w-full">
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
                <SelectController name="category" label="Category" options={options} />
                <GradientPicker name="color" label="Color" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <DatetimePicker name="start" label="Start Date" />
                <DatetimePicker name="end" label="End Date" />
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