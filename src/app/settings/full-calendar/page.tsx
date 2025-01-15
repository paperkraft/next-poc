import EventCalendar from "@/components/_full-calendar/event-calendar";
import { EventsProvider } from "@/context/calendar-context";

export default function CalendarPage() {
  return (
    <EventsProvider>
      <EventCalendar/>
    </EventsProvider>
  );
}