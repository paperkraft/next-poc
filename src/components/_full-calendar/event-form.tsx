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
import { CalendarEvent, categories } from "@/utils/calendar-data";
import { Button } from "../ui/button";
import { EditIcon, PlusIcon } from "lucide-react";
import { InputController } from "../custom/form.control/InputController";
import { TextareaController } from "../custom/form.control/TextareaController";
import { DatetimePicker } from "../custom/form.control/date-time";
import { SelectController } from "../custom/form.control/SelectController";
import { toast } from "sonner";
import { GradientPicker } from "../custom/form.control/gradient-picker";
import { eventFormSchema } from "./event-schema";
import { cn } from "@/lib/utils";

type EventEditFormValues = z.infer<typeof eventFormSchema>;

interface EventEditFormProps {
    event?: CalendarEvent;
    oldEvent?: CalendarEvent;
    isDrag?: boolean;
    start?: Date;
    end?: Date;
    onClick?: () => void;
    displayButton?: boolean;
}

const options = categories.map((category) => { return { label: category, value: category } });

export function EventForm({ start, end, onClick, oldEvent, event, isDrag, displayButton }: EventEditFormProps) {
    const { events, open, setOpen, addEvent, deleteEvent, isNew, setIsNew } = useEvents();

    const form = useForm<z.infer<typeof eventFormSchema>>({
        resolver: zodResolver(eventFormSchema),
    });

    const handleEditCancellation = () => {
        if (isDrag && oldEvent && !isNew) {
            const resetEvent = {
                id: oldEvent.id,
                title: oldEvent.title,
                description: oldEvent.description,
                start: oldEvent.start,
                end: oldEvent.end,
                color: oldEvent.backgroundColor!,
                category: oldEvent.category
            };

            deleteEvent(oldEvent.id);
            addEvent(resetEvent);
        }
        setOpen(false);
        setIsNew(true);
        form.reset();
    };

    useEffect(() => {
        console.log("event", event);
        
        if (isNew && start && end && event === undefined) {
            console.log('New Event');
            console.log('start', start);
            console.log('end', end);

            form.setValue("id", String(events.length + 1));
            form.setValue("title", "");
            form.setValue("description", "");
            form.setValue("category", "");
            form.setValue("start", start);
            form.setValue("end", end);
            form.setValue("color", "#B9FBC0");
        } 
        if(!isNew && event !== undefined) {
            console.log('Update Event')
            form.reset({
                id: event?.id,
                title: event?.title,
                description: event?.description,
                start: event?.start as Date,
                end: event?.end as Date,
                color: event?.backgroundColor,
                category: event?.category
            });
        }
        
    }, [form, isNew, start, end, event]);

    // console.log(form.formState.errors)

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

        // deleteEvent(data.id);
        addEvent(newEvent);
        setOpen(false);
        setIsNew(true);
        toast.success(isNew ? "Event Added" : "Event Edited");
    }

    const handleClicked = () => {
        setIsNew(true);
        onClick && onClick();
    }

    return (
        <AlertDialog open={open}>
            {displayButton && (
                <AlertDialogTrigger asChild>
                    <Button className="w-full" onClick={() => { setOpen(true); handleClicked() }}>
                        <PlusIcon className="md:h-5 md:w-5 h-3 w-3" />
                        <p>Add Event</p>
                    </Button>
                </AlertDialogTrigger>
            )}

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {isNew ? "Add Event" : `Edit: ${event?.title}`}
                    </AlertDialogTitle>
                </AlertDialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                            <AlertDialogCancel onClick={() => { setOpen(false); }}>Cancel</AlertDialogCancel>
                            <AlertDialogAction type="submit">{isNew ? "Add" : "Save"}</AlertDialogAction>
                        </AlertDialogFooter>
                    </form>
                </Form>
            </AlertDialogContent>
        </AlertDialog>
    );
}
