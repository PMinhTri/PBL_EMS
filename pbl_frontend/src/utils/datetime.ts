import dayjs from "dayjs";

export const clock = () => {
  const date = new Date();
  let hours = date.getHours().toString();
  let minutes = date.getMinutes().toString();
  let seconds = date.getSeconds().toString();

  if (hours.length < 2) {
    hours = "0" + hours;
  }

  if (minutes.length < 2) {
    minutes = "0" + minutes;
  }

  if (seconds.length < 2) {
    seconds = "0" + seconds;
  }

  return hours + ":" + minutes + ":" + seconds;
};

export const formatDateTime = (
  date: number,
  month: number,
  year: number
): string => {
  const dateStr = date.toString();
  const monthStr = month.toString();
  const yearStr = year.toString();

  return `${dateStr}-${monthStr}-${yearStr}`;
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
