"use client";
import { CalendarEvent, categories, initialEvents, RRule } from "@/utils/calendar-data";
import React, { createContext, ReactNode, useContext, useState } from "react";

interface Event {
  id: string;
  title: string;
  description: string;
  start: Date | undefined;
  end: Date | undefined;
  color: string;
  category?: string;
  rrule?: RRule | undefined;
}

interface EventsContextType {
  events: CalendarEvent[];
  addEvent: (event: Event) => void;
  deleteEvent: (id: string) => void;
  filterEvent: (category: string, visible: boolean) => void;
  eventViewOpen: boolean;
  setEventViewOpen: (value: boolean) => void;
  eventAddOpen: boolean;
  setEventAddOpen: (value: boolean) => void;
  eventEditOpen: boolean;
  setEventEditOpen: (value: boolean) => void;
  eventDeleteOpen: boolean;
  setEventDeleteOpen: (value: boolean) => void;
  availabilityCheckerEventAddOpen: boolean;
  setAvailabilityCheckerEventAddOpen: (value: boolean) => void;
  visibleCategories: string[];

  selectedOldEvent: CalendarEvent | undefined;
  setSelectedOldEvent: (event:CalendarEvent | undefined) => void;
  selectedEvent: CalendarEvent | undefined;
  setSelectedEvent: (event:CalendarEvent | undefined) => void;

  setIsDrag: (value: boolean) => void;
  isDrag: boolean;

  start: Date | undefined;
  setStartDate:(value: Date | undefined) => void;
  end: Date | undefined;
  setEndDate:(value: Date | undefined) => void;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error("useEvents must be used within an EventsProvider");
  }
  return context;
};

export const EventsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents.map((event) => ({ ...event, id: String(event.id), color: event.backgroundColor })));
  const [eventViewOpen, setEventViewOpen] = useState(false);
  const [eventAddOpen, setEventAddOpen] = useState(false);
  const [eventEditOpen, setEventEditOpen] = useState(false);
  const [eventDeleteOpen, setEventDeleteOpen] = useState(false);
  const [availabilityCheckerEventAddOpen, setAvailabilityCheckerEventAddOpen] = useState(false);

  const [selectedOldEvent, setSelectedOldEvent] = useState<CalendarEvent | undefined>();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>();
  const [isDrag, setIsDrag] = useState(false);

  const [ start, setStartDate] = useState<Date | undefined>();
  const [ end, setEndDate] = useState<Date | undefined>();

  const [visibleCategories, setVisibleCategories] = useState<string[]>(categories);

  const addEvent = (event: CalendarEvent) => {
    setEvents((prevEvents) => [...prevEvents, event]);
  };

  const deleteEvent = (id: string) => {
    setEvents((prevEvents) =>
      prevEvents.filter((event) => Number(event.id) !== Number(id))
    );
    setEventDeleteOpen(false);
  };

  const filterEvent = (category: string, visible: boolean) => {
    if (visible) {
      setVisibleCategories((prevCategories) => [...prevCategories, category]);
    } else {
      setVisibleCategories((prevCategories) => prevCategories.filter((cat) => cat !== category));
    }
  };

  return (
    <EventsContext.Provider
      value={{
        events,
        addEvent,
        deleteEvent,
        filterEvent,
        eventViewOpen,
        setEventViewOpen,
        eventAddOpen,
        setEventAddOpen,
        eventEditOpen,
        setEventEditOpen,
        eventDeleteOpen,
        setEventDeleteOpen,
        availabilityCheckerEventAddOpen,
        setAvailabilityCheckerEventAddOpen,
        visibleCategories,

        selectedOldEvent,
        setSelectedOldEvent,
        selectedEvent,
        setSelectedEvent,
        setIsDrag,
        isDrag,

        start,
        setStartDate,
        end,
        setEndDate
      }}
    >
      {children}
    </EventsContext.Provider>
  );
};
