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

export const getDates = (
  startDate: string | Date,
  endDate: string | Date,
  weekend?: boolean
): string[] => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dates: string[] = [];

  for (
    let current = start;
    current <= end;
    current.setDate(current.getDate() + 1)
  ) {
    // Push the current date formatted to YYYY-MM-DD to the array
    if (weekend) {
      if (current.getDay() === 6 || current.getDay() === 0) {
        continue;
      }
    }
    dates.push(
      `${current.getFullYear()}-${current.getMonth() + 1}-${current.getDate()}`
    );
  }

  return dates;
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

  for (const date of sheetDate) {
    const sheets = timeSheet.filter(
      (sheet) =>
        formatDateTime(sheet.date, sheet.month, year) === date &&
        sheet.status === TimeSheetStatus.Submitted
    );

    const nonExistSession = _.difference(
      [SessionDate.Morning, SessionDate.Afternoon, SessionDate.Night],
      sheets.map((sheet) => sheet.session)
    );

    for (const sh of sheets) {
      if (sh.session === SessionDate.Morning) {
        events.push({
          title: sh.session,
          start: `${date}T08:00:00`,
          end: `${date}T12:00:00`,
          extendedProps: {
            timeIn: sh.timeIn,
            status: sh.status,
            overTime: sh.overtime,
            hoursWorked: sh.hoursWorked,
          },
        });
      }

      if (sh.session === SessionDate.Afternoon) {
        events.push({
          title: sh.session,
          start: `${date}T13:30:00`,
          end: `${date}T17:30:00`,
          extendedProps: {
            timeIn: sh.timeIn,
            status: sh.status,
            overTime: sh.overtime,
            hoursWorked: sh.hoursWorked,
          },
        });
      }

      if (sh.session === SessionDate.Night) {
        events.push({
          title: sh.session,
          start: `${date}T18:00:00`,
          end: `${date}T22:00:00`,
          extendedProps: {
            timeIn: sh.timeIn,
            status: sh.status,
            overTime: sh.overtime,
            hoursWorked: sh.hoursWorked,
          },
        });
      }
    }

    for (const s of nonExistSession) {
      if (dayjs(date).isSame(new Date(), "day") && s === SessionDate.Morning) {
        events.push({
          title: SessionDate.Morning,
          start: `${date}T08:00:00`,
          end: `${date}T12:00:00`,
          extendedProps: {
            status: TimeSheetStatus.Unsubmitted,
          },
        });
      }

      if (
        dayjs(date).isSame(new Date(), "day") &&
        s === SessionDate.Afternoon
      ) {
        events.push({
          title: SessionDate.Afternoon,
          start: `${date}T13:30:00`,
          end: `${date}T17:30:00`,
          extendedProps: {
            status: TimeSheetStatus.Unsubmitted,
          },
        });
      }

      if (
        getPastDatesWithinYear(
          year,
          dayjs().format("YYYY-MM-DD"),
          true
        ).includes(date) &&
        s === SessionDate.Morning
      ) {
        events.push({
          title: SessionDate.Morning,
          start: `${date}T08:30:00`,
          end: `${date}T12:00:00`,
          extendedProps: {
            status: TimeSheetStatus.LeaveWithoutRequest,
          },
        });
      }

      if (
        getPastDatesWithinYear(
          year,
          dayjs().format("YYYY-MM-DD"),
          true
        ).includes(date) &&
        s === SessionDate.Afternoon
      ) {
        events.push({
          title: SessionDate.Afternoon,
          start: `${date}T13:30:00`,
          end: `${date}T17:30:00`,
          extendedProps: {
            status: TimeSheetStatus.LeaveWithoutRequest,
          },
        });
      }
    }
  }

  for (const date of futureDates) {
    events.push({
      title: "Sáng",
      start: `${date}T08:00:00`,
      end: `${date}T12:00:00`,
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
