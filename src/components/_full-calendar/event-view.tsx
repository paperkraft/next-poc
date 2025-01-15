'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CalendarEvent } from "@/utils/calendar-data";
import { useEvents } from "@/context/calendar-context";
import { CalendarIcon, ClockIcon, EditIcon, InfoIcon, Trash2 } from "lucide-react";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { toast } from "sonner";
import { EventEditForm } from "./event-edit-form";
import { Badge } from "../ui/badge";

interface EventViewProps {
  event?: CalendarEvent;
}

const formatDate = (date: Date | undefined) =>
  date?.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

const formatTime = (date: Date | undefined) =>
  date?.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });

export function EventView({ event }: EventViewProps) {
  const { eventViewOpen, setEventViewOpen, deleteEvent, setEventDeleteOpen, eventDeleteOpen, setEventEditOpen } = useEvents();
  const { selectedOldEvent, selectedEvent, isDrag } = useEvents();

  const isSameDate = event?.start!.getDate() === (event?.end && event?.end.getDate());

  const handleDelete = () => {
    if (event?.id) {
      deleteEvent(event.id);
      setEventDeleteOpen(false);
      toast.success("Event deleted!");
    }
  };

  return (
    <>
      <Sheet open={eventViewOpen} onOpenChange={setEventViewOpen}>
        <SheetContent className="[&>button]:hidden">
          <SheetHeader className="sticky">
            <SheetTitle className="flex justify-between items-center">
              <p className="text-balance font-medium text-base">{event?.title}</p>
              <div>
                <Button size={'icon'} variant={'ghost'} onClick={() => { setEventViewOpen(false); setEventDeleteOpen(true) }}>
                  <Trash2 className="size-4 text-red-500" />
                </Button>

                <Button size={'icon'} variant={'ghost'} onClick={() => { setEventViewOpen(false); setEventEditOpen(true) }}>
                  <EditIcon className="size-4" />
                </Button>
              </div>
            </SheetTitle>
          </SheetHeader>

          <Separator className="my-4" />

          <ScrollArea className="h-[calc(100vh-160px)]">
            <div className="space-y-4">
              <div>
                <Badge className="shadow-none text-black" style={{ background: event?.backgroundColor }}>{event?.category}</Badge>
                {
                  event?.allDay &&
                  <Badge variant={'outline'} className="shadow-none text-black ml-1">All day</Badge>
                }
              </div>

              <EventDetail icon={<CalendarIcon className="size-[18px]" />} content={formatDate(event?.start)} />
                {!isSameDate && event?.end && !event?.allDay && (
                  <EventDetail content={`to ${formatDate(event?.end)}`} />
                )}

              <EventDetail
                icon={<ClockIcon className="size-[18px]" />}
                content={`${formatTime(event?.start)}${event?.end ? ` - ${formatTime(event?.end)}` : ""}`}
              />
              <EventDetail icon={<InfoIcon className="size-[18px]" />} content={event?.description} />
            </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Delete Event Dialog */}

      <AlertDialog open={eventDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex flex-row justify-between items-center">
              <>Delete {event?.title}</>
            </AlertDialogTitle>
            Are you sure you want to delete this event?
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setEventDeleteOpen(false); }}>Cancel</AlertDialogCancel>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Event Dialog */}
      <EventEditForm oldEvent={selectedOldEvent} event={selectedEvent} isDrag={isDrag} displayButton={false} />
    </>
  );
}


interface EventDetailProps {
  icon?: React.ReactNode;
  content: string | undefined;
}

function EventDetail({ icon, content }: EventDetailProps) {
  if (!content) return null;
  return (
    <div className="flex gap-2 leading-tight">
      {icon && <span>{icon}</span>}
      <p>{content}</p>
    </div>
  );
}