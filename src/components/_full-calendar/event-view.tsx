'use client';

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetTitle,
} from "@/components/ui/sheet";
import { CalendarEvent } from "@/utils/calendar-data";
import { EventDeleteForm } from "./event-delete-form";
import { useEvents } from "@/context/calendar-context";
import { CalendarIcon, ClockIcon, EditIcon, InfoIcon } from "lucide-react";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";

interface EventViewProps {
  event?: CalendarEvent;
}

export function EventView({ event }: EventViewProps) {
  const { eventViewOpen, setEventViewOpen, setEventEditOpen } = useEvents();
  return (
    <>
      <Sheet open={eventViewOpen} onOpenChange={setEventViewOpen}>
        <SheetContent className="[&>button]:hidden">
          <SheetHeader className="sticky">
            <SheetTitle className="flex justify-between">
              <div className="flex gap-2">
                <div className="flex-shrink-0 size-5 rounded-full mt-0.5" style={{ backgroundColor: event?.backgroundColor }} />
                <p className="text-balance font-medium text-base">{event?.title}</p>
              </div>
              <div>
                <Button size={'icon'} variant={'ghost'} onClick={()=> {setEventViewOpen(false); setEventEditOpen(true)}}>
                  <EditIcon className="size-4" />
                </Button>
              </div>
            </SheetTitle>
          </SheetHeader>
          
          <Separator className="my-4"/>
          
          <ScrollArea className="h-[calc(100vh-160px)]">
            <div className="space-y-4">
              <div className="flex gap-2">
                <div><CalendarIcon className="size-[18px] mt-0.5" /></div>
                <div>
                  {event?.start.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>

              <div className="flex gap-2">
                <div><ClockIcon className="size-[18px] mt-0.5" /></div>
                <div>
                  {`${event?.start && event?.start.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })} - 
                    ${event?.end && event?.end.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}`}
                </div>
              </div>

              <div className="flex gap-2">
                <div><InfoIcon className="size-[18px] mt-0.5" /></div>
                <div>{event?.description}</div>
              </div>
            </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>

          <SheetFooter className="mt-auto">
            <EventDeleteForm id={event?.id} title={event?.title} />
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
