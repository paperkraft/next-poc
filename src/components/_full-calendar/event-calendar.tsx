"use client";

import { useEvents } from "@/context/calendar-context";
import "@/styles/calendar.css";
import {
  DayCellContentArg,
  DayHeaderContentArg,
  EventChangeArg,
  EventClickArg,
  EventContentArg,
} from "@fullcalendar/core/index.js";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import listPlugin, { NoEventsContentArg } from "@fullcalendar/list";
import multiMonthPlugin from "@fullcalendar/multimonth";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import rrulePlugin from '@fullcalendar/rrule';

import { useRef, useState } from "react";
import CalendarNav from "./calendar-nav";
import { CalendarEvent } from "@/utils/calendar-data";
import { cn } from "@/lib/utils";
import { EventView } from "./event-view";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { FileX2Icon } from "lucide-react";
import { EventAddForm } from "./event-add-form";

type EventContentProps = {
  info: EventContentArg;
};

type HeaderContentProps = {
  info: DayHeaderContentArg;
};

type DayCellContentProps = {
  info: DayCellContentArg;
};

type NoEventsContentProps = {
  info: NoEventsContentArg;
};


export default function EventCalendar() {
  const { events, visibleCategories, setEventEditOpen, setEventViewOpen,  } = useEvents();
  const { selectedEvent, setSelectedOldEvent, setSelectedEvent, setIsDrag } = useEvents();
  const calendarRef = useRef<FullCalendar | null>(null);

  const { setEventAddOpen, setStartDate, setEndDate } = useEvents();
  

  const freq = ['monthly', 'weekly', 'daily'];
  const weekday = ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'];

  const handleDayClick = (info: DateClickArg) => {
    if(info.view.type !== 'dayGridMonth'){
      setStartDate(info.date);
      setEndDate(info.date);
      setEventAddOpen(true);
    }
  }

  const handleEventClick = (info: EventClickArg) => {

    let rrule;
    const ruleInfo = info.event?._def?.recurringDef?.typeData?.rruleSet?._rrule[0]?.origOptions;

    if (ruleInfo) {
      const { wkst, ...rest } = ruleInfo;
      rrule = {
        ...rest,
        freq: freq[rest.freq - 1],
        byweekday: weekday[rest?.byweekday?.weekday]
      }
    }

    const event: CalendarEvent = {
      id: info.event.id,
      title: info.event.title,
      description: info.event.extendedProps.description,
      category: info.event.extendedProps.category,
      backgroundColor: info.event.backgroundColor,
      start: info.event.start!,
      end: info.event.end!,
      allDay: info.event.allDay,
      rrule: rrule,
    };

    setIsDrag(false);
    setSelectedOldEvent(event);
    setSelectedEvent(event);
    setEventViewOpen(true);
  };

  const handleEventChange = (info: EventChangeArg) => {
    let rrule;
    const ruleInfo = info.event?._def?.recurringDef?.typeData?.rruleSet?._rrule[0]?.origOptions;

    if (ruleInfo) {
      const { wkst, ...rest } = ruleInfo;
      rrule = {
        ...rest,
        freq: freq[rest.freq - 1],
        byweekday: weekday[rest?.byweekday?.weekday]
      }
    }

    const event: CalendarEvent = {
      id: info.event.id,
      title: info.event.title,
      description: info.event.extendedProps.description,
      category: info.event.extendedProps.category,
      backgroundColor: info.event.backgroundColor,
      start: info.event.start!,
      end: info.event.end!,
      allDay: info.event.allDay,
      rrule: rrule,
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
      rrule: rrule,
    };

    setIsDrag(true);
    setSelectedOldEvent(oldEvent);
    setSelectedEvent(event);
    setEventEditOpen(true);
  };

  const RenderEventContent = ({ info }: EventContentProps) => {
    const { event, view, timeText } = info;
    const [left, right] = timeText.includes(" - ") ? timeText.split(" - ") : ["", ""];

    const isMonthView = view.type === "dayGridMonth";
    const isListWeekView = view.type === "listWeek";

    return (
      <>
        {
          // Day Grid Month View
          isMonthView &&
          <div style={{ backgroundColor: info.backgroundColor }}
            className={"w-full overflow-hidden rounded-md px-2 py-1 text-[0.5rem] sm:text-[0.6rem] md:text-xs"}
          >
            <p className="w-full font-semibold text-gray-950 line-clamp-1">{event.title}</p>
            <p className="text-gray-800">{left}</p>
            <p className="text-gray-800">{right}</p>
          </div>
        }

        {
          !isMonthView &&
          <div className={cn("w-full", {
            "space-y-0 text-xs overflow-hidden ": !isListWeekView,
          })}>
            <p className={cn("w-full text-gray-950 line-clamp-1", {
              "font-semibold": !isListWeekView
            })}>
              {event.title}
            </p>

            {
              // Time text for non-listWeek views
              !isListWeekView &&
              <p className="text-gray-800 line-clamp-1">{`${timeText}`}</p>
            }
            {
              // Description for listWeek view
              isListWeekView &&
              <p className="text-gray-500 text-sm line-clamp-1">{`${event.extendedProps.description}`}</p>
            }
          </div>
        }
      </>

    );
  };

  const RenderHeaderContent = ({ info }: HeaderContentProps) => {
    const [weekday] = info.text.split(" ");
    const formattedDate = info.date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    return (
      <>
        {/* Day Grid Month & Year */}
        {(info.view.type === "dayGridMonth" || info.view.type === 'multiMonthYear') && (
          <div className="p-1">
            <p>{weekday}</p>
          </div>
        )}

        {/* Time Grid Week View */}
        {info.view.type === "timeGridWeek" && (
          <div className="p-1">
            {info.isToday ? (
              <p className="font-semibold text-blue-500">
                {weekday} - {info.date.getDate()}
              </p>
            ) : (
              <p className="font-light">{weekday} - {info.date.getDate()}</p>
            )}
          </div>
        )}

        {/* Time Grid Day View */}
        {info.view.type === "timeGridDay" && (
          <div className="p-1">
            <p className="font-normal">{formattedDate}</p>
          </div>
        )}

        {/* List week View */}
        {info.view.type === "listWeek" && (
          <div className="flex justify-between font-normal">
            <p>{formattedDate}</p>
            <p>{weekday}</p>
          </div>
        )}
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

  const EmptyListContent = ({ info }: NoEventsContentProps) => {
    return (
      <div className="flex flex-col items-center space-y-2">
        <FileX2Icon className="size-10" />
        <p>{info.text}</p>
        <EventAddForm displayButton/>
      </div>
    )
  }

  const filteredEvents = events.filter((event) => visibleCategories.includes(event.category as string));

  return (
    <>
      <div className="rounded-lg shadow-xl border">
        <CalendarNav calendarRef={calendarRef}>
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

                showNonCurrentDates={false}
                fixedWeekCount={false}
                contentHeight={"auto"}

                noEventsContent={(eventInfo) => <EmptyListContent info={eventInfo} />}
                eventContent={(eventInfo) => <RenderEventContent info={eventInfo} />}
                dayCellContent={(dayInfo) => <RenderCellContent info={dayInfo} />}
                dayHeaderContent={(headerInfo) => <RenderHeaderContent info={headerInfo} />}
                eventClick={(eventInfo) => handleEventClick(eventInfo)}
                eventChange={(eventInfo) => handleEventChange(eventInfo)}
                dateClick={(dayInfo) => handleDayClick(dayInfo)}

                nowIndicator
                editable
                selectable
              />
              <ScrollBar orientation="vertical" className="z-50" />
            </ScrollArea>
          </div>
        </CalendarNav>
      </div>

      <EventView event={selectedEvent} />
    </>
  );
}