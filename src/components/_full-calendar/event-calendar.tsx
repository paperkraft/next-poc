"use client";

import { useEvents } from "@/context/calendar-context";
import "@/styles/calendar.css";
import {
  DateSelectArg,
  DayCellContentArg,
  DayHeaderContentArg,
  EventChangeArg,
  EventClickArg,
  EventContentArg,
} from "@fullcalendar/core/index.js";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import multiMonthPlugin from "@fullcalendar/multimonth";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import rrulePlugin from '@fullcalendar/rrule';

import { useRef, useState } from "react";
import CalendarNav from "./calendar-nav";
import { CalendarEvent } from "@/utils/calendar-data";
import { cn } from "@/lib/utils";
import { EventView } from "./event-view";
import { ScrollArea } from "../ui/scroll-area";

type EventContentProps = {
  info: EventContentArg;
};

type HeaderContentProps = {
  info: DayHeaderContentArg;
};

type DayCellContentProps = {
  info: DayCellContentArg;
};

export default function EventCalendar() {
  const { events, visibleCategories, setEventEditOpen, setEventViewOpen } = useEvents();
  const { selectedEvent, setSelectedOldEvent, setSelectedEvent, setIsDrag  } = useEvents();
  const calendarRef = useRef<FullCalendar | null>(null);
  const [selectedStart, setSelectedStart] = useState(new Date());
  const [selectedEnd, setSelectedEnd] = useState(new Date());
   
  const handleEventClick = (info: EventClickArg) => {

    const event: CalendarEvent = {
      id: info.event.id,
      title: info.event.title,
      description: info.event.extendedProps.description,
      category: info.event.extendedProps.category,
      backgroundColor: info.event.backgroundColor,
      start: info.event.start!,
      end: info.event.end!,
      allDay: info.event.allDay,
    };

    setIsDrag(false);
    setSelectedOldEvent(event);
    setSelectedEvent(event);
    setEventViewOpen(true);
  };

  const handleEventChange = (info: EventChangeArg) => {
    const event: CalendarEvent = {
      id: info.event.id,
      title: info.event.title,
      description: info.event.extendedProps.description,
      category: info.event.extendedProps.category,
      backgroundColor: info.event.backgroundColor,
      start: info.event.start!,
      end: info.event.end!,
      allDay: info.event.allDay,
    };

    const oldEvent: CalendarEvent = {
      id: info.oldEvent.id,
      title: info.oldEvent.title,
      description: info.oldEvent.extendedProps.description,
      category: info.oldEvent.extendedProps.category,
      backgroundColor: info.oldEvent.backgroundColor,
      start: info.oldEvent.start!,
      end: info.oldEvent.end!,
      allDay: info.oldEvent.allDay,
    };

    setIsDrag(true);
    setSelectedOldEvent(oldEvent);
    setSelectedEvent(event);
    setEventEditOpen(true);
  };

  const RenderEventContent = ({ info }: EventContentProps) => {
    const { event } = info;
    const [left, right] = info.timeText.split(" - ");

    return (
      <>
        {
          info.view.type == "dayGridMonth" &&
          <div className="overflow-hidden w-full">
            <div style={{ backgroundColor: info.backgroundColor }}
              className={`flex flex-col rounded-md w-full px-2 py-1 line-clamp-1 text-[0.5rem] sm:text-[0.6rem] md:text-xs`}
            >
              <p className="font-semibold text-gray-950 line-clamp-1 w-11/12">{event.title}</p>
              <p className="text-gray-800">{left}</p>
              <p className="text-gray-800">{right}</p>
            </div>
          </div>
        }

        {
          info.view.type !== "dayGridMonth" &&
          <div className={cn("w-full",{
            "flex flex-col space-y-0 text-xs overflow-hidden " : info.view.type !== "listWeek",
          })}>
            <p className={cn("w-full text-gray-950 line-clamp-1",{
              "font-semibold": info.view.type !== "listWeek"
            })}>
              {event.title}
            </p>
            {
              info.view.type !== "listWeek" &&
              <p className="text-gray-800 line-clamp-1">{`${info.timeText}`}</p>
            }
            {
              info.view.type == "listWeek" &&
              <p className="text-gray-500 text-sm line-clamp-1">{`${event.extendedProps.description}`}</p>
            }
          </div>
        }
      </>
       
    );
  };

  const RenderHeaderContent = ({ info }: HeaderContentProps) => {
    const [weekday] = info.text.split(" ");

    return (
      <>
        {
          info.view.type == "timeGridDay" && 
          <p className="font-normal">{info.date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}</p>
        }
        {
          info.view.type == "timeGridWeek" &&
          <div>
            {info.isToday ? ( 
              <p className="font-semibold text-blue-500">{weekday} - {info.date.getDate()}</p>
            ) : (
              <p className="font-light">{weekday} - {info.date.getDate()}</p>
            )}
          </div>
        }
        {
          info.view.type !== "timeGridDay" && info.view.type !== "timeGridWeek" &&
          <div className="flex justify-between font-normal">
            <p>{weekday}</p>
            <p className={cn({"hidden": info.view.type === "dayGridMonth"})}>
              {info.date.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        }
      </>
    );
  };

  const RenderCellContent = ({ info }: DayCellContentProps) => {
    return (
      <div className="flex">
        {info.view.type == "dayGridMonth" && info.isToday ? (
          <div className="flex h-7 w-7 rounded-full items-center justify-center text-sm border border-blue-600 text-blue-600">
            {info.dayNumberText}
          </div>
        ) : (
          <div className="flex h-7 w-7 rounded-full items-center justify-center text-sm">
            {info.dayNumberText}
          </div>
        )}
      </div>
    );
  };

  const handleDateSelect = (info: DateSelectArg) => {
    setSelectedStart(info.start);
    setSelectedEnd(info.end);
  };

  const filteredEvents = events.filter((event)=> visibleCategories.includes(event.category as string));

  return (
    <>
      <div className="rounded-lg shadow-xl border">
        <CalendarNav
          calendarRef={calendarRef}
          start={selectedStart}
          end={selectedEnd}
          viewedDate={new Date()}
        >
          <div className="border border-l-0">
            <ScrollArea className="h-[calc(100vh-175px)]">
              <FullCalendar
                ref={calendarRef}
                timeZone="local"
                plugins={[
                  dayGridPlugin,
                  timeGridPlugin, 
                  multiMonthPlugin,
                  interactionPlugin,
                  listPlugin,
                  rrulePlugin,
                ]}
                firstDay={1} // Monday
                initialView="dayGridMonth"
                events={filteredEvents}
                dayMaxEventRows={2}

                headerToolbar={false}
                slotMinTime={"09:00"} // 09:00
                slotMaxTime={"22:00"} // 22:00
                // allDaySlot={false}
                height={"32vh"}
                displayEventEnd={true}
                windowResizeDelay={0}
                // eventDisplay="list-item"

                slotLabelFormat={{
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                }}

                eventTimeFormat={{
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                }}

                // eventBorderColor={"black"}
                contentHeight={"auto"}
                // expandRows={false}
                eventContent={(eventInfo) => <RenderEventContent info={eventInfo} />}
                dayCellContent={(dayInfo) => <RenderCellContent info={dayInfo} />}
                dayHeaderContent={(headerInfo) => <RenderHeaderContent info={headerInfo} />}
                eventClick={(eventInfo) => handleEventClick(eventInfo)}
                eventChange={(eventInfo) => handleEventChange(eventInfo)}
                // select={handleDateSelect}
                // dateClick={() => setEventAddOpen(true)}
                nowIndicator
                editable
                selectable
              />
            </ScrollArea>
          </div>
        </CalendarNav>
      </div>

      <EventView event={selectedEvent} />
    </>
  );
}