"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useEvents } from "@/context/calendar-context";
import { toast } from "sonner";

interface EventDeleteFormProps {
  id?: string;
  title?: string;
}

export function EventDeleteForm({ id, title }: EventDeleteFormProps) {
  const { deleteEvent } = useEvents();
  const { eventDeleteOpen, setEventDeleteOpen, setEventViewOpen } = useEvents();

  async function onSubmit() {
    deleteEvent(id!);
    setEventDeleteOpen(false);
    // setEventViewOpen(false);
    toast.success("Event deleted!");
  }

  return (
    <AlertDialog open={eventDeleteOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" onClick={() => { setEventDeleteOpen(true);}}>
          Delete Event
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex flex-row justify-between items-center">
            <h1>Delete {title}</h1>
          </AlertDialogTitle>
          Are you sure you want to delete this event?
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => {setEventDeleteOpen(false);}}>
            Cancel
          </AlertDialogCancel>
          <Button variant="destructive" onClick={() => onSubmit()}>
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
