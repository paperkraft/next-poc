"use client";
import { CalendarEvent, categories, initialEvents } from "@/utils/calendar-data";
import React, { createContext, ReactNode, useContext, useState } from "react";

interface Event {
  id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  color: string;
  category?: string;

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
  setOpen: (value: boolean) => void;
  open: boolean;
  setIsNew: (value: boolean) => void;
  isNew: boolean;
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
  const [open, setOpen] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [eventViewOpen, setEventViewOpen] = useState(false);
  const [eventAddOpen, setEventAddOpen] = useState(false);
  const [eventEditOpen, setEventEditOpen] = useState(false);
  const [eventDeleteOpen, setEventDeleteOpen] = useState(false);
  const [availabilityCheckerEventAddOpen, setAvailabilityCheckerEventAddOpen] = useState(false);

  const [visibleCategories, setVisibleCategories] = useState<string[]>(categories);

  const addEvent = (event: CalendarEvent) => {
    setEvents((prevEvents) => [...prevEvents, event]);
    setOpen(false);
    setIsNew(true);
  };

  const deleteEvent = (id: string) => {
    setEvents((prevEvents) =>
      prevEvents.filter((event) => Number(event.id) !== Number(id))
    );
    setEventDeleteOpen(false);
    setIsNew(true);
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
        setOpen,
        open,
        isNew,
        setIsNew
      }}
    >
      {children}
    </EventsContext.Provider>
  );
};
