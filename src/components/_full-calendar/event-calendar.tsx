"use client";

import "@/styles/calendar.css";
import { useEvents } from "@/context/calendar-context";
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
import listPlugin, { NoEventsContentArg } from "@fullcalendar/list";
import multiMonthPlugin from "@fullcalendar/multimonth";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import rrulePlugin from '@fullcalendar/rrule';

import { useRef } from "react";
import { CalendarEvent } from "@/utils/calendar-data";
import { cn } from "@/lib/utils";
import { EventView } from "./event-view";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { CalendarX } from "lucide-react";
import { EventAddForm } from "./event-add-form";
import CalendarNav from "./calendar-nav";

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

const freq = ['monthly', 'weekly', 'daily'];
const weekday = ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'];

export default function EventCalendar() {
  const calendarRef = useRef<FullCalendar | null>(null);

  const { events, visibleCategories, setEventEditOpen, setEventViewOpen, } = useEvents();
  const { selectedEvent, setSelectedEvent, setSelectedOldEvent, setIsDrag } = useEvents();
  const { setEventAddOpen, setStartDate, setEndDate, setCurrentView } = useEvents();


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
    // const [left, right] = timeText.includes(" - ") ? timeText.split(" - ") : ["", ""];

    const isMonthView = view.type === "dayGridMonth";
    const isListWeekView = view.type === "listWeek";

    return (
      <>
        {
          // Day Grid Month View
          isMonthView &&
          <div style={{ backgroundColor: info.backgroundColor }}
            className={"w-full leading-tight rounded p-2 text-[0.5rem] sm:text-[0.6rem] md:text-xs"}
          >
            <p className="w-full font-semibold text-gray-950 truncate">{event.title}</p>
            <p className="text-gray-800 truncate">{`${timeText}`}</p>
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
          <div className="p-1 select-none">
            <p>{weekday}</p>
          </div>
        )}

        {/* Time Grid Week View */}
        {info.view.type === "timeGridWeek" && (
          <div className="p-1 select-none">
            <p className={cn({ "font-semibold text-blue-500": info.isToday })}>
              {weekday} - {info.date.getDate()}
            </p>
          </div>
        )}

        {/* Time Grid Day View */}
        {info.view.type === "timeGridDay" && (
          <div className="p-1">
            <p>{formattedDate}</p>
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
        <CalendarX className="size-10" />
        <p>{info.text}</p>
        <EventAddForm displayButton onClick={() => { setStartDate(new Date()); setEndDate(new Date()) }} />
      </div>
    )
  }

  const handleDateSelect = (info: DateSelectArg) => {
    if (info.view.type !== 'dayGridMonth') {
      setStartDate(info.start);
      setEndDate(info.end);
      setEventAddOpen(true);
    }
  };

  const handleNavDayClick = (date: Date) => {
    const calendarApi = calendarRef.current!.getApi();
    calendarApi.gotoDate(date);
    calendarApi.changeView("timeGridDay");
    setCurrentView("timeGridDay");
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

                // firstDay={1} // Monday
                initialView="dayGridMonth"
                headerToolbar={false}
                events={filteredEvents}
                dayMaxEvents={1}

                slotMinTime={"09:00"} // 09:00
                slotMaxTime={"22:00"} // 22:00

                height={"32vh"}
                windowResizeDelay={0}

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

                contentHeight={'auto'}
                showNonCurrentDates={false}
                fixedWeekCount={false}

                noEventsContent={(eventInfo) => <EmptyListContent info={eventInfo} />}
                eventContent={(eventInfo) => <RenderEventContent info={eventInfo} />}
                dayCellContent={(dayInfo) => <RenderCellContent info={dayInfo} />}
                dayHeaderContent={(headerInfo) => <RenderHeaderContent info={headerInfo} />}
                eventClick={(eventInfo) => handleEventClick(eventInfo)}
                eventChange={(eventInfo) => handleEventChange(eventInfo)}
                navLinkDayClick={(date) => handleNavDayClick(date)}
                select={handleDateSelect}

                navLinks
                stickyHeaderDates
                displayEventEnd
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