import { EventInput } from "@fullcalendar/core/index.js";
import dayjs from "dayjs";
import { TimeSheet } from "../types/timeSheet";
import { SessionDate, TimeSheetStatus } from "../constants/enum";
import _ from "lodash";

export const formatDateTime = (
  date: number,
  month: number,
  year: number
): string => {
  const dateStr = date < 10 ? `0${date}` : date.toString();
  const monthStr = month < 10 ? `0${month}` : month.toString();
  const yearStr = year.toString();

  return `${yearStr}-${monthStr}-${dateStr}`;
};

export const dateHelper = {
  dateToString: {
    toString: (date: Date) => {
      const dateStr =
        date.getDate() < 10 ? `0${date.getDate()}` : date.getDate().toString();
      const monthStr =
        date.getMonth() < 10
          ? `0${date.getMonth() + 1}`
          : (date.getMonth() + 1).toString();
      const yearStr = date.getFullYear().toString();

      return `${yearStr}-${monthStr}-${dateStr}`;
    },

    isSame: (date1: string, date2: string) => {
      const [year1, month1, day1] = date1.split("-").map(Number);
      const [year2, month2, day2] = date2.split("-").map(Number);

      return year1 === year2 && month1 === month2 && day1 === day2;
    },

    isBefore: (date1: string, date2: string) => {
      const [year1, month1, day1] = date1.split("-").map(Number);
      const [year2, month2, day2] = date2.split("-").map(Number);

      if (year1 < year2) {
        return true;
      } else if (year1 === year2) {
        if (month1 < month2) {
          return true;
        } else if (month1 === month2) {
          if (day1 < day2) {
            return true;
          }
        }
      }

      return false;
    },

    isAfter: (date1: string, date2: string) => {
      const [year1, month1, day1] = date1.split("-").map(Number);
      const [year2, month2, day2] = date2.split("-").map(Number);

      if (year1 > year2) {
        return true;
      } else if (year1 === year2) {
        if (month1 > month2) {
          return true;
        } else if (month1 === month2) {
          if (day1 > day2) {
            return true;
          }
        }
      }

      return false;
    },

    isWeekend: (date: string) => {
      const [year, month, day] = date.split("-").map(Number);
      const dateObj = new Date(year, month - 1, day);
      const dayOfWeek = dateObj.getDay();

      return dayOfWeek === 6 || dayOfWeek === 0;
    },
  },
};

export const strToDate = (date: string): Date => {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 6 || day === 0;
};

export const getWorkingDay = (startDate: Date, endDate: Date) => {
  let diff = dayjs(endDate).diff(startDate, "day");

  for (let i = 0; i <= diff; i++) {
    const date = dayjs(startDate).add(i, "day");
    if (isWeekend(date.toDate())) {
      diff--; // Subtract 1 from the difference for each weekend day
    }
  }

  return diff + 1;
};

export const getPastDatesWithinYear = (
  year: number,
  currentDate: string,
  weekend?: boolean
): string[] => {
  const startDate = dayjs(`${year}-01-01`);
  const totalDays = dayjs(currentDate).diff(startDate, "day") + 1;
  const pastDates: string[] = [];

  for (let i = 1; i < totalDays; i++) {
    const date = dayjs(currentDate).subtract(i, "day");
    if (weekend) {
      if (date.day() === 6 || date.day() === 0) {
        continue;
      }
    }
    pastDates.push(date.format("YYYY-MM-DD"));
  }

  return pastDates;
};

export function getAllDaysInYear(year: number, weekend?: boolean) {
  const startDate = dayjs(`${year}-01-01`);
  const endDate = dayjs(`${year}-12-31`);
  const totalDays = endDate.diff(startDate, "day") + 1;

  const allDays = [];
  for (let i = 0; i < totalDays; i++) {
    const day = startDate.add(i, "day");
    if (weekend) {
      if (day.day() === 6 || day.day() === 0) {
        continue;
      }
    }
    allDays.push(day.format("YYYY-MM-DD"));
  }

  return allDays;
}

export function renderEvent(year: number, timeSheet: TimeSheet[]) {
  const events: EventInput[] = [];

  const sheetDate = _.uniq(
    timeSheet.map((sheet) => formatDateTime(sheet.date, sheet.month, year))
  );

  const pastDates = _.difference(
    getPastDatesWithinYear(year, dayjs().format("YYYY-MM-DD"), true),
    sheetDate
  );

  const futureDates = _.difference(
    _.difference(getAllDaysInYear(year, true), sheetDate),
    getPastDatesWithinYear(year, dayjs().format("YYYY-MM-DD"))
  );

  for (const sheet of timeSheet) {
    const formatDate = formatDateTime(sheet.date, sheet.month, year);
    if (sheet.session === SessionDate.Morning) {
      events.push({
        title: sheet.session,
        start: `${formatDate}T08:00:00`,
        end: `${formatDate}T12:00:00`,
        extendedProps: {
          timeIn: sheet.timeIn,
          status: sheet.status,
          overTime: sheet.overtime,
          hoursWorked: sheet.hoursWorked,
        },
      });
    }

    if (sheet.session === SessionDate.Afternoon) {
      if (sheet.status === TimeSheetStatus.Submitted) {
        events.push({
          title: sheet.session,
          start: `${formatDate}T13:30:00`,
          end: `${formatDate}T17:30:00`,
          extendedProps: {
            timeIn: sheet.timeIn,
            status: sheet.status,
            overTime: sheet.overtime,
            hoursWorked: sheet.hoursWorked,
          },
        });
      }
    }

    if (sheet.session === SessionDate.Night) {
      events.push({
        title: sheet.session,
        start: `${formatDate}T18:00:00`,
        end: `${formatDate}T22:00:00`,
        extendedProps: {
          timeIn: sheet.timeIn,
          status: sheet.status,
          overTime: sheet.overtime,
          hoursWorked: sheet.hoursWorked,
        },
      });
    }

    if (
      dayjs(formatDate).isSame(new Date(), "day") &&
      !(sheet.session === SessionDate.Morning)
    ) {
      events.push({
        title: SessionDate.Morning,
        start: `${formatDate}T13:30:00`,
        end: `${formatDate}T17:30:00`,
        extendedProps: {
          status: TimeSheetStatus.Unsubmitted,
        },
      });
    } else if (
      pastDates.includes(formatDate) &&
      !(sheet.session === SessionDate.Morning)
    ) {
      events.push({
        title: SessionDate.Morning,
        start: `${formatDate}T13:30:00`,
        end: `${formatDate}T17:30:00`,
        extendedProps: {
          status: TimeSheetStatus.LeaveWithoutRequest,
        },
      });
    }

    if (
      dayjs(formatDate).isSame(new Date(), "day") &&
      !(sheet.session === SessionDate.Afternoon)
    ) {
      events.push({
        title: SessionDate.Afternoon,
        start: `${formatDate}T13:30:00`,
        end: `${formatDate}T17:30:00`,
        extendedProps: {
          status: TimeSheetStatus.Unsubmitted,
        },
      });
    } else if (
      pastDates.includes(formatDate) &&
      !(sheet.session === SessionDate.Afternoon)
    ) {
      events.push({
        title: SessionDate.Afternoon,
        start: `${formatDate}T13:30:00`,
        end: `${formatDate}T17:30:00`,
        extendedProps: {
          status: TimeSheetStatus.LeaveWithoutRequest,
        },
      });
    }
  }

  for (const date of futureDates) {
    events.push({
      title: "Sáng",
      start: `${date}T08:00:00`,
      end: `${date}T17:30:00`,
      extendedProps: {
        status: TimeSheetStatus.Unsubmitted,
      },
    });

    events.push({
      title: "Chiều",
      start: `${date}T13:30:00`,
      end: `${date}T17:30:00`,
      extendedProps: {
        status: TimeSheetStatus.Unsubmitted,
      },
    });
  }

  for (const date of pastDates) {
    events.push({
      title: "Sáng",
      start: `${date}T08:00:00`,
      end: `${date}T12:00:00`,
      extendedProps: {
        status: TimeSheetStatus.LeaveWithoutRequest,
      },
    });

    events.push({
      title: "Chiều",
      start: `${date}T13:30:00`,
      end: `${date}T17:30:00`,
      extendedProps: {
        status: TimeSheetStatus.LeaveWithoutRequest,
      },
    });
  }

  return events;
}
