"use client";

import { calendarRef, categories } from "@/utils/calendar-data";
import { Button } from "@/components/ui/button";
import { memo, ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventAddForm } from "./event-add-form";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { useEvents } from "@/context/calendar-context";
import { Checkbox } from "../ui/checkbox";

interface CalendarNavProps {
  calendarRef: calendarRef;
  children: ReactNode;
}

const TABS = [
  { value: "dayGridMonth", label: "Month" },
  { value: "timeGridWeek", label: "Week" },
  { value: "timeGridDay", label: "Day" },
  { value: "listWeek", label: "List" },
  { value: "multiMonthYear", label: "Year" },
];

const CalendarNav = memo(({ calendarRef, children }: CalendarNavProps) => {
  const { filterEvent, visibleCategories, setEventAddOpen, setStartDate, setEndDate, setCurrentView, currentView } = useEvents();
  const [title, setTitle] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [allCategoriesVisible, setAllCategoriesVisible] = useState(true);
  const isUpdatingRef = useRef(false);

  const updateTitleAndDate = useCallback(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi() as any;
      setTitle(calendarApi.currentData.viewTitle);
      setCurrentDate(new Date(calendarApi.currentData.currentDate));
    }
  }, [calendarRef]);

  useEffect(() => {
    if (!isUpdatingRef.current) updateTitleAndDate();
    isUpdatingRef.current = false;
  }, [currentView, updateTitleAndDate]);

  const handleTabClick = (view: string) => {
    setCurrentView(view)
    calendarRef.current?.getApi().changeView(view);
    updateTitleAndDate();
  };

  const isTodayInCurrentView = useCallback(() => {
    if (!calendarRef.current) return false;
    const calendarApi = calendarRef.current.getApi();
    const today = new Date();

    const normalizeDate = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayNormalized = normalizeDate(today);
    const currentDateNormalized = normalizeDate(calendarApi.getDate());

    const viewRanges: Record<string, [Date, Date]> = {
      dayGridMonth: [
        new Date(currentDateNormalized.getFullYear(), currentDateNormalized.getMonth(), 1),
        new Date(currentDateNormalized.getFullYear(), currentDateNormalized.getMonth() + 1, 0),
      ],
      timeGridWeek: [
        new Date(currentDateNormalized.setDate(currentDateNormalized.getDate() - currentDateNormalized.getDay())),
        new Date(currentDateNormalized.setDate(currentDateNormalized.getDate() + 6)),
      ],
      timeGridDay: [currentDateNormalized, currentDateNormalized],
      multiMonthYear: [
        new Date(currentDateNormalized.getFullYear(), 0, 1),
        new Date(currentDateNormalized.getFullYear(), 11, 31),
      ],
    };

    const [start, end] = viewRanges[currentView] || [null, null];
    return todayNormalized >= (start || today) && todayNormalized <= (end || today);
  }, [calendarRef, currentView]);

  const toggleCategoriesVisibility = () => {
    const visibility = !allCategoriesVisible;
    setAllCategoriesVisible(visibility);
    categories.forEach((category) => filterEvent(category, visibility));
  };

  const handleNavigation = useCallback(
    (direction: "next" | "prev") => {
      if (calendarRef.current) {
        isUpdatingRef.current = true;
        calendarRef.current.getApi()[direction]();
        updateTitleAndDate();
      }
    },
    [calendarRef, updateTitleAndDate]
  );

  const handleGoToday = useCallback(() => {
    if (calendarRef.current) {
      calendarRef.current!.getApi().today()
      updateTitleAndDate();
    }
  }, [calendarRef, updateTitleAndDate]);

  return (
    <>
      <div className="flex">
        <div className="hidden md:block">
          <div className="p-4 max-h-20">
            <EventAddForm displayButton onClick={() => { setStartDate(new Date()); setEndDate(new Date()) }} />
          </div>

          <div className={cn("border-y")}>
            <Calendar
              mode="single"
              classNames={{
                today: "bg-green-500 text-white",
                weekday: "first:text-red-500 text-muted-foreground w-8 font-normal text-[0.8rem]",
                selected: "bg-accent hover:!bg-accent has-[button]:hover:aria-selected:!bg-accent"
              }}
              modifiers={{ sunday: { dayOfWeek: [0] } }}
              modifiersClassNames={{
                sunday: "text-red-500 !opacity-100 [&_button]:!opacity-100 hover:!text-red-500"
              }}
              disabled={{ dayOfWeek: [0] }}
              month={currentDate}
              selected={selectedDate}
              showOutsideDays={false}
              onMonthChange={(date) => {
                calendarRef.current?.getApi().gotoDate(date);
                updateTitleAndDate();
              }}
              onDayClick={(date) => {
                setStartDate(new Date(date));
                setEndDate(new Date(date));
                setEventAddOpen(true);
                setSelectedDate(new Date(date));
              }}
            />
          </div>

          <div className="p-4 space-y-3">
            <div className="flex justify-between items-center">
              <p>Categories</p>
              <p className="text-xs cursor-pointer select-none" onClick={toggleCategoriesVisibility}>
                {allCategoriesVisible ? 'Hide All' : 'Show All'}
              </p>
            </div>
            {categories.map((category, idx) => (
              <div key={category} className="flex items-center space-x-2 p-0.5">
                <Checkbox
                  id={category}
                  checked={visibleCategories.includes(category)}
                  onCheckedChange={(checked) => filterEvent(category, !!checked)}
                  className={"data-[state=checked]:bg-sky-500 data-[state=checked]:text-primary-foreground data-[state=checked]:border-0 border-gray-400 shadow-none"}
                />
                <label htmlFor={category} className="cursor-pointer select-none leading-tight">
                  {category}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full border-l">
          <div className="w-full flex flex-col md:flex-row justify-between p-2 md:p-4 md:max-h-20">
            <div className="flex items-center">
              <Button variant="ghost" size={'icon'} onClick={() => handleNavigation("prev")}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size={'icon'} onClick={() => handleNavigation("next")}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <p className="select-none text-sm md:text-base ml-2">{title}</p>
            </div>

            <div className="hidden md:block select-none">
              <Button variant="outline" onClick={handleGoToday}
                disabled={new Date().toDateString() === currentDate.toDateString()}
                className={cn({ "hidden": isTodayInCurrentView() })}
                aria-label="Go to today's date"
                title="Go to today's date"
              >
                Today
              </Button>
            </div>

            <Tabs value={currentView}>
              <TabsList className="flex text-xs md:text-sm">
                {TABS.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    onClick={() => handleTabClick(tab.value)}
                    className={`space-x-1 ${currentView === tab.value ? "w-1/2" : "w-1/4"}`}
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
})

export default CalendarNav;