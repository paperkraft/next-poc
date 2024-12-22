"use client";

import { calendarRef } from "@/utils/calendar-data";
import { Button } from "@/components/ui/button";
import { goNext, goPrev, goToday, setView } from "@/utils/calendar-utils";
import { ReactNode, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventAddForm } from "./event-add-form";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { Form, FormField } from "../ui/form";

interface CalendarNavProps {
  calendarRef: calendarRef;
  start: Date;
  end: Date;
  viewedDate: Date;
  children: ReactNode;
}

const TABS = [
  { value: "dayGridMonth", label: "Month" },
  { value: "timeGridWeek", label: "Week" },
  { value: "timeGridDay", label: "Day" },
  { value: "listWeek", label: "List" },
];

export default function CalendarNav({ calendarRef, start, end, children }: CalendarNavProps) {

  const [currentView, setCurrentView] = useState("dayGridMonth");
  const [title, setTitle] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const getTitle = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi() as any;
      const date = calendarApi.getDate();
      const title = calendarApi.currentData.viewTitle
      setTitle(title);
      setCurrentDate(date);
    }
  }

  useEffect(() => {
    getTitle()
  }, []);

  const handleTabClick = (value: string) => {
    setView(calendarRef, value, setCurrentView);
    getTitle();
  };

  const getClassName = (value: string) => `space-x-1 ${currentView === value ? "w-1/2" : "w-1/4"}`;

  const getButtonLabel = (view: string) => {
    const labels: Record<string, string> = {
      dayGridMonth: "This Month",
      timeGridWeek: "This Week",
      timeGridDay: "Today",
      listWeek: "Today",
    };
    return labels[view] || "View";
  };

  const isTodayInCurrentView = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const currentDate = calendarApi.getDate();
      const today = new Date();
  
      // Define start and end of the current view
      let startOfCurrentView, endOfCurrentView;
  
      if (currentView === "timeGridWeek") {
        const dayOfWeek = currentDate.getDay();
        const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        startOfCurrentView = new Date(currentDate);
        startOfCurrentView.setDate(currentDate.getDate() - diffToMonday);
        endOfCurrentView = new Date(startOfCurrentView);
        endOfCurrentView.setDate(startOfCurrentView.getDate() + 6);
  
      } else if (currentView === "dayGridMonth") {
        startOfCurrentView = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        endOfCurrentView = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
      } else if (currentView === "timeGridDay" || currentView === "listWeek") {
        return currentDate.toDateString() === today.toDateString();
      }
  
      // Check if today is within the start and end of the current view
      const isTodayInRange = today >= startOfCurrentView! && today <= endOfCurrentView!;
  
      // Special check for 'timeGridWeek' view to confirm it is the current week
      if (currentView === "timeGridWeek") {
        const currentWeekStart = startOfCurrentView!.toDateString();
        const currentWeekEnd = endOfCurrentView!.toDateString();
  
        const thisWeekStart = new Date(today);
        thisWeekStart.setDate(today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1));
        const thisWeekEnd = new Date(thisWeekStart);
        thisWeekEnd.setDate(thisWeekStart.getDate() + 6);
  
        if (currentWeekStart === thisWeekStart.toDateString() && currentWeekEnd === thisWeekEnd.toDateString()) {
          return true;
        }
      }
  
      return isTodayInRange;
    }
  
    return false;
  };
  
  const handleGoToDate = (date: Date) => {
    if (!date) return;
    calendarRef.current!.getApi().gotoDate(date);
    getTitle();
  };

  return (
    <>
      <div className="flex">
        <div className="hidden md:flex flex-col">
          <div className="p-4 max-h-20">
            <EventAddForm start={start} end={end} />
          </div>

          <div className={cn("border-y")}>
            <Calendar
              mode="single"
              weekStartsOn={1}
              classNames={{
                today: "bg-green-500 text-white",
              }}

              month={currentDate}
              selected={start}

              onNextClick={() => {
                goNext(calendarRef);
                getTitle();
              }}
              onPrevClick={() => {
                goPrev(calendarRef);
                getTitle();
              }}

              onMonthChange={(month) => {
                handleGoToDate(month as Date)
              }}

            // onSelect={(date)=> handleGoToDate(date as Date)}
            />
          </div>

          <div className="p-2 space-y-3">
            <h1>Events</h1>
          </div>
        </div>

        <div className="w-full border-l">
          <div className="w-full flex justify-between p-2 md:p-4 max-h-20">
            <div className="flex items-center">
              <Button variant="ghost" className="w-8" onClick={() => { goPrev(calendarRef); getTitle() }}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <p className="select-none text-sm md:text-base">{title}</p>
              <Button variant="ghost" className="w-8" onClick={() => { goNext(calendarRef); getTitle() }}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="hidden md:block select-none">
              <Button variant="outline" onClick={() => { goToday(calendarRef); getTitle(); }}
                disabled={isTodayInCurrentView()}
                className={cn({ "hidden": isTodayInCurrentView() })}
              >
                {getButtonLabel(currentView)}
              </Button>
            </div>

            <Tabs defaultValue="dayGridMonth">
              <TabsList className="flex text-xs md:text-sm">
                {TABS.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    onClick={() => handleTabClick(tab.value)}
                    className={getClassName(tab.value)}
                  >
                    <p>{tab.label}</p>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {children}
        </div>
      </div>
    </>
  );
}