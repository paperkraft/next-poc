"use client";

import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { calendarRef } from "./calendar-data";

export function generateDaysInMonth(daysInMonth: number) {
  const daysArray = [];

  for (let day = 1; day <= daysInMonth; day++) {
    daysArray.push({
      value: String(day),
      label: String(day),
    });
  }

  return daysArray;
}

export function goPrev(calendarRef: calendarRef) {
  const calendarApi = calendarRef.current!.getApi();
  calendarApi.prev();
}

export function goNext(calendarRef: calendarRef) {
  const calendarApi = calendarRef.current!.getApi();
  calendarApi.next();
}

export function goToday(calendarRef: calendarRef) {
  const calendarApi = calendarRef.current!.getApi();
  calendarApi.today();
}

export function handleDayChange(
  calendarRef: calendarRef,
  currentDate: Date,
  day: string
) {
  const calendarApi = calendarRef.current!.getApi();
  const newDate = currentDate.setDate(Number(day));
  calendarApi.gotoDate(newDate);
}

export function handleMonthChange(
  calendarRef: calendarRef,
  currentDate: Date,
  month: string
) {
  const calendarApi = calendarRef.current!.getApi();
  const newDate = new Date(currentDate);
  newDate.setMonth(Number(month));
  calendarApi.gotoDate(newDate);
}

export function handleYearChange(
  calendarRef: calendarRef,
  currentDate: Date,
  e: ChangeEvent<HTMLInputElement>
) {
  const calendarApi = calendarRef.current!.getApi();
  const newDate = currentDate.setFullYear(Number(e.target.value));
  calendarApi.gotoDate(newDate);
}

export function setView(calendarRef: calendarRef, viewName: string, setCurrentView: Dispatch<SetStateAction<string>>) {
  const calendarApi = calendarRef.current!.getApi();
  setCurrentView(viewName);
  calendarApi.changeView(viewName);
}

export function isMidnight(date: Date) {
  return date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0 && date.getMilliseconds() === 0;
}

export function addHour(date: Date): Date {
  const updatedDate = new Date(date);
  updatedDate.setHours(updatedDate.getHours() + 1);
  return updatedDate;
}

export function addNextDay(date: Date): Date {
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  nextDay.setHours(0, 0, 0, 0);
  return nextDay;
}
