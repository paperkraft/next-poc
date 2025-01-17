import EventCalendar from "@/components/_full-calendar/event-calendar";
import { EventsProvider } from "@/context/calendar-context";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Full Calendar",
    description: "Customize Calendar",
  };

export default function CalendarPage() {
  return (
    <EventsProvider>
      <EventCalendar/>
    </EventsProvider>
  );
}